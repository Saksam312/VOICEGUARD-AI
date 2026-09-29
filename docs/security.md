security
# Security Architecture & Cryptographic Audit Ledger

## Cryptographic Blockchain Ledger
VOICEGUARD AI implements a SHA-256 tamper-evident block chained ledger.
Does NOT store raw call audio on chain.

```
Block Hash = SHA-256(Block_Index + Event_ID + Call_ID + Risk_Score + Model_Version + Action + Analysis_Hash + Previous_Hash)
```

Chain integrity can be verified at any time via `GET /api/v1/audit/verify-chain`.

