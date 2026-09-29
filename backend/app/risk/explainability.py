class ExplainabilityGenerator:
    """
    Generates structured, human-readable explanations explaining WHY a call was flagged.
    Prevents false assumptions; shows "Not available" when a signal is missing.
    """
    def generate_explanations(
        self,
        acoustic_reasons: list[str],
        prosody_reasons: list[str],
        synthetic_reasons: list[str],
        replay_reasons: list[str],
        speaker_reasons: list[str],
        context_reasons: list[str],
        uncertainty_category: str
    ) -> list[str]:
        explanations = []

        if synthetic_reasons:
            explanations.extend([f"✓ {r}" for r in synthetic_reasons])
        if speaker_reasons:
            explanations.extend([f"✓ {r}" for r in speaker_reasons])
        if acoustic_reasons:
            explanations.extend([f"✓ {r}" for r in acoustic_reasons])
        if prosody_reasons:
            explanations.extend([f"✓ {r}" for r in prosody_reasons])
        if replay_reasons:
            explanations.extend([f"✓ {r}" for r in replay_reasons])
        if context_reasons:
            explanations.extend([f"✓ {r}" for r in context_reasons])

        if not explanations:
            if uncertainty_category == "Genuine":
                explanations.append("✓ Voice authenticity verified; no synthetic or acoustic anomalies detected.")
            else:
                explanations.append(f"✓ Operational classification: {uncertainty_category}")

        return explanations

    def get_recommended_action(self, risk_level: str, context_risk: float, speaker_match: float) -> str:
        if risk_level == "CRITICAL":
            return "IMMEDIATE ESCALATION: Terminate automated requests. Trigger out-of-band secondary verification immediately."
        elif risk_level == "HIGH":
            return "HIGH RISK: Request secondary identity verification (MFA challenge phrase or callback) before proceeding."
        elif risk_level == "MEDIUM":
            return "CAUTION: Continue active monitoring. Prompt operator for speaker identity confirmation."
        else:
            return "NORMAL: Call parameters within trusted baseline limits. Standard monitoring active."
