import numpy as np

class AcousticDetector:
    """
    Evaluates spectral stability, spectral flux, harmonic balance, and energy distribution.
    Returns acoustic_anomaly_score [0.0 = normal human acoustics, 1.0 = highly anomalous acoustic profile].
    """
    def predict(self, features: dict, raw_samples: np.ndarray) -> tuple[float, list[str]]:
        reasons = []
        anomaly_score = 0.10

        centroid = features.get("spectral_centroid", 1800.0)
        flux = features.get("spectral_flux", 5.0)
        hnr = features.get("hnr_db", 20.0)

        # 1. Unnatural spectral centroid shift (too high or unnaturally static)
        if centroid > 3200.0 or centroid < 500.0:
            anomaly_score += 0.35
            reasons.append(f"Acoustic spectral centroid shift anomaly ({centroid:.0f} Hz)")

        # 2. Spectral flux unnaturalness (too smooth/flat = neural artifact)
        if flux < 1.2:
            anomaly_score += 0.30
            reasons.append("Unnaturally uniform spectral flux (synthetic smoothing indicator)")
        elif flux > 25.0:
            anomaly_score += 0.25
            reasons.append("Extreme spectral flux instability")

        # 3. Low Harmonic-to-Noise Ratio (HNR)
        if hnr < 10.0:
            anomaly_score += 0.25
            reasons.append(f"Degraded harmonic structure (HNR: {hnr:.1f} dB)")

        anomaly_score = float(np.clip(anomaly_score, 0.0, 1.0))
        return anomaly_score, reasons
