import numpy as np

class SyntheticSpeechDetector:
    """
    Evaluates neural vocoder phase discontinuities, high-frequency spectral cutoffs,
    and voice-conversion (VC/RVC) synthesis artifacts.
    Returns synthetic_speech_score [0.0 = authentic human voice, 1.0 = AI generated/cloned].
    """
    def predict(self, features: dict, sample_rate: int = 16000) -> tuple[float, list[str]]:
        reasons = []
        synth_score = 0.05

        hf_artifact = features.get("hf_cutoff_artifact", 0.10)
        flux = features.get("spectral_flux", 5.0)
        jitter = features.get("jitter", 0.01)
        std_f0 = features.get("std_f0", 20.0)

        # 1. High frequency neural vocoder cutoff artifact
        if hf_artifact > 0.60:
            synth_score += 0.50
            reasons.append("High-frequency neural vocoder spectral cutoff artifact detected")
        elif hf_artifact > 0.35:
            synth_score += 0.25
            reasons.append("Elevated spectral brickwall cutoff indicator")

        # 2. Synthetic vocal tract combination (flat prosody + smooth spectral flux)
        if std_f0 < 6.0 and flux < 2.0:
            synth_score += 0.35
            reasons.append("Neural speech synthesis artifact (over-smoothed formant trajectory)")

        # 3. Micro-pitch regularity typical of RVC/DiffSVC models
        if jitter < 0.003 and std_f0 < 8.0:
            synth_score += 0.30
            reasons.append("Voice conversion (RVC/VITS) pitch alignment signature detected")

        synth_score = float(np.clip(synth_score, 0.0, 1.0))
        return synth_score, reasons
