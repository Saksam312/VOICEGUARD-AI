# System Architecture Specification

## 1. High-Level Concept
VOICEGUARD AI treats voice cloning as a real-time cybersecurity threat rather than a static classification problem.

## 2. Component Pipeline
- **Audio Stream Ingestion:** Browser microphone WebAudio API / WebRTC stream into 16kHz PCM audio buffer.
- **WebSocket Streaming:** Bi-directional JSON/PCM socket `/ws/live-call/{call_id}`.
- **Preprocessing Engine:** Resampling, mono conversion, peak normalization, VAD silence removal.
- **Multi-Signal Ensemble:** Parallel inference across Acoustic, Prosody, Synthetic Vocoder, Replay, and Speaker detectors.
- **Context Risk Analyzer:** Speech-to-Text sensitive request intent matching.
- **Risk Fusion Engine:** Weighted signal combination + non-linear penalty -> 0-100 Impersonation Risk Score.
- **XAI Generator:** Human-readable explanations ("WHY WAS THIS CALL FLAGGED?").
- **Tamper-Evident Ledger:** SHA-256 block-chained security event record.
