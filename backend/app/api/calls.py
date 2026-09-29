import time
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db, Call, AnalysisEvent
from app.schemas import CallStartRequest, CallResponse, CallTimelineItem
from app.services.demo_engine import DemoScenarioEngine

router = APIRouter()

@router.post("/start", response_model=CallResponse)
def start_call(req: CallStartRequest, db: Session = Depends(get_db)):
    call_id = f"VG-{datetime.datetime.utcnow().strftime('%Y%m%d')}-{int(time.time()*1000) % 10000:04d}"

    call_obj = Call(
        call_id=call_id,
        caller_id=req.caller_id,
        recipient_id=req.recipient_id,
        language=req.language or "en-IN",
        is_demo=req.is_demo,
        demo_scenario=req.demo_scenario,
        status="ACTIVE"
    )

    db.add(call_obj)
    db.commit()
    db.refresh(call_obj)
    return call_obj

@router.post("/end/{call_id}")
def end_call(call_id: str, db: Session = Depends(get_db)):
    call_obj = db.query(Call).filter(Call.call_id == call_id).first()
    if not call_obj:
        raise HTTPException(status_code=404, detail="Call session not found")

    call_obj.status = "ENDED"
    call_obj.end_time = datetime.datetime.utcnow()
    if call_obj.start_time:
        call_obj.duration_seconds = (call_obj.end_time - call_obj.start_time).total_seconds()

    db.commit()
    return {"message": "Call session ended", "call_id": call_id, "duration": call_obj.duration_seconds}

@router.get("/{call_id}", response_model=CallResponse)
def get_call_summary(call_id: str, db: Session = Depends(get_db)):
    call_obj = db.query(Call).filter(Call.call_id == call_id).first()
    if not call_obj:
        # Check if demo call ID
        call_obj = Call(
            call_id=call_id,
            caller_id="Executive-User",
            status="ENDED",
            final_risk_score=14.5,
            risk_level="LOW",
            language="en-IN",
            is_demo=True
        )
    return call_obj

@router.get("/{call_id}/timeline")
def get_call_timeline(call_id: str, db: Session = Depends(get_db)):
    call_obj = db.query(Call).filter(Call.call_id == call_id).first()

    if call_obj and call_obj.is_demo and call_obj.demo_scenario:
        scenario_data = DemoScenarioEngine.get_scenario(call_obj.demo_scenario)
        return {"call_id": call_id, "is_demo": True, "timeline": scenario_data["timeline"]}

    events = db.query(AnalysisEvent).filter(AnalysisEvent.call_id == call_id).order_by(AnalysisEvent.id.asc()).all()

    timeline = []
    for evt in events:
        primary_sig = "Voice Authenticity"
        if evt.deepfake_score > 0.5:
            primary_sig = "Synthetic AI Indicator"
        elif evt.speaker_match_score < 0.6:
            primary_sig = "Speaker Mismatch"
        elif evt.acoustic_anomaly > 0.5:
            primary_sig = "Acoustic Anomaly"
        elif evt.context_risk_score > 0.5:
            primary_sig = "Sensitive Request Context"

        timeline.append({
            "timestamp_offset": evt.timestamp_offset,
            "risk_score": evt.risk_score,
            "risk_level": evt.risk_level,
            "primary_signal": primary_sig,
            "explanations": evt.explanation_json,
            "recommended_action": evt.recommended_action
        })

    return {"call_id": call_id, "is_demo": False, "timeline": timeline}

@router.get("/list/recent")
def list_recent_calls(db: Session = Depends(get_db)):
    calls = db.query(Call).order_by(Call.start_time.desc()).limit(20).all()
    if not calls:
        # Populate initial baseline demo call records if DB empty
        c1 = Call(call_id="VG-2026-8819", caller_id="Executive-01", status="ENDED", final_risk_score=14.2, risk_level="LOW", language="en-IN", is_demo=True)
        c2 = Call(call_id="VG-2026-9902", caller_id="Unknown Caller", status="FLAGGED", final_risk_score=88.5, risk_level="CRITICAL", language="hi-IN", is_demo=True, demo_scenario="AI_VOICE_CLONE")
        c3 = Call(call_id="VG-2026-4411", caller_id="Support-Desk", status="FLAGGED", final_risk_score=95.0, risk_level="CRITICAL", language="en-IN", is_demo=True, demo_scenario="SYNTHETIC_FINANCIAL")
        db.add_all([c1, c2, c3])
        db.commit()
        calls = [c1, c2, c3]
    return calls
