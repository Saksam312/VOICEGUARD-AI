import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database.connection import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    role = Column(String, default="SECURITY_ANALYST") # USER, SECURITY_ANALYST, ADMIN
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Call(Base):
    __tablename__ = "calls"

    id = Column(Integer, primary_key=True, index=True)
    call_id = Column(String, unique=True, index=True, nullable=False) # e.g. VG-2026-8819
    caller_id = Column(String, nullable=True)
    recipient_id = Column(String, nullable=True)
    start_time = Column(DateTime, default=datetime.datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    duration_seconds = Column(Float, default=0.0)
    status = Column(String, default="ACTIVE") # ACTIVE, ENDED, FLAGGED, TERMINATED
    final_risk_score = Column(Float, default=0.0)
    risk_level = Column(String, default="LOW") # LOW, MEDIUM, HIGH, CRITICAL
    primary_threat = Column(String, nullable=True)
    language = Column(String, default="en-IN")
    is_demo = Column(Boolean, default=False)
    demo_scenario = Column(String, nullable=True)

    analysis_events = relationship("AnalysisEvent", back_populates="call", cascade="all, delete-orphan")
    security_events = relationship("SecurityEvent", back_populates="call", cascade="all, delete-orphan")

class AnalysisEvent(Base):
    __tablename__ = "analysis_events"

    id = Column(Integer, primary_key=True, index=True)
    call_id = Column(String, ForeignKey("calls.call_id"), index=True, nullable=False)
    timestamp_offset = Column(String, nullable=False) # e.g. "00:15"
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    risk_score = Column(Float, nullable=False)
    risk_level = Column(String, nullable=False)
    
    deepfake_score = Column(Float, default=0.0)
    acoustic_anomaly = Column(Float, default=0.0)
    prosody_anomaly = Column(Float, default=0.0)
    speaker_match_score = Column(Float, default=1.0)
    replay_probability = Column(Float, default=0.0)
    context_risk_score = Column(Float, default=0.0)
    uncertainty = Column(Float, default=0.0)
    
    explanation_json = Column(JSON, default=list) # List of explanations
    recommended_action = Column(String, nullable=True)
    audio_snr_db = Column(Float, default=30.0)
    latency_ms = Column(Float, default=40.0)

    call = relationship("Call", back_populates="analysis_events")

class SpeakerProfile(Base):
    __tablename__ = "speaker_profiles"

    id = Column(Integer, primary_key=True, index=True)
    speaker_id = Column(String, unique=True, index=True, nullable=False) # e.g. SPK-EXEC-01
    name = Column(String, nullable=False)
    role_or_title = Column(String, nullable=True)
    embedding_json = Column(JSON, nullable=False) # Fingerprint feature vector
    sample_count = Column(Integer, default=1)
    registered_at = Column(DateTime, default=datetime.datetime.utcnow)

class ModelRegistry(Base):
    __tablename__ = "model_registry"

    id = Column(Integer, primary_key=True, index=True)
    model_id = Column(String, unique=True, index=True, nullable=False) # e.g. VG-MOD-2.0
    name = Column(String, nullable=False)
    version = Column(String, nullable=False)
    architecture = Column(String, nullable=False) # Multi-Signal Ensemble / ResNet-Spectrogram / Prosody-LSTM
    dataset_version = Column(String, nullable=False)
    status = Column(String, default="DEPLOYED") # DEPLOYED, STAGING, ARCHIVED, BASELINE
    features_list = Column(JSON, default=list)
    hyperparams_json = Column(JSON, default=dict)
    metrics_json = Column(JSON, default=dict) # Precision, Recall, F1, EER, AUC
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ModelEvaluation(Base):
    __tablename__ = "model_evaluations"

    id = Column(Integer, primary_key=True, index=True)
    model_id = Column(String, ForeignKey("model_registry.model_id"), nullable=False)
    dataset_name = Column(String, nullable=False) # ASVspoof2021 / Custom-Indian-Voice-Corpus
    accuracy = Column(Float, nullable=False)
    precision = Column(Float, nullable=False)
    recall = Column(Float, nullable=False)
    f1_score = Column(Float, nullable=False)
    roc_auc = Column(Float, nullable=False)
    eer = Column(Float, nullable=False) # Equal Error Rate
    far = Column(Float, nullable=False) # False Acceptance Rate
    frr = Column(Float, nullable=False) # False Rejection Rate
    avg_latency_ms = Column(Float, nullable=False)
    evaluated_at = Column(DateTime, default=datetime.datetime.utcnow)

class AttackTest(Base):
    __tablename__ = "attack_tests"

    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(String, unique=True, index=True, nullable=False)
    attack_type = Column(String, nullable=False) # GENUINE, TTS_VITS, VOICE_CONVERSION_RVC, REPLAY_LOUDSPEAKER, NOISY_CELLULAR
    sample_name = Column(String, nullable=False)
    detected_risk_score = Column(Float, nullable=False)
    detected_level = Column(String, nullable=False)
    is_correct = Column(Boolean, nullable=False)
    explanation_summary = Column(Text, nullable=True)
    tested_at = Column(DateTime, default=datetime.datetime.utcnow)

class SecurityEvent(Base):
    __tablename__ = "security_events"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(String, unique=True, index=True, nullable=False) # e.g. VG-EVT-2026-001
    call_id = Column(String, ForeignKey("calls.call_id"), index=True, nullable=False)
    severity = Column(String, nullable=False) # LOW, MEDIUM, HIGH, CRITICAL
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    action_taken = Column(String, nullable=False)
    audit_hash = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    call = relationship("Call", back_populates="security_events")

class AuditRecord(Base):
    __tablename__ = "audit_records"

    id = Column(Integer, primary_key=True, index=True)
    block_index = Column(Integer, unique=True, index=True, nullable=False)
    event_id = Column(String, nullable=False)
    call_id = Column(String, nullable=False)
    timestamp_str = Column(String, nullable=False)
    risk_score = Column(Float, nullable=False)
    model_version = Column(String, nullable=False)
    action = Column(String, nullable=False)
    analysis_hash = Column(String, nullable=False)
    previous_hash = Column(String, nullable=False)
    block_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class DataDriftReport(Base):
    __tablename__ = "data_drift_reports"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(String, unique=True, index=True, nullable=False)
    feature_name = Column(String, nullable=False)
    baseline_mean = Column(Float, nullable=False)
    current_mean = Column(Float, nullable=False)
    psi_score = Column(Float, nullable=False) # Population Stability Index
    ks_statistic = Column(Float, nullable=False) # Kolmogorov-Smirnov
    p_value = Column(Float, nullable=False)
    drift_status = Column(String, nullable=False) # STABLE, SLIGHT_DRIFT, SEVERE_DRIFT
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class PrivacyPolicy(Base):
    __tablename__ = "privacy_policies"

    id = Column(Integer, primary_key=True, index=True)
    audio_retention_minutes = Column(Integer, default=0)
    store_raw_audio = Column(Boolean, default=False)
    store_feature_data = Column(Boolean, default=True)
    anonymize_metadata = Column(Boolean, default=True)
    audit_logging_enabled = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)
