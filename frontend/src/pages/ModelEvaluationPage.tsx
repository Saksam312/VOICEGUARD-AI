import React, { useEffect, useState } from 'react';
import { BarChart3, Activity, CheckCircle, TrendingUp } from 'lucide-react';
import { ModelEvaluationItem } from '../types';
import { fetchModelEvaluations } from '../services/api';

export const ModelEvaluationPage: React.FC = () => {
  const [evals, setEvals] = useState<ModelEvaluationItem[]>([]);

  useEffect(() => {
    fetchModelEvaluations().then(setEvals);
  }, []);

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 border-l-4 border-l-cyan-500">
        <h2 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          ML Model Evaluation & Performance Benchmarks
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Detailed metrics evaluation across datasets: Precision, Recall, F1-Score, ROC-AUC, Equal Error Rate (EER), FAR, FRR, and Latency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {evals.map((e) => (
          <div key={e.model_id} className="glass-panel p-5 space-y-4 border-t-4 border-t-cyan-500">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{e.model_id}</span>
                <h3 className="text-sm font-bold text-slate-100">{e.dataset_name}</h3>
              </div>
              <span className="badge-low font-mono">EER: {(e.eer * 100).toFixed(1)}%</span>
            </div>

            <div className="grid grid-cols-3 gap-2 font-mono text-center">
              <div className="p-2 bg-slate-950 rounded">
                <div className="text-[10px] text-slate-400">PRECISION</div>
                <div className="text-sm font-bold text-emerald-400">{(e.precision * 100).toFixed(1)}%</div>
              </div>
              <div className="p-2 bg-slate-950 rounded">
                <div className="text-[10px] text-slate-400">RECALL</div>
                <div className="text-sm font-bold text-cyan-400">{(e.recall * 100).toFixed(1)}%</div>
              </div>
              <div className="p-2 bg-slate-950 rounded">
                <div className="text-[10px] text-slate-400">F1-SCORE</div>
                <div className="text-sm font-bold text-cyan-300">{(e.f1_score * 100).toFixed(1)}%</div>
              </div>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between p-2 bg-slate-950 rounded">
                <span className="text-slate-400">ROC-AUC Score:</span>
                <span className="font-bold text-cyan-400">{(e.roc_auc * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-950 rounded">
                <span className="text-slate-400">False Acceptance Rate (FAR):</span>
                <span className="font-bold text-amber-400">{(e.far * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-950 rounded">
                <span className="text-slate-400">False Rejection Rate (FRR):</span>
                <span className="font-bold text-purple-400">{(e.frr * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-950 rounded">
                <span className="text-slate-400">Inference Latency:</span>
                <span className="font-bold text-emerald-400">{e.avg_latency_ms} ms</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
