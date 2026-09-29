import React, { useEffect, useState } from 'react';
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

export const DriftMonitoringPage: React.FC = () => {
  const [driftReports, setDriftReports] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/v1/drift')
      .then(res => res.json())
      .then(setDriftReports)
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 border-l-4 border-l-cyan-500">
        <h2 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          Data & Model Drift Monitoring
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Statistical feature drift and prediction distribution shift monitoring via Population Stability Index (PSI) and Kolmogorov-Smirnov (KS) test.
        </p>
      </div>

      <div className="glass-panel p-5 space-y-4">
        <h3 className="text-sm font-mono font-bold uppercase text-slate-200">STATISTICAL DRIFT REPORT TABLE</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-950 text-slate-400">
              <tr>
                <th className="p-3">REPORT ID</th>
                <th className="p-3">FEATURE NAME</th>
                <th className="p-3">BASELINE MEAN</th>
                <th className="p-3">CURRENT MEAN</th>
                <th className="p-3">PSI SCORE</th>
                <th className="p-3">KS STAT</th>
                <th className="p-3">DRIFT STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {driftReports.map((r, idx) => (
                <tr key={idx}>
                  <td className="p-3 text-cyan-400 font-bold">{r.report_id}</td>
                  <td className="p-3 font-semibold text-slate-200">{r.feature_name}</td>
                  <td className="p-3 text-slate-300">{r.baseline_mean.toFixed(2)}</td>
                  <td className="p-3 text-slate-300">{r.current_mean.toFixed(2)}</td>
                  <td className="p-3 text-slate-200">{r.psi_score.toFixed(4)}</td>
                  <td className="p-3 text-slate-200">{r.ks_statistic.toFixed(4)}</td>
                  <td className="p-3">
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded ${
                      r.drift_status === 'SEVERE_DRIFT' ? 'badge-critical' :
                      r.drift_status === 'SLIGHT_DRIFT' ? 'badge-medium' : 'badge-low'
                    }`}>
                      {r.drift_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
