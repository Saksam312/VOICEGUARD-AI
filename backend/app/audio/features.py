import numpy as np
from scipy.signal import find_peaks
from app.audio.preprocessing import audio_to_spectrogram

def compute_spectral_centroid(samples: np.ndarray, sr: int = 16000, n_fft: int = 512) -> float:
    """Computes mean spectral centroid (frequency center of mass)."""
    spec = audio_to_spectrogram(samples, n_fft)
    freqs = np.fft.rfftfreq(n_fft, d=1.0/sr).reshape(-1, 1)
    linear_spec = 10 ** (spec / 20)
    total_energy = np.sum(linear_spec, axis=0)
    total_energy = np.maximum(total_energy, 1e-6)
    centroids = np.sum(freqs * linear_spec, axis=0) / total_energy
    return float(np.mean(centroids))

def compute_spectral_flux(samples: np.ndarray, n_fft: int = 512) -> float:
    """Computes spectral flux (rate of spectral frame changes)."""
    spec = audio_to_spectrogram(samples, n_fft)
    linear_spec = 10 ** (spec / 20)
    if linear_spec.shape[1] < 2:
        return 0.0
    diff = np.diff(linear_spec, axis=1)
    flux = np.sqrt(np.sum(diff ** 2, axis=0))
    return float(np.mean(flux))

def compute_hnr(samples: np.ndarray, sr: int = 16000) -> float:
    """Computes Harmonic-to-Noise Ratio (HNR in dB)."""
    if len(samples) < 512:
        return 15.0
    corr = np.correlate(samples, samples, mode='full')
    corr = corr[len(corr)//2:]
    peaks, _ = find_peaks(corr[20:400], distance=10)
    if len(peaks) == 0:
        return 10.0
    max_peak_val = corr[peaks[0] + 20]
    total_energy = corr[0]
    if total_energy <= max_peak_val or max_peak_val <= 0:
        return 20.0
    noise_energy = max(1e-5, total_energy - max_peak_val)
    hnr = 10 * np.log10(max_peak_val / noise_energy)
    return float(np.clip(hnr, 0.0, 40.0))

def compute_pitch_f0(samples: np.ndarray, sr: int = 16000) -> tuple[float, float, float, float]:
    """
    Computes Pitch F0 contour metrics: (mean_f0, std_f0, jitter, shimmer).
    Human speech typical F0 is 80Hz - 300Hz.
    """
    if len(samples) < 1024:
        return 150.0, 20.0, 0.01, 0.02

    frame_len = 1024
    hop_len = 512
    num_frames = max(1, (len(samples) - frame_len) // hop_len)
    f0_list = []
    amp_list = []

    for i in range(num_frames):
        chunk = samples[i * hop_len:i * hop_len + frame_len]
        amp_list.append(np.max(np.abs(chunk)))
        corr = np.correlate(chunk, chunk, mode='full')
        corr = corr[len(corr)//2:]

        min_lag = int(sr / 350) # ~45 samples
        max_lag = int(sr / 75)  # ~213 samples
        if len(corr) > max_lag:
            window_corr = corr[min_lag:max_lag]
            if len(window_corr) > 0 and np.max(window_corr) > 0.1 * corr[0]:
                peak_lag = min_lag + np.argmax(window_corr)
                f0 = sr / peak_lag
                f0_list.append(f0)

    if len(f0_list) < 2:
        return 150.0, 15.0, 0.01, 0.02

    f0_arr = np.array(f0_list)
    mean_f0 = float(np.mean(f0_arr))
    std_f0 = float(np.std(f0_arr))

    # Jitter: cycle-to-cycle F0 variation
    f0_diffs = np.abs(np.diff(f0_arr))
    jitter = float(np.mean(f0_diffs) / (mean_f0 + 1e-5))

    # Shimmer: cycle-to-cycle amplitude variation
    amp_arr = np.array(amp_list)
    amp_diffs = np.abs(np.diff(amp_arr))
    shimmer = float(np.mean(amp_diffs) / (np.mean(amp_arr) + 1e-5))

    return mean_f0, std_f0, jitter, shimmer

def compute_high_freq_cutoff_artifact(samples: np.ndarray, sr: int = 16000) -> float:
    """
    Detects steep high-frequency energy cutoffs (e.g. at 4kHz or 7.5kHz) typical of neural TTS/VC vocoders.
    Returns artifact ratio score [0.0 = natural, 1.0 = heavy artificial cutoff].
    """
    spec = audio_to_spectrogram(samples, n_fft=512)
    freqs = np.fft.rfftfreq(512, d=1.0/sr)
    mean_spectrum = np.mean(10 ** (spec / 20), axis=1)

    # Ratio of high-frequency energy (> 7kHz) to mid-frequency energy (1kHz - 4kHz)
    mid_mask = (freqs >= 1000) & (freqs <= 4000)
    high_mask = freqs >= 7000

    mid_energy = np.mean(mean_spectrum[mid_mask]) if np.sum(mid_mask) > 0 else 1.0
    high_energy = np.mean(mean_spectrum[high_mask]) if np.sum(high_mask) > 0 else 0.001

    ratio = high_energy / (mid_energy + 1e-6)
    # Neural vocoders often show unnaturally sharp roll-offs (ratio < 0.005) or phase brickwall artifacts
    if ratio < 0.002:
        return 0.85 # Strong cutoff indication
    elif ratio < 0.008:
        return 0.45
    return 0.10

def extract_mfcc(samples: np.ndarray, sr: int = 16000, n_mfcc: int = 20) -> np.ndarray:
    """
    Extracts 20 MFCC coefficient averages across time frames.
    """
    spec = audio_to_spectrogram(samples, n_fft=512)
    # Simplified mel filterbank weighting over log spectrum
    num_bins = spec.shape[0]
    weights = np.cos(np.outer(np.arange(n_mfcc), np.linspace(0, np.pi, num_bins)))
    mfcc_matrix = np.dot(weights, spec)
    return np.mean(mfcc_matrix, axis=1)

def extract_audio_features(samples: np.ndarray, sr: int = 16000) -> dict:
    """
    Master feature extractor returning structured dictionary of acoustic and prosodic features.
    """
    centroid = compute_spectral_centroid(samples, sr)
    flux = compute_spectral_flux(samples)
    hnr = compute_hnr(samples, sr)
    mean_f0, std_f0, jitter, shimmer = compute_pitch_f0(samples, sr)
    hf_artifact = compute_high_freq_cutoff_artifact(samples, sr)
    mfccs = extract_mfcc(samples, sr).tolist()

    return {
        "spectral_centroid": centroid,
        "spectral_flux": flux,
        "hnr_db": hnr,
        "mean_f0": mean_f0,
        "std_f0": std_f0,
        "jitter": jitter,
        "shimmer": shimmer,
        "hf_cutoff_artifact": hf_artifact,
        "mfcc_vector": mfccs
    }
