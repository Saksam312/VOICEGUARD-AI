import base64
import time
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db, Call
from app.schemas import AudioAnalysisResponse
from app.services.live_call_manager import live_call_manager

router = APIRouter()

@router.post("/analyze-audio", response_model=AudioAnalysisResponse)
async def analyze_audio(
    file: UploadFile = File(...),
    caller_id: str = Form("UPLOADED_SAMPLE"),
    expected_speaker_id: str = Form(None),
    transcript: str = Form(None),
    db: Session = Depends(get_db)
):

    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty audio file uploaded")

    call_id = f"VG-UPLOAD-{int(time.time()*1000) % 10000:04d}"
    call_obj = Call(
        call_id=call_id,
        caller_id=caller_id,
        status="ACTIVE",
        language="en-IN"
    )
    db.add(call_obj)
    db.commit()

    res = live_call_manager.process_audio_chunk(
        db=db,
        call_id=call_id,
        audio_bytes=contents,
        timestamp_offset="00:05",
        transcript=transcript,
        expected_speaker_id=expected_speaker_id
    )

    call_obj.status = "ENDED"
    db.commit()

    return res

@router.post("/analyze-chunk", response_model=AudioAnalysisResponse)
def analyze_chunk(
    call_id: str,
    audio_base64: str,
    timestamp_offset: str = "00:05",
    transcript: str = None,
    expected_speaker_id: str = None,
    db: Session = Depends(get_db)
):

    try:
        audio_bytes = base64.b64decode(audio_base64)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid base64 audio payload")

    res = live_call_manager.process_audio_chunk(
        db=db,
        call_id=call_id,
        audio_bytes=audio_bytes,
        timestamp_offset=timestamp_offset,
        transcript=transcript,
        expected_speaker_id=expected_speaker_id
    )

    return res
