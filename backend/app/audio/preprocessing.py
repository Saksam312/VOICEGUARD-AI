import io
import wave
import numpy as np
from scipy.signal import resample

def bytes_to_float_array(audio_bytes: bytes, target_sr: int = 16000) -> tuple[np.ndarray, int]:
    """
    Parses raw WAV or PCM byte buffer into mono float32 numpy array normalized between [-1.0, 1.0].
    Performs resampling to target_sr (16000 Hz) if necessary.
    """
    if not audio_bytes or len(audio_bytes) < 44:
        # Fallback dummy signal if buffer is tiny/invalid
        return np.zeros(target_sr * 3, dtype=np.float32), target_sr

    try:
        # Try reading as WAV header
        with io.BytesIO(audio_bytes) as bio:
            with wave.open(bio, 'rb') as wf:
                sr = wf.getframerate()
                nchannels = wf.getnchannels()
                sampwidth = wf.getsampwidth()
                frames = wf.readframes(wf.getnframes())

                if sampwidth == 2:
                    raw_data = np.frombuffer(frames, dtype=np.int16).astype(np.float32) / 32768.0
                elif sampwidth == 4:
                    raw_data = np.frombuffer(frames, dtype=np.int32).astype(np.float32) / 2147483648.0
                else:
                    raw_data = np.frombuffer(frames, dtype=np.uint8).astype(np.float32) / 128.0 - 1.0

                if nchannels > 1:
                    raw_data = raw_data.reshape(-1, nchannels).mean(axis=1)

                if sr != target_sr and len(raw_data) > 0:
                    num_samples = int(len(raw_data) * target_sr / sr)
                    raw_data = resample(raw_data, num_samples).astype(np.float32)
                    sr = target_sr

                return raw_data, sr
    except Exception:
        # Fallback to raw 16-bit PCM mono interpretation
        raw_data = np.frombuffer(audio_bytes, dtype=np.int16).astype(np.float32) / 32768.0
        return raw_data, target_sr

def preprocess_audio(raw_samples: np.ndarray, sample_rate: int = 16000) -> np.ndarray:
    """
    Applies mono conversion, amplitude peak normalization, and DC offset removal.
    """
    if len(raw_samples) == 0:
        return np.zeros(sample_rate * 3, dtype=np.float32)

    # 1. DC offset removal
    samples = raw_samples - np.mean(raw_samples)

    # 2. Peak Normalization
    max_val = np.max(np.abs(samples))
    if max_val > 1e-6:
        samples = samples / max_val

    return samples

def audio_to_spectrogram(samples: np.ndarray, n_fft: int = 512, hop_length: int = 256) -> np.ndarray:
    """
    Computes magnitude STFT Spectrogram for visualization & feature extraction.
    """
    if len(samples) < n_fft:
        # Pad short signals
        samples = np.pad(samples, (0, n_fft - len(samples)))

    window = np.hanning(n_fft)
    num_frames = max(1, (len(samples) - n_fft) // hop_length + 1)
    stft_matrix = np.zeros((n_fft // 2 + 1, num_frames), dtype=np.complex64)

    for i in range(num_frames):
        start = i * hop_length
        chunk = samples[start:start + n_fft]
        if len(chunk) < n_fft:
            chunk = np.pad(chunk, (0, n_fft - len(chunk)))
        stft_matrix[:, i] = np.fft.rfft(chunk * window)

    magnitude = np.abs(stft_matrix)
    # Log scale in dB
    log_spec = 20 * np.log10(np.maximum(1e-5, magnitude))
    return log_spec
