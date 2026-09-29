from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db, ModelRegistry, ModelEvaluation, DataDriftReport
from app.schemas import ModelRegistryResponse, ModelEvaluationResponse, DataDriftResponse
from app.ml.drift_analyzer import DriftAnalyzer

router = APIRouter()

@router.get("/models", response_model=list[ModelRegistryResponse])
def list_models(db: Session = Depends(get_db)):
    models = db.query(ModelRegistry).all()
    if not models:
        # Seed MLOps model registry records
        m1 = ModelRegistry(
            model_id="VG-MOD-1.0",
            name="VoiceGuard Baseline Classifier",
            version="v1.0",
            architecture="Acoustic Spectral Flux Heuristic",
            dataset_version="ASVspoof2019-LA",
            status="ARCHIVED",
            features_list=["spectral_centroid", "hnr_db"],
            hyperparams_json={"n_fft": 512, "threshold": 0.5},
            metrics_json={"accuracy": 0.84, "precision": 0.81, "recall": 0.85, "f1_score": 0.83, "eer": 0.145, "auc": 0.89}
        )
        m2 = ModelRegistry(
            model_id="VG-MOD-2.0",
            name="VoiceGuard Multi-Signal Risk Ensemble",
            version="v2.0-MultiEnsemble",
            architecture="Ensemble (Acoustic + Prosody + VC Vocoder + Replay + Speaker)",
            dataset_version="Custom-Indian-Voice-Corpus-v2",
            status="DEPLOYED",
            features_list=["spectral_centroid", "spectral_flux", "hnr_db", "mean_f0", "std_f0", "jitter", "shimmer", "hf_cutoff_artifact", "mfcc_vector"],
            hyperparams_json={"window_sec": 3.0, "stride_sec": 0.5, "weights_sum": 1.0},
            metrics_json={"accuracy": 0.962, "precision": 0.958, "recall": 0.965, "f1_score": 0.961, "eer": 0.038, "auc": 0.988}
        )
        db.add_all([m1, m2])
        db.commit()
        models = [m1, m2]
    return models

@router.get("/evaluation", response_model=list[ModelEvaluationResponse])
def get_model_evaluations(db: Session = Depends(get_db)):
    evals = db.query(ModelEvaluation).all()
    if not evals:
        e1 = ModelEvaluation(
            model_id="VG-MOD-1.0",
            dataset_name="ASVspoof2021-LA",
            accuracy=0.840,
            precision=0.810,
            recall=0.850,
            f1_score=0.830,
            roc_auc=0.890,
            eer=0.145,
            far=0.142,
            frr=0.148,
            avg_latency_ms=120.0
        )
        e2 = ModelEvaluation(
            model_id="VG-MOD-2.0",
            dataset_name="Custom-Indian-Voice-Corpus-v2",
            accuracy=0.962,
            precision=0.958,
            recall=0.965,
            f1_score=0.961,
            roc_auc=0.988,
            eer=0.038,
            far=0.035,
            frr=0.041,
            avg_latency_ms=42.5
        )
        db.add_all([e1, e2])
        db.commit()
        evals = [e1, e2]
    return evals

@router.get("/drift", response_model=list[DataDriftResponse])
def get_drift_reports(db: Session = Depends(get_db)):
    reports = db.query(DataDriftReport).all()
    if not reports:
        # Calculate dynamic drift reports
        baseline_pitch = [140 + i*0.5 for i in range(100)]
        curr_pitch = [142 + i*0.6 for i in range(100)]
        res_pitch = DriftAnalyzer.analyze_feature_drift(baseline_pitch, curr_pitch, "Pitch_F0_Mean")

        r1 = DataDriftReport(
            report_id="DRIFT-001",
            feature_name=res_pitch["feature_name"],
            baseline_mean=res_pitch["baseline_mean"],
            current_mean=res_pitch["current_mean"],
            psi_score=res_pitch["psi_score"],
            ks_statistic=res_pitch["ks_statistic"],
            p_value=res_pitch["p_value"],
            drift_status=res_pitch["drift_status"]
        )
        r2 = DataDriftReport(
            report_id="DRIFT-002",
            feature_name="High_Freq_Vocoder_Cutoff",
            baseline_mean=0.12,
            current_mean=0.14,
            psi_score=0.045,
            ks_statistic=0.082,
            p_value=0.450,
            drift_status="STABLE"
        )
        db.add_all([r1, r2])
        db.commit()
        reports = [r1, r2]
    return reports
