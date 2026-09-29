import os
# pyrefly: ignore [missing-import]
from pydantic_settings import BaseSettings
from typing import Dict

class Settings(BaseSettings):
    PROJECT_NAME: str = "VOICEGUARD AI"
    PROJECT_SUBTITLE: str = "Real-Time AI Voice Integrity & Impersonation Defense Platform"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "voiceguard_super_secret_jwt_key_2026_aicte_cybersecurity")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./voiceguard.db")
    
    # Risk Thresholds
    RISK_LOW_MAX: float = 30.0
    RISK_MEDIUM_MAX: float = 60.0
    RISK_HIGH_MAX: float = 80.0
    # > 80 is CRITICAL
    
    # Baseline Configurable Ensemble Signal Weights
    WEIGHT_DEEPFAKE: float = 0.35
    WEIGHT_SPEAKER_MISMATCH: float = 0.20
    WEIGHT_ACOUSTIC_ANOMALY: float = 0.15
    WEIGHT_PROSODY_ANOMALY: float = 0.15
    WEIGHT_REPLAY: float = 0.05
    WEIGHT_CONTEXT_RISK: float = 0.10
    
    # Audio settings
    SAMPLE_RATE: int = 16000
    CHANNELS: int = 1
    WINDOW_SIZE_SEC: float = 3.0
    STRIDE_SEC: float = 0.5
    
    # Privacy defaults
    AUDIO_RETENTION_MINUTES: int = 0
    STORE_RAW_AUDIO: bool = False
    STORE_FEATURE_DATA: bool = True
    AUDIT_LOGGING_ENABLED: bool = True

    class Config:
        case_sensitive = True

settings = Settings()
