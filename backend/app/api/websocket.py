import base64
import json
import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal, Call
from app.services.live_call_manager import live_call_manager
from app.services.demo_engine import DemoScenarioEngine

router = APIRouter()

@router.websocket("/ws/live-call/{call_id}")
async def websocket_live_call(websocket: WebSocket, call_id: str):
    await websocket.accept()
    db: Session = SessionLocal()

    try:
        # Check if call session is demo mode
        call_obj = db.query(Call).filter(Call.call_id == call_id).first()
        is_demo = call_obj.is_demo if call_obj else False
        demo_scenario = call_obj.demo_scenario if call_obj else None

        if is_demo and demo_scenario:
            # Stream demo scenario events sequentially
            scenario_data = DemoScenarioEngine.get_scenario(demo_scenario)
            timeline = scenario_data.get("timeline", [])

            for item in timeline:
                msg_payload = {
                    "call_id": call_id,
                    "timestamp_offset": item["offset"],
                    "risk_score": item["risk"],
                    "risk_level": item["level"],
                    "signals": {
                        "deepfake_score": item.get("deepfake", 0.1),
                        "acoustic_anomaly": 0.45 if item["risk"] > 50 else 0.1,
                        "prosody_anomaly": 0.50 if item["risk"] > 50 else 0.1,
                        "speaker_match_score": item.get("speaker_match", 0.9),
                        "replay_probability": 0.15,
                        "context_risk_score": item.get("context", 0.0),
                        "uncertainty": 0.12
                    },
                    "uncertainty_category": "Known synthetic" if item["risk"] > 60 else "Genuine",
                    "explanations": [item["reason"]],
                    "recommended_action": "Request secondary identity verification" if item["risk"] > 60 else "Standard monitoring active",
                    "audio_metrics": {"snr_db": 28.5, "speech_duration_sec": 3.0, "latency_ms": 38.2}
                }
                await websocket.send_json(msg_payload)
                await asyncio.sleep(2.0)

            # Wait for client close or commands
            while True:
                data = await websocket.receive_text()
                if data == "ping":
                    await websocket.send_text("pong")

        else:
            # Real live microphone / audio chunk streaming loop
            frame_counter = 1
            while True:
                data = await websocket.receive_text()
                try:
                    payload = json.loads(data)
                    audio_b64 = payload.get("audio_base64")
                    transcript = payload.get("transcript")
                    expected_spk = payload.get("expected_speaker_id")

                    if audio_b64:
                        audio_bytes = base64.b64decode(audio_b64)
                        offset_str = f"00:{frame_counter * 5:02d}"
                        frame_counter += 1

                        res = live_call_manager.process_audio_chunk(
                            db=db,
                            call_id=call_id,
                            audio_bytes=audio_bytes,
                            timestamp_offset=offset_str,
                            transcript=transcript,
                            expected_speaker_id=expected_spk
                        )
                        await websocket.send_json(res)

                except json.JSONDecodeError:
                    if data == "ping":
                        await websocket.send_text("pong")

    except WebSocketDisconnect:
        pass
    finally:
        db.close()
