import hashlib
import json
import datetime
from sqlalchemy.orm import Session
from app.database import AuditRecord

class BlockchainAuditLedger:
    """
    Tamper-Evident Cryptographic Audit Ledger:
    Links security events in a SHA-256 block chain:
      Block Hash = SHA-256(Block_Index + Event_ID + Call_ID + Risk_Score + Model_Version + Action + Analysis_Hash + Previous_Hash)
    """

    @staticmethod
    def calculate_analysis_hash(event_data: dict) -> str:
        """Computes SHA-256 digest of analysis payload parameters."""
        raw_str = json.dumps(event_data, sort_keys=True)
        return hashlib.sha256(raw_str.encode('utf-8')).hexdigest()

    @staticmethod
    def calculate_block_hash(
        block_index: int,
        event_id: str,
        call_id: str,
        timestamp_str: str,
        risk_score: float,
        model_version: str,
        action: str,
        analysis_hash: str,
        previous_hash: str
    ) -> str:
        payload = f"{block_index}:{event_id}:{call_id}:{timestamp_str}:{risk_score:.1f}:{model_version}:{action}:{analysis_hash}:{previous_hash}"
        return hashlib.sha256(payload.encode('utf-8')).hexdigest()

    def add_audit_event(
        self,
        db: Session,
        event_id: str,
        call_id: str,
        risk_score: float,
        model_version: str,
        action: str,
        analysis_payload: dict
    ) -> AuditRecord:
        # Fetch latest block index and previous hash
        last_record = db.query(AuditRecord).order_by(AuditRecord.block_index.desc()).first()

        if last_record is None:
            block_index = 0
            previous_hash = "0000000000000000000000000000000000000000000000000000000000000000" # Genesis
        else:
            block_index = last_record.block_index + 1
            previous_hash = last_record.block_hash

        timestamp_str = datetime.datetime.utcnow().isoformat()
        analysis_hash = self.calculate_analysis_hash(analysis_payload)

        block_hash = self.calculate_block_hash(
            block_index, event_id, call_id, timestamp_str,
            risk_score, model_version, action, analysis_hash, previous_hash
        )

        record = AuditRecord(
            block_index=block_index,
            event_id=event_id,
            call_id=call_id,
            timestamp_str=timestamp_str,
            risk_score=risk_score,
            model_version=model_version,
            action=action,
            analysis_hash=analysis_hash,
            previous_hash=previous_hash,
            block_hash=block_hash
        )

        db.add(record)
        db.commit()
        db.refresh(record)
        return record

    def verify_chain_integrity(self, db: Session) -> tuple[bool, int | None, str]:
        records = db.query(AuditRecord).order_by(AuditRecord.block_index.asc()).all()

        if not records:
            return True, None, "Ledger is empty; genesis valid."

        for i, rec in enumerate(records):
            # 1. Verify previous hash link
            if i == 0:
                expected_prev = "0000000000000000000000000000000000000000000000000000000000000000"
            else:
                expected_prev = records[i - 1].block_hash

            if rec.previous_hash != expected_prev:
                return False, rec.block_index, f"Tampered block link detected at index {rec.block_index}. Previous hash mismatch."

            # 2. Re-compute block hash
            calc_hash = self.calculate_block_hash(
                rec.block_index, rec.event_id, rec.call_id, rec.timestamp_str,
                rec.risk_score, rec.model_version, rec.action, rec.analysis_hash, rec.previous_hash
            )

            if calc_hash != rec.block_hash:
                return False, rec.block_index, f"Block hash mismatch at index {rec.block_index}. Block content altered."

        return True, None, f"Audit chain verified successfully ({len(records)} blocks intact)."
