import React, { useEffect, useState } from 'react';
import { Gauge, Activity, ShieldCheck, AlertCircle } from 'lucide-react';

export const RobustnessLabPage: React.FC = () => {
  const [benchmarks, setBenchmarks] = useState<any>(null);

  useEffect(() => {
    fetch('/api/v1/robustness/benchmarks')
      .then(res => res.json())
      .then(setBenchmarks)
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 border-l-4 border-l-cyan-500">
        <h2 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
          <Gauge className="w-5 h-5 text-cyan-400" />
          Robustness & Multilingual Evaluation Lab
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Actual measured detection performance across varying background noise levels, telephone codecs (G.711 / AMR), low bitrates, and Indian languages/accents.
        </p>
      </div>

      {benchmarks ? (
        <div className="space-y-6">
          {/* Noise SNR Table */}
          <div className="glass-panel p-5 space-y-3">
            <h3 className="text-sm font-mono font-bold uppercase text-slate-200">BACKGROUND NOISE ROBUSTNESS (SNR)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-slate-950 text-slate-400">
                  <tr>
                    <th className="p-2.5">SNR LEVEL</th>
                    <th className="p-2.5">EQUAL ERROR RATE (EER)</th>
                    <th className="p-2.5">F1 SCORE</th>
                    <th className="p-2.5">AVG LATENCY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {benchmarks.noise_snr_benchmarks.map((row: any, idx: number) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-bold text-slate-200">{row.snr_db}</td>
                      <td className="p-2.5 text-cyan-400">{(row.eer * 100).toFixed(1)}%</td>
                      <td className="p-2.5 text-emerald-400">{(row.f1_score * 100).toFixed(1)}%</td>
                      <td className="p-2.5 text-slate-300">{row.latency_ms} ms</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Multilingual Evaluation Table */}
          <div className="glass-panel p-5 space-y-3">
            <h3 className="text-sm font-mono font-bold uppercase text-slate-200">INDIAN LANGUAGE & ACCENT EVALUATION MATRIX</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-slate-950 text-slate-400">
                  <tr>
                    <th className="p-2.5">LANGUAGE / ACCENT</th>
                    <th className="p-2.5">SAMPLES</th>
                    <th className="p-2.5">EER</th>
                    <th className="p-2.5">F1 SCORE</th>
                    <th className="p-2.5">EVALUATION STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {benchmarks.language_accent_benchmarks.map((row: any, idx: number) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-bold text-slate-200">{row.language}</td>
                      <td className="p-2.5 text-slate-300">{row.samples}</td>
                      <td className="p-2.5 text-cyan-400">{row.eer ? `${(row.eer * 100).toFixed(1)}%` : 'N/A'}</td>
                      <td className="p-2.5 text-emerald-400">{row.f1_score ? `${(row.f1_score * 100).toFixed(1)}%` : 'N/A'}</td>
                      <td className="p-2.5">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          row.status === 'Evaluated' ? 'badge-low' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-slate-500 font-mono text-xs">Loading benchmark data...</div>
      )}
    </div>
  );
};
