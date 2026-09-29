# REST & WebSocket API Reference

## Authentication
- `POST /api/v1/auth/login` — JSON payload `{username, password}`, returns JWT token.

## Live Calls & Streaming
- `POST /api/v1/call/start` — Initializes monitoring session.
- `WS /ws/live-call/{call_id}` — Streaming WebSocket endpoint for 16kHz PCM audio buffers.

## Audio Analysis
- `POST /api/v1/analyze-audio` — Multipart form upload for single file forensic analysis.

## Security & Audit
- `GET /api/v1/security-events` — Fetches SOC incident logs.
- `GET /api/v1/audit/verify-chain` — Validates SHA-256 blockchain audit ledger integrity.
