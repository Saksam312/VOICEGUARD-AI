from app.config import settings
from app.risk.explainability import ExplainabilityGenerator

class RiskFusionEngine:
    """
    Multi-Signal Risk Fusion Engine:
    Combines deepfake_score, acoustic_anomaly, prosody_anomaly, speaker_mismatch,
    replay_probability, context_risk, and model_uncertainty into a 0-100 IMPERSONATION RISK SCORE.
    """
    def __init__(self):
        self.weights = {
            "deepfake": settings.WEIGHT_DEEPFAKE,
            "speaker_mismatch": settings.WEIGHT_SPEAKER_MISMATCH,
            "acoustic": settings.WEIGHT_ACOUSTIC_ANOMALY,
            "prosody": settings.WEIGHT_PROSODY_ANOMALY,
            "replay": settings.WEIGHT_REPLAY,
            "context": settings.WEIGHT_CONTEXT_RISK
        }
        self.xai_gen = ExplainabilityGenerator()

    def calculate_risk(
        self,
        deepfake_score: float,
        acoustic_anomaly: float,
        prosody_anomaly: float,
        speaker_match_score: float,
        replay_probability: float,
        context_risk_score: float,
        uncertainty: float,
        acoustic_reasons: list[str],
        prosody_reasons: list[str],
        synthetic_reasons: list[str],
        replay_reasons: list[str],
        speaker_reasons: list[str],
        context_reasons: list[str],
        uncertainty_category: str
    ) -> dict:

        speaker_mismatch = 1.0 - speaker_match_score

        # Linear weighted baseline score [0.0, 1.0]
        base_score = (
            deepfake_score * self.weights["deepfake"] +
            speaker_mismatch * self.weights["speaker_mismatch"] +
            acoustic_anomaly * self.weights["acoustic"] +
            prosody_anomaly * self.weights["prosody"] +
            replay_probability * self.weights["replay"] +
            context_risk_score * self.weights["context"]
        )

        # Non-linear risk multiplier for compound threats
        # e.g., High Deepfake + High Context Risk (Sensitive Financial Request)
        compound_penalty = 0.0
        if deepfake_score > 0.60 and context_risk_score > 0.40:
            compound_penalty += 0.20
        if deepfake_score > 0.60 and speaker_mismatch > 0.50:
            compound_penalty += 0.15

        raw_score = min(1.0, base_score + compound_penalty)
        final_risk_score = round(raw_score * 100.0, 1)

        # Map to Risk Level
        if final_risk_score <= settings.RISK_LOW_MAX:
            risk_level = "LOW"
        elif final_risk_score <= settings.RISK_MEDIUM_MAX:
            risk_level = "MEDIUM"
        elif final_risk_score <= settings.RISK_HIGH_MAX:
            risk_level = "HIGH"
        else:
            risk_level = "CRITICAL"

        # Generate XAI Explanations
        explanations = self.xai_gen.generate_explanations(
            acoustic_reasons, prosody_reasons, synthetic_reasons,
            replay_reasons, speaker_reasons, context_reasons,
            uncertainty_category
        )

        recommended_action = self.xai_gen.get_recommended_action(
            risk_level, context_risk_score, speaker_match_score
        )

        return {
            "risk_score": final_risk_score,
            "risk_level": risk_level,
            "signals": {
                "deepfake_score": round(deepfake_score, 3),
                "acoustic_anomaly": round(acoustic_anomaly, 3),
                "prosody_anomaly": round(prosody_anomaly, 3),
                "speaker_match_score": round(speaker_match_score, 3),
                "replay_probability": round(replay_probability, 3),
                "context_risk_score": round(context_risk_score, 3),
                "uncertainty": round(uncertainty, 3)
            },
            "uncertainty_category": uncertainty_category,
            "explanations": explanations,
            "recommended_action": recommended_action
        }
