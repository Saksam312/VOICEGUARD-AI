import numpy as np

def calculate_energy(samples: np.ndarray, frame_length: int = 512) -> np.ndarray:
    """Computes short-time energy across frame windows."""
    num_frames = max(1, len(samples) // frame_length)
    energies = np.zeros(num_frames, dtype=np.float32)
    for i in range(num_frames):
        chunk = samples[i * frame_length:(i + 1) * frame_length]
        energies[i] = np.sum(chunk ** 2) / frame_length
    return energies

def calculate_zcr(samples: np.ndarray, frame_length: int = 512) -> np.ndarray:
    """Computes zero-crossing rate across frame windows."""
    num_frames = max(1, len(samples) // frame_length)
    zcr = np.zeros(num_frames, dtype=np.float32)
    for i in range(num_frames):
        chunk = samples[i * frame_length:(i + 1) * frame_length]
        if len(chunk) > 1:
            zcr[i] = np.sum(np.abs(np.diff(np.sign(chunk)))) / (2 * len(chunk))
    return zcr

def process_vad(samples: np.ndarray, sample_rate: int = 16000, frame_length: int = 512, energy_threshold: float = 0.005) -> tuple[np.ndarray, np.ndarray, float]:
    """
    Performs Voice Activity Detection.
    Returns:
      (active_speech_samples, voice_mask, speech_ratio)
    """
    if len(samples) == 0:
        return samples, np.array([]), 0.0

    energies = calculate_energy(samples, frame_length)
    speech_mask_frames = energies > energy_threshold

    # Expand frame mask back to sample level
    voice_mask = np.repeat(speech_mask_frames, frame_length)
    if len(voice_mask) < len(samples):
        voice_mask = np.pad(voice_mask, (0, len(samples) - len(voice_mask)), mode='edge')
    else:
        voice_mask = voice_mask[:len(samples)]

    active_speech = samples[voice_mask]
    speech_ratio = float(np.mean(speech_mask_frames)) if len(speech_mask_frames) > 0 else 0.0

    return active_speech, voice_mask, speech_ratio

def calculate_speech_ratio(samples: np.ndarray) -> float:
    _, _, ratio = process_vad(samples)
    return ratio
