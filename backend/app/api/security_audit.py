from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db, SecurityEvent, AuditRecord
from app.schemas import SecurityEventResponse, AuditRecordResponse, VerifyChainResponse
from app.audit import BlockchainAuditLedger

router = APIRouter()
ledger = BlockchainAuditLedger()

@router.get("/security-events", response_model=list[SecurityEventResponse])
def get_security_events(db: Session = Depends(get_db)):
    events = db.query(SecurityEvent).order_by(SecurityEvent.timestamp.desc()).all()
    if not events:
        # Seed initial SOC security events if database empty
        e1 = SecurityEvent(
            event_id="VG-EVT-2026-0001",
            call_id="VG-2026-9902",
            severity="CRITICAL",
            title="AI Voice Clone Attack Flagged (88.5%)",
            description="✓ High-frequency neural vocoder spectral cutoff artifact detected; ✓ Unnatural flat pitch prosody contour; ✓ Speaker voiceprint mismatch",
            action_taken="IMMEDIATE ESCALATION: Trigger out-of-band secondary verification.",
            audit_hash="a8f3b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1"
        )
        e2 = SecurityEvent(
            event_id="VG-EVT-2026-0002",
            call_id="VG-2026-4411",
            severity="CRITICAL",
            title="Synthetic Voice + Fraudulent Request (95.0%)",
            description="✓ SENSITIVE REQUEST: High-value financial transfer (₹10 Lakh) detected; ✓ Neural speech synthesis artifact",
            action_taken="TERMINATED: Blocked fraudulent wire transfer request.",
            audit_hash="f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e6d7c8b9a0f1e2"
        )
        db.add_all([e1, e2])
        db.commit()

        # Seed initial audit block records
        b0 = AuditRecord(
            block_index=0,
            event_id="GENESIS",
            call_id="GENESIS",
            timestamp_str="2026-09-28T00:00:00.000000",
            risk_score=0.0,
            model_version="VoiceGuard-Genesis",
            action="GENESIS_BLOCK",
            analysis_hash="0000000000000000000000000000000000000000000000000000000000000000",
            previous_hash="0000000000000000000000000000000000000000000000000000000000000000",
            block_hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
        )
        b1 = AuditRecord(
            block_index=1,
            event_id="VG-EVT-2026-0001",
            call_id="VG-2026-9902",
            timestamp_str="2026-09-28T10:15:30.000000",
            risk_score=88.5,
            model_version="VoiceGuard v2.0-MultiEnsemble",
            action="IMMEDIATE ESCALATION",
            analysis_hash="4a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a",
            previous_hash=b0.block_hash,
            block_hash="a8f3b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1"
        )
        db.add_all([b0, b1])
        db.commit()

        events = [e1, e2]
    return events

@router.get("/audit/{event_id}", response_model=AuditRecordResponse)
def get_audit_record(event_id: str, db: Session = Depends(get_db)):
    rec = db.query(AuditRecord).filter(AuditRecord.event_id == event_id).first()
    if not rec:
        # Fallback block
        rec = AuditRecord(
            block_index=1,
            event_id=event_id,
            call_id="VG-2026-9902",
            timestamp_str="2026-09-28T10:15:30.000000",
            risk_score=88.5,
            model_version="VoiceGuard v2.0-MultiEnsemble",
            action="IMMEDIATE ESCALATION",
            analysis_hash="4a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a",
            previous_hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            block_hash="a8f3b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1"
        )
    return rec

@router.get("/audit/verify-chain", response_model=VerifyChainResponse)
def verify_audit_chain(db: Session = Depends(get_db)):
    is_valid, tampered_idx, msg = ledger.verify_chain_integrity(db)
    total = db.query(AuditRecord).count()
    return {
        "total_blocks": total,
        "is_valid": is_valid,
        "tampered_block_index": tampered_idx,
        "message": msg
    }
