from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import PrivacySettingsSchema
from app.services.privacy_engine import PrivacyEngine

router = APIRouter()

@router.get("/settings", response_model=PrivacySettingsSchema)
def get_privacy_settings(db: Session = Depends(get_db)):
    policy = PrivacyEngine.get_or_create_policy(db)
    return {
        "audio_retention_minutes": policy.audio_retention_minutes,
        "store_raw_audio": policy.store_raw_audio,
        "store_feature_data": policy.store_feature_data,
        "anonymize_metadata": policy.anonymize_metadata,
        "audit_logging_enabled": policy.audit_logging_enabled
    }

@router.put("/settings", response_model=PrivacySettingsSchema)
def update_privacy_settings(settings_in: PrivacySettingsSchema, db: Session = Depends(get_db)):
    policy = PrivacyEngine.update_policy(
        db=db,
        retention_minutes=settings_in.audio_retention_minutes,
        store_raw=settings_in.store_raw_audio,
        store_features=settings_in.store_feature_data,
        anonymize=settings_in.anonymize_metadata
    )
    return settings_in

@router.post("/purge-data")
def purge_call_data(db: Session = Depends(get_db)):
    deleted_count = PrivacyEngine.purge_all_call_data(db)
    return {"message": "All historical audio logs and call analysis events purged successfully.", "calls_deleted": deleted_count}
