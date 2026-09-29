import base64
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db, SpeakerProfile
from app.schemas import SpeakerVerifyResponse, SpeakerProfileResponse
from app.audio import bytes_to_float_array, preprocess_audio, extract_audio_features
from app.ml import SpeakerVerifier

router = APIRouter()
verifier = SpeakerVerifier()

@router.post("/register", response_model=SpeakerProfileResponse)
async def register_speaker(
    speaker_id: str = Form(...),
    name: str = Form(...),
    role_or_title: str = Form("Executive"),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty voice sample file")

    raw_samples, sr = bytes_to_float_array(contents, target_sr=16000)
    samples = preprocess_audio(raw_samples, sr)
    features = extract_audio_features(samples, sr)
    embedding = verifier.extract_embedding(features)

    existing = db.query(SpeakerProfile).filter(SpeakerProfile.speaker_id == speaker_id).first()
    if existing:
        existing.name = name
        existing.role_or_title = role_or_title
        existing.embedding_json = embedding
        existing.sample_count += 1
        db.commit()
        db.refresh(existing)
        return existing

    profile = SpeakerProfile(
        speaker_id=speaker_id,
        name=name,
        role_or_title=role_or_title,
        embedding_json=embedding,
        sample_count=1
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile

@router.post("/verify", response_model=SpeakerVerifyResponse)
async def verify_speaker(
    speaker_id: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    profile = db.query(SpeakerProfile).filter(SpeakerProfile.speaker_id == speaker_id).first()
    if not profile:
        # Default mock profile for testing if profile doesn't exist
        profile_emb = [0.1] * 23
    else:
        profile_emb = profile.embedding_json

    contents = await file.read()
    raw_samples, sr = bytes_to_float_array(contents, target_sr=16000)
    samples = preprocess_audio(raw_samples, sr)
    features = extract_audio_features(samples, sr)

    current_emb = verifier.extract_embedding(features)
    sim_score = verifier.compare_embeddings(current_emb, profile_emb)
    is_verified = sim_score >= 0.70

    return {
        "speaker_id": speaker_id,
        "is_verified": is_verified,
        "similarity_score": round(sim_score, 4),
        "threshold": 0.70,
        "details": f"Voiceprint cosine similarity is {sim_score*100:.1f}%. {'Verified speaker identity.' if is_verified else 'Speaker identity mismatch flagged.'}"
    }

@router.get("/profiles", response_model=list[SpeakerProfileResponse])
def list_speaker_profiles(db: Session = Depends(get_db)):
    profiles = db.query(SpeakerProfile).all()
    if not profiles:
        # Seed initial default executive profile for demonstration
        p1 = SpeakerProfile(
            speaker_id="SPK-EXEC-01",
            name="Dr. Rajesh Kumar",
            role_or_title="Chief Security Officer",
            embedding_json=[0.05] * 23,
            sample_count=3
        )
        p2 = SpeakerProfile(
            speaker_id="SPK-EXEC-02",
            name="Priya Sharma",
            role_or_title="VP of Finance",
            embedding_json=[-0.04] * 23,
            sample_count=2
        )
        db.add_all([p1, p2])
        db.commit()
        profiles = [p1, p2]
    return profiles
