import numpy as np

class UncertaintyDetector:
    """
    Evaluates multi-signal ensemble variance to estimate overall model uncertainty
    and classify audio into 5 operational categories:
      - Genuine
      - Known synthetic
      - Suspicious
      - Unknown synthetic pattern
      - Uncertain
    """
    def predict(self, deepfake_score: float, acoustic_anomaly: float, prosody_anomaly: float, replay_prob: float, speech_ratio: float) -> tuple[float, str]:
        # Variance across individual signal detectors
        scores = [deepfake_score, acoustic_anomaly, prosody_anomaly, replay_prob]
        score_var = float(np.var(scores))
        
        # High uncertainty if speech energy is minimal or detectors disagree strongly
        if speech_ratio < 0.15:
            uncertainty = 0.85
            category = "Uncertain"
        elif score_var > 0.12:
            uncertainty = float(np.clip(score_var * 2.5, 0.35, 0.75))
            category = "Suspicious"
        elif max(scores) < 0.30:
            uncertainty = 0.05
            category = "Genuine"
        elif deepfake_score > 0.70 or (acoustic_anomaly > 0.65 and prosody_anomaly > 0.60):
            uncertainty = 0.10
            category = "Known synthetic"
        elif max(scores) > 0.60 and score_var > 0.08:
            uncertainty = 0.45
            category = "Unknown synthetic pattern"
        else:
            uncertainty = 0.20
            category = "Suspicious"

        return uncertainty, category
