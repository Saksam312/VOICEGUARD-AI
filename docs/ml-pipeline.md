# ML Ensemble & Multi-Signal Risk Fusion Engine

## Signal Detectors
1. **Acoustic Detector:** Spectral centroid, spectral flux, harmonic-to-noise ratio (HNR).
2. **Prosody Detector:** Pitch F0 contour, pitch standard deviation, vocal jitter, shimmer.
3. **Synthetic Speech Detector:** High-frequency neural vocoder spectral cutoff artifacts (> 7.5kHz), phase unnaturalness, RVC micro-pitch tracking alignment signatures.
4. **Replay Detector:** Loudspeaker room reverberation profile, secondary microphone frequency tilt.
5. **Speaker Verifier:** 23-dimensional voiceprint feature vector cosine similarity matching.
6. **Uncertainty Engine:** Multi-detector variance analysis yielding confidence and 5 operational categories.

## Risk Scoring Formula
```
Base Score = w_df * DF + w_spk * (1 - SpkMatch) + w_ac * Ac + w_pr * Pr + w_rp * Rp + w_ctx * Ctx
Final Score = min(100.0, (Base Score + Compound Penalty) * 100.0)
```
Risk Levels:
- 0–30: LOW
- 31–60: MEDIUM
- 61–80: HIGH
- 81–100: CRITICAL
