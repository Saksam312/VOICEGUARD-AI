# VOICEGUARD AI
### Real-Time AI Voice Integrity & Impersonation Defense Platform

**Problem Statement ID:** 26104  
**Organization:** All India Council for Technical Education (AICTE) – Cyber Security Cell  
**Category:** Software | **Theme:** Blockchain & Cybersecurity  

---

## 🛡️ Core Vision & Innovation

**VOICEGUARD AI** does not simply detect whether audio is fake. It treats AI voice cloning as a **real-time cybersecurity threat** and combines:
1. **Multi-Signal Audio Integrity Analysis** (Acoustic, Prosody, Synthetic Neural Vocoder Cutoff, Replay Attack)
2. **Speaker Consistency Verification** (Voiceprint embedding cosine matching)
3. **Contextual Social Engineering Risk Intelligence** (Speech-to-Text sensitive request classifier)
4. **Dynamic 0–100 Impersonation Risk Score Engine**
5. **Explainable AI (XAI) Security Decisions** (Human-readable "WHY WAS THIS CALL FLAGGED?")
6. **Cryptographic Tamper-Evident SHA-256 Audit Ledger**
7. **Zero-Raw-Audio Retention Privacy Controls**

---

## 🚀 Key Features & Capabilities

- 🎙️ **Real-Time Streaming Engine:** WebAudio API / WebRTC mic stream over WebSockets into sliding-window (3.0s window, 0.5s stride) ML inference.
- ⚡ **Sub-50ms Latency:** Optimized signal processing with empirical latency monitoring.
- 📊 **Dynamic 0-100 Risk Score:** Weighted signal fusion mapping to configurable risk levels (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
- 🔍 **Explainable AI (XAI):** Clear human-readable reasons explaining flagged calls (e.g. *✓ Neural vocoder spectral cutoff artifact detected*).
- 🏷️ **Context Risk Detection:** Flags high-risk requests (Financial wire transfers, OTP demands, credential access, emergency pressure).
- 🧪 **Deepfake Attack Lab:** Interactive testbed for Genuine, TTS (VITS), RVC Voice Conversion, Replay, and Noise.
- 📈 **Robustness & Multilingual Evaluation:** Benchmarked across SNR noise levels, G.711/AMR codecs, and 8 Indian languages/accents.
- 🔗 **Cryptographic Blockchain Audit Ledger:** SHA-256 block-chained tamper-evident event log with live chain verification.
- 🔒 **Zero-Audio Retention Privacy:** Memory-only audio processing with 0-minute retention policy options.
- 🎬 **Hackathon Presentation Demo Mode:** 6 reproducible presentation scenarios for judges.

---

## 🏗️ Architecture Overview

```
CALL / AUDIO STREAM ──> PREPROCESSING & VAD ──> FEATURE EXTRACTION (MFCC / MEL-SPEC)
                                                          │
          ┌───────────────────────────────────────────────┼───────────────────────────────────────────────┐
          ▼                                               ▼                                               ▼
ACOUSTIC DETECTOR                               PROSODY DETECTOR                               SYNTHETIC SPEECH DETECTOR
(Spectral Flux/Centroid)                        (Pitch F0 / Jitter / Shimmer)                  (Neural Vocoder Cutoff)
          │                                               │                                               │
          └───────────────────────────────────────────────┼───────────────────────────────────────────────┘
                                                          │
                                                          ▼
                                              DYNAMIC RISK FUSION ENGINE
                                                          │
                                              0-100 IMPERSONATION RISK SCORE
                                                          │
                                            EXPLAINABLE SECURITY DECISION
                                                          │
                                            CRYPTOGRAPHIC AUDIT LEDGER
```

---

## 📦 Quick Start & Local Installation

### Prerequisites
- Python 3.10+
- Node.js v18+

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m pytest -v
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open browser at `http://localhost:3000`.

---

## 🐳 Docker Deployment

Run complete stack (FastAPI backend + Vite React frontend + Prometheus metrics) using Docker Compose:

```bash
docker-compose up --build -d
```

---

## ☸️ Kubernetes Deployment

Deploy production manifests to Kubernetes:

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa.yaml
```

---

## 🧪 Testing

Run automated Pytest verification suite:

```bash
pytest -v
```

---

## 📜 Documentation Index

- [`docs/architecture.md`](file:///c:/Users/rames/Desktop/Sak/voice_cloning/docs/architecture.md) — System Architecture Specifications
- [`docs/ml-pipeline.md`](file:///c:/Users/rames/Desktop/Sak/voice_cloning/docs/ml-pipeline.md) — Multi-Signal ML Ensemble & Risk Fusion
- [`docs/api.md`](file:///c:/Users/rames/Desktop/Sak/voice_cloning/docs/api.md) — REST & WebSocket API Reference
- [`docs/security.md`](file:///c:/Users/rames/Desktop/Sak/voice_cloning/docs/security.md) — Authentication, Security & Blockchain Ledger
- [`docs/privacy.md`](file:///c:/Users/rames/Desktop/Sak/voice_cloning/docs/privacy.md) — Zero Audio Retention Privacy Policies
- [`docs/deployment.md`](file:///c:/Users/rames/Desktop/Sak/voice_cloning/docs/deployment.md) — Docker & Kubernetes Deployment Guide
- [`docs/evaluation.md`](file:///c:/Users/rames/Desktop/Sak/voice_cloning/docs/evaluation.md) — Multilingual & Robustness Evaluation Benchmarks
