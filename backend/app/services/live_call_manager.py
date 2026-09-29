import time
import base64
import numpy as np
from sqlalchemy.orm import Session

from app.audio import bytes_to_float_array, preprocess_audio, process_vad, extract_audio_features
from app.ml import AcousticDetector, ProsodyDetector, SyntheticSpeechDetector, ReplayDetector, SpeakerVerifier, UncertaintyDetector
from app.risk import RiskFusionEngine, ContextRiskAnalyzer
from app.audit import BlockchainAuditLedger
from app.database import Call, AnalysisEvent, SecurityEvent, SpeakerProfile

class LiveCallManager:
    """
    Manages active streaming audio call sessions:
      - Accepts raw audio chunks
      - Maintains rolling sliding audio window
      - Executes multi-signal ensemble + risk fusion
      - Creates security events and audit records
    """
    def __init__(self):
        self.acoustic_det = AcousticDetector()
        self.prosody_det = ProsodyDetector()
        self.synth_det = SyntheticSpeechDetector()
        self.replay_det = ReplayDetector()
        self.speaker_verifier = SpeakerVerifier()
        self.uncertainty_det = UncertaintyDetector()
        self.context_analyzer = ContextRiskAnalyzer()
        self.fusion_engine = RiskFusionEngine()
        self.blockchain_ledger = BlockchainAuditLedger()

    def process_audio_chunk(
        self,
        db: Session,
        call_id: str,
        audio_bytes: bytes,
        timestamp_offset: str = "00:05",
        transcript: str = None,
        expected_speaker_id: str = None
    ) -> dict:

        start_time = time.time()

        # 1. Convert bytes to normalized 16kHz float array
        raw_samples, sr = bytes_to_float_array(audio_bytes, target_sr=16000)
        samples = preprocess_audio(raw_samples, sr)

        # 2. VAD & Speech ratio
        speech_samples, _, speech_ratio = process_vad(samples, sr)

        # 3. Extract Acoustic & Prosodic Features
        features = extract_audio_features(speech_samples if len(speech_samples) > 512 else samples, sr)

        # 4. Multi-Signal Detectors
        acoustic_anomaly, acoustic_reasons = self.acoustic_det.predict(features, samples)
        prosody_anomaly, prosody_reasons = self.prosody_det.predict(features)
        deepfake_score, synthetic_reasons = self.synth_det.predict(features, sr)
        replay_prob, replay_reasons = self.replay_det.predict(features, samples)

        # 5. Speaker Verification
        expected_embedding = None
        if expected_speaker_id:
            spk_profile = db.query(SpeakerProfile).filter(SpeakerProfile.speaker_id == expected_speaker_id).first()
            if spk_profile:
                expected_embedding = spk_profile.embedding_json

        speaker_match_score, speaker_reasons = self.speaker_verifier.predict(features, expected_embedding)

        # 6. Context Risk Analysis
        context_risk_score, context_reasons = self.context_analyzer.analyze_text(transcript)

        # 7. Uncertainty & Category
        uncertainty, category = self.uncertainty_det.predict(
            deepfake_score, acoustic_anomaly, prosody_anomaly, replay_prob, speech_ratio
        )

        # 8. Dynamic Risk Fusion
        fusion_result = self.fusion_engine.calculate_risk(
            deepfake_score=deepfake_score,
            acoustic_anomaly=acoustic_anomaly,
            prosody_anomaly=prosody_anomaly,
            speaker_match_score=speaker_match_score,
            replay_probability=replay_prob,
            context_risk_score=context_risk_score,
            uncertainty=uncertainty,
            acoustic_reasons=acoustic_reasons,
            prosody_reasons=prosody_reasons,
            synthetic_reasons=synthetic_reasons,
            replay_reasons=replay_reasons,
            speaker_reasons=speaker_reasons,
            context_reasons=context_reasons,
            uncertainty_category=category
        )

        elapsed_ms = round((time.time() - start_time) * 1000.0, 1)

        # 9. Database Event Record
        analysis_evt = AnalysisEvent(
            call_id=call_id,
            timestamp_offset=timestamp_offset,
            risk_score=fusion_result["risk_score"],
            risk_level=fusion_result["risk_level"],
            deepfake_score=deepfake_score,
            acoustic_anomaly=acoustic_anomaly,
            prosody_anomaly=prosody_anomaly,
            speaker_match_score=speaker_match_score,
            replay_probability=replay_prob,
            context_risk_score=context_risk_score,
            uncertainty=uncertainty,
            explanation_json=fusion_result["explanations"],
            recommended_action=fusion_result["recommended_action"],
            audio_snr_db=round(float(features.get("hnr_db", 25.0)), 1),
            latency_ms=elapsed_ms
        )

        db.add(analysis_evt)

        # Update Call record
        call_obj = db.query(Call).filter(Call.call_id == call_id).first()
        if call_obj:
            call_obj.final_risk_score = max(call_obj.final_risk_score, fusion_result["risk_score"])
            call_obj.risk_level = fusion_result["risk_level"]

        db.commit()

        # 10. Trigger Security Event & Blockchain Ledger if Risk is HIGH or CRITICAL
        if fusion_result["risk_level"] in ["HIGH", "CRITICAL"]:
            evt_id = f"VG-EVT-{int(time.time()*1000)}"
            sec_evt = SecurityEvent(
                event_id=evt_id,
                call_id=call_id,
                severity=fusion_result["risk_level"],
                title=f"Impersonation Threat Flagged ({fusion_result['risk_score']}%)",
                description="; ".join(fusion_result["explanations"]),
                action_taken=fusion_result["recommended_action"],
                audit_hash="PENDING"
            )
            db.add(sec_evt)
            db.commit()

            # Add to SHA-256 Tamper-Evident Ledger
            audit_rec = self.blockchain_ledger.add_audit_event(
                db=db,
                event_id=evt_id,
                call_id=call_id,
                risk_score=fusion_result["risk_score"],
                model_version="VoiceGuard v2.0-MultiEnsemble",
                action=fusion_result["recommended_action"],
                analysis_payload=fusion_result
            )

            sec_evt.audit_hash = audit_rec.block_hash
            db.commit()

        return {
            "call_id": call_id,
            "timestamp_offset": timestamp_offset,
            "risk_score": fusion_result["risk_score"],
            "risk_level": fusion_result["risk_level"],
            "signals": fusion_result["signals"],
            "uncertainty_category": category,
            "explanations": fusion_result["explanations"],
            "recommended_action": fusion_result["recommended_action"],
            "audio_metrics": {
                "snr_db": round(float(features.get("hnr_db", 25.0)), 1),
                "speech_duration_sec": round(float(len(speech_samples) / 16000.0), 2),
                "latency_ms": elapsed_ms
            }
        }

live_call_manager = LiveCallManager()
