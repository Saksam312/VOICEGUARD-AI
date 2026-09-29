import numpy as np

class ProsodyDetector:
    """
    Evaluates prosody: pitch stability, jitter, shimmer, speaking rhythm, and intonation.
    Returns prosody_anomaly_score [0.0 = natural human prosody, 1.0 = highly robotic/cloned prosody].
    """
    def predict(self, features: dict) -> tuple[float, list[str]]:
        reasons = []
        anomaly_score = 0.08

        mean_f0 = features.get("mean_f0", 150.0)
        std_f0 = features.get("std_f0", 20.0)
        jitter = features.get("jitter", 0.01)
        shimmer = features.get("shimmer", 0.02)

        # 1. Pitch standard deviation (flat pitch contour = TTS monotonous generation)
        if std_f0 < 4.0:
            anomaly_score += 0.40
            reasons.append("Unnaturally flat pitch contour (monotonous prosody indicator)")
        elif std_f0 > 75.0:
            anomaly_score += 0.30
            reasons.append(f"Unnatural pitch variance instability (F0 std: {std_f0:.1f} Hz)")

        # 2. Pitch jitter anomaly (too low jitter < 0.002 = synthetic pitch perfection)
        if jitter < 0.002:
            anomaly_score += 0.30
            reasons.append("Pitch jitter unnaturally low (synthetic vocal tract precision)")
        elif jitter > 0.08:
            anomaly_score += 0.25
            reasons.append("Excessive vocal jitter instability")

        # 3. Shimmer anomaly
        if shimmer < 0.003:
            anomaly_score += 0.20
            reasons.append("Vocal amplitude shimmer unnaturally low")

        anomaly_score = float(np.clip(anomaly_score, 0.0, 1.0))
        return anomaly_score, reasons
