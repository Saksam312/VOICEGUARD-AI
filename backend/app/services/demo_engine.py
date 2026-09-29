class DemoScenarioEngine:
    """
    Generates realistic, reproducible, dynamic demo call timelines for hackathon presentation.
    Scenarios:
      1. GENUINE_EXECUTIVE: Genuine executive call (Low risk)
      2. AI_VOICE_CLONE: AI voice clone (Tacotron/ElevenLabs) (High/Critical risk)
      3. VOICE_CONVERSION: RVC voice conversion (High risk)
      4. REPLAY_ATTACK: Replay attack via speaker (Medium/High risk)
      5. SYNTHETIC_FINANCIAL: Synthetic voice + sensitive financial request (Critical risk)
      6. NOISY_TELEPHONE: Noisy telephone call (Medium risk / high uncertainty)
    """

    SCENARIOS = {
        "GENUINE_EXECUTIVE": {
            "title": "Genuine Executive Call",
            "description": "Authenticated executive discussing routine quarterly project update.",
            "language": "English (Indian Accent)",
            "timeline": [
                {"offset": "00:05", "risk": 8.5, "level": "LOW", "deepfake": 0.05, "speaker_match": 0.95, "context": 0.0, "reason": "✓ Voice authenticity verified"},
                {"offset": "00:10", "risk": 12.0, "level": "LOW", "deepfake": 0.08, "speaker_match": 0.94, "context": 0.0, "reason": "✓ Natural pitch prosody contour"},
                {"offset": "00:15", "risk": 14.2, "level": "LOW", "deepfake": 0.09, "speaker_match": 0.96, "context": 0.0, "reason": "✓ Harmonic ratio within expected baseline"},
                {"offset": "00:20", "risk": 11.8, "level": "LOW", "deepfake": 0.06, "speaker_match": 0.95, "context": 0.0, "reason": "✓ Speaker voiceprint verified"}
            ]
        },
        "AI_VOICE_CLONE": {
            "title": "AI Voice Cloning Attack",
            "description": "Deepfake voice clone attempting identity spoofing during sensitive call.",
            "language": "Hindi",
            "timeline": [
                {"offset": "00:05", "risk": 18.0, "level": "LOW", "deepfake": 0.22, "speaker_match": 0.85, "context": 0.0, "reason": "✓ Initial acoustic greeting"},
                {"offset": "00:10", "risk": 41.5, "level": "MEDIUM", "deepfake": 0.52, "speaker_match": 0.60, "reason": "✓ Unnatural flat pitch prosody contour"},
                {"offset": "00:15", "risk": 68.0, "level": "HIGH", "deepfake": 0.78, "speaker_match": 0.45, "reason": "✓ High-frequency neural vocoder cutoff artifact detected"},
                {"offset": "00:20", "risk": 88.5, "level": "CRITICAL", "deepfake": 0.92, "speaker_match": 0.30, "reason": "✓ Severe voice clone spectral anomaly & speaker mismatch"}
            ]
        },
        "VOICE_CONVERSION": {
            "title": "Voice Conversion (RVC) Attack",
            "description": "Real-time Retrieval-based Voice Conversion (RVC) overlay.",
            "language": "Kannada",
            "timeline": [
                {"offset": "00:05", "risk": 22.0, "level": "LOW", "deepfake": 0.28, "speaker_match": 0.80, "reason": "✓ Micro-pitch tracking active"},
                {"offset": "00:10", "risk": 48.0, "level": "MEDIUM", "deepfake": 0.58, "speaker_match": 0.55, "reason": "✓ RVC micro-pitch alignment signature detected"},
                {"offset": "00:15", "risk": 74.0, "level": "HIGH", "deepfake": 0.84, "speaker_match": 0.40, "reason": "✓ Formant tracking phase discontinuity"},
                {"offset": "00:20", "risk": 81.0, "level": "CRITICAL", "deepfake": 0.89, "speaker_match": 0.35, "reason": "✓ Voice conversion attack confirmed"}
            ]
        },
        "REPLAY_ATTACK": {
            "title": "Replay Attack",
            "description": "Pre-recorded human speech replayed through a smartphone speaker into receiver.",
            "language": "Tamil",
            "timeline": [
                {"offset": "00:05", "risk": 15.0, "level": "LOW", "deepfake": 0.12, "speaker_match": 0.90, "reason": "✓ Speech detected"},
                {"offset": "00:10", "risk": 38.0, "level": "MEDIUM", "deepfake": 0.25, "speaker_match": 0.82, "reason": "✓ Loudspeaker room acoustic reverberation profile detected"},
                {"offset": "00:15", "risk": 58.0, "level": "MEDIUM", "deepfake": 0.35, "speaker_match": 0.75, "reason": "✓ Secondary playback device frequency tilt"},
                {"offset": "00:20", "risk": 64.0, "level": "HIGH", "deepfake": 0.40, "speaker_match": 0.70, "reason": "✓ Replay attack probability elevated (> 60%)"}
            ]
        },
        "SYNTHETIC_FINANCIAL": {
            "title": "Synthetic Voice + Sensitive Financial Request",
            "description": "AI generated voice demanding immediate ₹10 Lakh wire transfer.",
            "language": "English (Indian Accent)",
            "timeline": [
                {"offset": "00:05", "risk": 25.0, "level": "LOW", "deepfake": 0.30, "speaker_match": 0.75, "context": 0.0, "reason": "✓ Call initiated"},
                {"offset": "00:10", "risk": 55.0, "level": "MEDIUM", "deepfake": 0.65, "speaker_match": 0.50, "context": 0.4, "reason": "✓ Unnatural pitch prosody & voice clone indicators"},
                {"offset": "00:15", "risk": 82.0, "level": "CRITICAL", "deepfake": 0.85, "speaker_match": 0.35, "context": 0.85, "reason": "✓ SENSITIVE REQUEST: High-value financial transfer (₹10 Lakh) detected"},
                {"offset": "00:20", "risk": 95.0, "level": "CRITICAL", "deepfake": 0.94, "speaker_match": 0.20, "context": 0.95, "reason": "✓ CRITICAL IMPERSONATION THREAT: Compound AI Clone + Fraudulent Request"}
            ]
        },
        "NOISY_TELEPHONE": {
            "title": "Noisy Cellular Telephone Call",
            "description": "Legitimate caller in noisy environment with G.711 telephone compression.",
            "language": "Bengali",
            "timeline": [
                {"offset": "00:05", "risk": 18.0, "level": "LOW", "deepfake": 0.15, "speaker_match": 0.88, "reason": "✓ Cellular background noise present"},
                {"offset": "00:10", "risk": 32.0, "level": "MEDIUM", "deepfake": 0.28, "speaker_match": 0.78, "reason": "✓ Low SNR detected; energy normalization applied"},
                {"offset": "00:15", "risk": 42.0, "level": "MEDIUM", "deepfake": 0.32, "speaker_match": 0.75, "reason": "✓ Telephone codec compression artifact (G.711 / AMR)"},
                {"offset": "00:20", "risk": 35.0, "level": "MEDIUM", "deepfake": 0.25, "speaker_match": 0.80, "reason": "✓ Model uncertainty elevated; human voice authenticity probable"}
            ]
        }
    }

    @classmethod
    def get_scenario(cls, key: str) -> dict:
        return cls.SCENARIOS.get(key, cls.SCENARIOS["GENUINE_EXECUTIVE"])
