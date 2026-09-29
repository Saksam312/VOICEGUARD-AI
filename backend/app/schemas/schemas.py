from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

# --- AUTH SCHEMAS ---
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    username: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    role: Optional[str] = "SECURITY_ANALYST"

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str] = None
    role: str
    is_active: bool

    class Config:
        from_attributes = True

# --- ANALYSIS SCHEMAS ---
class SignalBreakdown(BaseModel):
    deepfake_score: float = Field(..., ge=0.0, le=1.0)
    acoustic_anomaly: float = Field(..., ge=0.0, le=1.0)
    prosody_anomaly: float = Field(..., ge=0.0, le=1.0)
    speaker_match_score: float = Field(..., ge=0.0, le=1.0)
    replay_probability: float = Field(..., ge=0.0, le=1.0)
    context_risk_score: float = Field(..., ge=0.0, le=1.0)
    uncertainty: float = Field(..., ge=0.0, le=1.0)

class AudioMetrics(BaseModel):
    snr_db: float
    speech_duration_sec: float
    latency_ms: float

class AudioAnalysisResponse(BaseModel):
    call_id: str
    timestamp_offset: str
    risk_score: float = Field(..., ge=0.0, le=100.0)
    risk_level: str # LOW, MEDIUM, HIGH, CRITICAL
    signals: SignalBreakdown
    explanations: List[str]
    recommended_action: str
    audio_metrics: AudioMetrics

class AudioAnalysisRequest(BaseModel):
    caller_id: Optional[str] = "UNKNOWN_CALLER"
    audio_base64: Optional[str] = None
    expected_speaker_id: Optional[str] = None

# --- CALL & TIMELINE SCHEMAS ---
class CallStartRequest(BaseModel):
    caller_id: Optional[str] = "Caller-8819"
    recipient_id: Optional[str] = "Security-SOC"
    language: Optional[str] = "en-IN"
    is_demo: bool = False
    demo_scenario: Optional[str] = None

class CallResponse(BaseModel):
    call_id: str
    caller_id: Optional[str]
    start_time: datetime
    status: str
    final_risk_score: float
    risk_level: str
    language: str
    is_demo: bool

    class Config:
        from_attributes = True

class CallTimelineItem(BaseModel):
    timestamp_offset: str
    risk_score: float
    risk_level: str
    primary_signal: str
    explanations: List[str]
    recommended_action: str

# --- SPEAKER VERIFICATION SCHEMAS ---
class SpeakerRegisterRequest(BaseModel):
    speaker_id: str
    name: str
    role_or_title: Optional[str] = "Executive"
    audio_base64: Optional[str] = None

class SpeakerVerifyRequest(BaseModel):
    speaker_id: str
    audio_base64: str

class SpeakerVerifyResponse(BaseModel):
    speaker_id: str
    is_verified: bool
    similarity_score: float
    threshold: float = 0.75
    details: str

class SpeakerProfileResponse(BaseModel):
    speaker_id: str
    name: str
    role_or_title: Optional[str]
    sample_count: int
    registered_at: datetime

    class Config:
        from_attributes = True

# --- MODEL REGISTRY & EVALUATION SCHEMAS ---
class ModelRegistryResponse(BaseModel):
    model_id: str
    name: str
    version: str
    architecture: str
    dataset_version: str
    status: str
    features_list: List[str]
    metrics_json: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True

class ModelEvaluationResponse(BaseModel):
    model_id: str
    dataset_name: str
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    roc_auc: float
    eer: float
    far: float
    frr: float
    avg_latency_ms: float

    class Config:
        from_attributes = True

# --- ATTACK LAB SCHEMAS ---
class AttackTestRequest(BaseModel):
    attack_type: str # GENUINE, TTS_VITS, VOICE_CONVERSION_RVC, REPLAY_LOUDSPEAKER, NOISY_CELLULAR
    sample_name: str
    audio_base64: Optional[str] = None

class AttackTestResponse(BaseModel):
    test_id: str
    attack_type: str
    sample_name: str
    detected_risk_score: float
    detected_level: str
    is_correct: bool
    signals: SignalBreakdown
    explanations: List[str]

# --- SECURITY & BLOCKCHAIN AUDIT SCHEMAS ---
class SecurityEventResponse(BaseModel):
    event_id: str
    call_id: str
    severity: str
    title: str
    description: str
    action_taken: str
    audit_hash: str
    timestamp: datetime

    class Config:
        from_attributes = True

class AuditRecordResponse(BaseModel):
    block_index: int
    event_id: str
    call_id: str
    timestamp_str: str
    risk_score: float
    model_version: str
    action: str
    analysis_hash: str
    previous_hash: str
    block_hash: str

    class Config:
        from_attributes = True

class VerifyChainResponse(BaseModel):
    total_blocks: int
    is_valid: bool
    tampered_block_index: Optional[int] = None
    message: str

# --- DATA DRIFT & PRIVACY SCHEMAS ---
class DataDriftResponse(BaseModel):
    report_id: str
    feature_name: str
    baseline_mean: float
    current_mean: float
    psi_score: float
    ks_statistic: float
    p_value: float
    drift_status: str

class PrivacySettingsSchema(BaseModel):
    audio_retention_minutes: int = 0
    store_raw_audio: bool = False
    store_feature_data: bool = True
    anonymize_metadata: bool = True
    audit_logging_enabled: bool = True
