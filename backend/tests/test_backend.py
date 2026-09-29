import pytest
import numpy as np
from app.audio import preprocess_audio, process_vad, extract_audio_features
from app.ml import AcousticDetector, ProsodyDetector, SyntheticSpeechDetector, ReplayDetector, SpeakerVerifier, UncertaintyDetector
from app.risk import RiskFusionEngine, ContextRiskAnalyzer
from app.audit import BlockchainAuditLedger

def test_audio_preprocessing_and_features():
    # Generate 1 second of synthetic 440Hz sine wave
    sr = 16000
    t = np.linspace(0, 1.0, sr, False)
    sine_wave = (np.sin(440 * 2 * np.pi * t) * 0.5).astype(np.float32)

    processed = preprocess_audio(sine_wave, sr)
    assert len(processed) == sr

    speech_samples, mask, ratio = process_vad(processed, sr)
    assert ratio > 0.5

    features = extract_audio_features(processed, sr)
    assert "spectral_centroid" in features
    assert "hnr_db" in features
    assert "mfcc_vector" in features
    assert len(features["mfcc_vector"]) == 20

def test_ml_ensemble_detectors():
    features = {
        "spectral_centroid": 1800.0,
        "spectral_flux": 5.0,
        "hnr_db": 22.0,
        "mean_f0": 150.0,
        "std_f0": 20.0,
        "jitter": 0.01,
        "shimmer": 0.02,
        "hf_cutoff_artifact": 0.10,
        "mfcc_vector": [0.1] * 20
    }
    dummy_samples = np.random.randn(16000).astype(np.float32) * 0.1

    ac_det = AcousticDetector()
    pr_det = ProsodyDetector()
    sy_det = SyntheticSpeechDetector()
    rp_det = ReplayDetector()
    sp_ver = SpeakerVerifier()
    un_det = UncertaintyDetector()

    ac_score, _ = ac_det.predict(features, dummy_samples)
    pr_score, _ = pr_det.predict(features)
    sy_score, _ = sy_det.predict(features)
    rp_score, _ = rp_det.predict(features, dummy_samples)
    sp_score, _ = sp_ver.predict(features)

    assert 0.0 <= ac_score <= 1.0
    assert 0.0 <= pr_score <= 1.0
    assert 0.0 <= sy_score <= 1.0
    assert 0.0 <= rp_score <= 1.0
    assert sp_score == 1.0

    uncertainty, category = un_det.predict(sy_score, ac_score, pr_score, rp_score, 0.8)
    assert 0.0 <= uncertainty <= 1.0
    assert category in ["Genuine", "Known synthetic", "Suspicious", "Unknown synthetic pattern", "Uncertain"]

def test_risk_fusion_engine():
    fusion = RiskFusionEngine()
    result = fusion.calculate_risk(
        deepfake_score=0.85,
        acoustic_anomaly=0.60,
        prosody_anomaly=0.70,
        speaker_match_score=0.30,
        replay_probability=0.10,
        context_risk_score=0.80,
        uncertainty=0.10,
        acoustic_reasons=["Acoustic shift"],
        prosody_reasons=["Flat pitch"],
        synthetic_reasons=["Neural vocoder cutoff"],
        replay_reasons=[],
        speaker_reasons=["Speaker mismatch"],
        context_reasons=["Financial request"],
        uncertainty_category="Known synthetic"
    )

    assert 0.0 <= result["risk_score"] <= 100.0
    assert result["risk_level"] in ["HIGH", "CRITICAL"]
    assert len(result["explanations"]) > 0

def test_context_risk_analyzer():
    analyzer = ContextRiskAnalyzer()
    score, reasons = analyzer.analyze_text("Please transfer 10 lakh rupees immediately to account")
    assert score >= 0.50
    assert len(reasons) > 0

def test_blockchain_audit_ledger():
    ledger = BlockchainAuditLedger()
    h1 = ledger.calculate_block_hash(0, "EVT-1", "CALL-1", "2026-09-28", 85.0, "v2.0", "ALERT", "HASH1", "PREV0")
    assert len(h1) == 64
