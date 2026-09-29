import numpy as np

class ReplayDetector:
    """
    Detects replay attacks (loudspeaker playback distortion, low-frequency room acoustic resonance, secondary microphone impulse response).
    Returns replay_probability [0.0 = live original microphone recording, 1.0 = replayed audio playback].
    """
    def predict(self, features: dict, raw_samples: np.ndarray) -> tuple[float, list[str]]:
        reasons = []
        replay_prob = 0.05

        centroid = features.get("spectral_centroid", 1800.0)
        hnr = features.get("hnr_db", 20.0)

        # 1. Low frequency room resonance boost (typical of small speaker playback)
        if len(raw_samples) > 1024:
            low_band_energy = np.mean(np.abs(raw_samples[:1024]))
            if low_band_energy > 0.40 and hnr < 14.0:
                replay_prob += 0.40
                reasons.append("Loudspeaker acoustic reverberation profile detected")

        # 2. Secondary microphone frequency response attenuation
        if centroid < 800.0 or centroid > 4200.0:
            replay_prob += 0.35
            reasons.append("Secondary playback device frequency response tilt")

        replay_prob = float(np.clip(replay_prob, 0.0, 1.0))
        return replay_prob, reasons
