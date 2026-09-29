import re

class ContextRiskAnalyzer:
    """
    Analyzes conversation transcripts for sensitive request triggers:
      - Financial transactions / wire transfers
      - OTP / 2FA request
      - Password / PIN request
      - Emergency money demand
      - Confidential credential access
      - Account configuration change
    """
    FINANCIAL_PATTERNS = [
        r"\b(transfer|wire|send|pay|deposit)\b.*?\b(lakh|crore|rupees|dollars|rs|usd|\$|amount|money|fund)\b",
        r"\b(bank|account|neft|rtgs|upi|imps)\b.*?\b(transfer|immediate|urgent)\b",
        r"\b(emergency payment|urgent transfer|send money now)\b"
    ]

    CREDENTIAL_PATTERNS = [
        r"\b(otp|one time password|pin|cvv|password|security code)\b",
        r"\b(share|tell|read out|give me)\b.*?\b(code|otp|password|pin)\b"
    ]

    EMERGENCY_PATTERNS = [
        r"\b(hospital|accident|police|kidnapped|bail|arrested|urgent help)\b",
        r"\b(don't tell anyone|keep this quiet|secret)\b"
    ]

    def analyze_text(self, transcript: str) -> tuple[float, list[str]]:
        if not transcript:
            return 0.0, []

        reasons = []
        text_lower = transcript.lower()
        risk_score = 0.0

        # Check Financial
        for pat in self.FINANCIAL_PATTERNS:
            if re.search(pat, text_lower):
                risk_score += 0.50
                reasons.append("Sensitive request: High-value financial transfer or payment demand detected")
                break

        # Check Credentials / OTP
        for pat in self.CREDENTIAL_PATTERNS:
            if re.search(pat, text_lower):
                risk_score += 0.60
                reasons.append("Sensitive request: Authentication credentials / OTP request detected")
                break

        # Check Emergency / Pressure Tactics
        for pat in self.EMERGENCY_PATTERNS:
            if re.search(pat, text_lower):
                risk_score += 0.35
                reasons.append("Coercive/Emergency pressure phrase pattern detected")
                break

        risk_score = min(1.0, risk_score)
        return risk_score, reasons
