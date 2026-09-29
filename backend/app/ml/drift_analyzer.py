import numpy as np
from scipy.stats import ks_2samp

class DriftAnalyzer:
    """
    Computes statistical feature drift and prediction distribution drift using:
      1. Population Stability Index (PSI):
         - PSI < 0.10: Stable / No Drift
         - 0.10 <= PSI < 0.25: Slight Drift
         - PSI >= 0.25: Severe Drift / Action Required
      2. Two-Sample Kolmogorov-Smirnov (KS) Test.
    """
    @staticmethod
    def calculate_psi(baseline: np.ndarray, current: np.ndarray, num_buckets: int = 10) -> float:
        if len(baseline) == 0 or len(current) == 0:
            return 0.0

        percentiles = np.linspace(0, 100, num_buckets + 1)
        buckets = np.percentile(baseline, percentiles)
        buckets[0] = -np.inf
        buckets[-1] = np.inf

        base_counts, _ = np.histogram(baseline, bins=buckets)
        curr_counts, _ = np.histogram(current, bins=buckets)

        base_pct = np.maximum(base_counts / len(baseline), 1e-4)
        curr_pct = np.maximum(curr_counts / len(current), 1e-4)

        psi = np.sum((curr_pct - base_pct) * np.log(curr_pct / base_pct))
        return float(psi)

    @staticmethod
    def analyze_feature_drift(baseline: list[float], current: list[float], feature_name: str) -> dict:
        base_arr = np.array(baseline, dtype=np.float32)
        curr_arr = np.array(current, dtype=np.float32)

        if len(base_arr) == 0 or len(curr_arr) == 0:
            return {
                "feature_name": feature_name,
                "baseline_mean": 0.0,
                "current_mean": 0.0,
                "psi_score": 0.0,
                "ks_statistic": 0.0,
                "p_value": 1.0,
                "drift_status": "STABLE"
            }

        psi = DriftAnalyzer.calculate_psi(base_arr, curr_arr)
        ks_res = ks_2samp(base_arr, curr_arr)

        if psi >= 0.25 or ks_res.pvalue < 0.01:
            status = "SEVERE_DRIFT"
        elif psi >= 0.10:
            status = "SLIGHT_DRIFT"
        else:
            status = "STABLE"

        return {
            "feature_name": feature_name,
            "baseline_mean": float(np.mean(base_arr)),
            "current_mean": float(np.mean(curr_arr)),
            "psi_score": round(psi, 4),
            "ks_statistic": round(float(ks_res.statistic), 4),
            "p_value": round(float(ks_res.pvalue), 4),
            "drift_status": status
        }
