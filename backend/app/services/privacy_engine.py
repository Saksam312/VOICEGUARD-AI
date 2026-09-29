from sqlalchemy.orm import Session
from app.database import PrivacyPolicy, Call, AnalysisEvent

class PrivacyEngine:
    """
    Privacy Controls & Zero-Audio-Retention Engine:
      - Enforces zero raw audio storage by default
      - Manages configurable audio retention policies
      - Sanitizes PII metadata
      - Securely purges historical call analysis data on user request
    """

    @staticmethod
    def get_or_create_policy(db: Session) -> PrivacyPolicy:
        policy = db.query(PrivacyPolicy).first()
        if policy is None:
            policy = PrivacyPolicy(
                audio_retention_minutes=0,
                store_raw_audio=False,
                store_feature_data=True,
                anonymize_metadata=True,
                audit_logging_enabled=True
            )
            db.add(policy)
            db.commit()
            db.refresh(policy)
        return policy

    @staticmethod
    def update_policy(db: Session, retention_minutes: int, store_raw: bool, store_features: bool, anonymize: bool) -> PrivacyPolicy:
        policy = PrivacyEngine.get_or_create_policy(db)
        policy.audio_retention_minutes = retention_minutes
        policy.store_raw_audio = store_raw
        policy.store_feature_data = store_features
        policy.anonymize_metadata = anonymize
        db.commit()
        db.refresh(policy)
        return policy

    @staticmethod
    def sanitize_caller_id(caller_id: str, anonymize: bool = True) -> str:
        if not anonymize or not caller_id or caller_id.startswith("ANON-"):
            return caller_id
        # Mask phone number / identity e.g. +91 9876543210 -> +91 98****3210
        if len(caller_id) > 6:
            return caller_id[:3] + "****" + caller_id[-3:]
        return "ANON-CALLER"

    @staticmethod
    def purge_all_call_data(db: Session) -> int:
        """Securely deletes all historical call sessions and analysis events."""
        events_deleted = db.query(AnalysisEvent).delete()
        calls_deleted = db.query(Call).delete()
        db.commit()
        return calls_deleted
