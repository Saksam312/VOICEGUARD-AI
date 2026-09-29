import numpy as np

class SpeakerVerifier:
    """
    Extracts speaker voiceprint embedding vectors and computes cosine similarity
    against enrolled target speaker profiles.
    Returns speaker_match_score [0.0 = total speaker mismatch, 1.0 = perfect match].
    """
    def extract_embedding(self, features: dict) -> list[float]:
        mfcc = features.get("mfcc_vector", [0.0] * 20)
        mean_f0 = features.get("mean_f0", 150.0) / 300.0 # Normalize ~ [0, 1]
        std_f0 = features.get("std_f0", 20.0) / 100.0
        hnr = features.get("hnr_db", 20.0) / 40.0

        vec = np.array(mfcc + [mean_f0, std_f0, hnr], dtype=np.float32)
        norm = np.linalg.norm(vec)
        if norm > 1e-6:
            vec = vec / norm
        return vec.tolist()

    def compare_embeddings(self, emb1: list[float], emb2: list[float]) -> float:
        v1 = np.array(emb1, dtype=np.float32)
        v2 = np.array(emb2, dtype=np.float32)

        min_len = min(len(v1), len(v2))
        if min_len == 0:
            return 1.0

        v1 = v1[:min_len]
        v2 = v2[:min_len]

        dot = np.dot(v1, v2)
        norm1 = np.linalg.norm(v1)
        norm2 = np.linalg.norm(v2)

        if norm1 < 1e-6 or norm2 < 1e-6:
            return 1.0

        similarity = dot / (norm1 * norm2)
        # Rescale cosine [-1, 1] to similarity [0, 1]
        sim_score = float(np.clip((similarity + 1.0) / 2.0, 0.0, 1.0))
        return sim_score

    def predict(self, features: dict, expected_profile_embedding: list[float] = None) -> tuple[float, list[str]]:
        reasons = []
        if expected_profile_embedding is None or len(expected_profile_embedding) == 0:
            # If no expected speaker profile is provided, return default 1.0 match (no mismatch flag)
            return 1.0, []

        current_emb = self.extract_embedding(features)
        match_score = self.compare_embeddings(current_emb, expected_profile_embedding)

        if match_score < 0.65:
            reasons.append(f"Speaker voiceprint mismatch detected (Similarity: {match_score*100:.1f}%)")

        return match_score, reasons
