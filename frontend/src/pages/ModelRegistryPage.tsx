import React, { useEffect, useState } from 'react';
import { Database, Cpu, CheckCircle, Clock } from 'lucide-react';
import { ModelRegistryItem } from '../types';
import { fetchModels } from '../services/api';

export const ModelRegistryPage: React.FC = () => {
  const [models, setModels] = useState<ModelRegistryItem[]>([]);

  useEffect(() => {
    fetchModels().then(setModels);
  }, []);

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 border-l-4 border-l-cyan-500">
        <h2 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
          <Database className="w-5 h-5 text-cyan-400" />
          MLOps Model Registry
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Registered detection model artifacts, version history, feature schemas, hyperparameters, and production deployment status.
        </p>
      </div>

      <div className="space-y-4">
        {models.map((m) => (
          <div key={m.model_id} className="glass-panel p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-cyan-400">{m.model_id}</span>
                  <span className="text-xs font-mono text-slate-400">[{m.version}]</span>
                </div>
                <h3 className="text-base font-bold text-slate-100">{m.name}</h3>
              </div>
              <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded font-mono ${
                m.status === 'DEPLOYED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
              }`}>
                {m.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
                <span className="text-slate-400">ARCHITECTURE:</span>
                <p className="text-slate-200 font-semibold">{m.architecture}</p>
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
                <span className="text-slate-400">DATASET VERSION:</span>
                <p className="text-slate-200 font-semibold">{m.dataset_version}</p>
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
                <span className="text-slate-400">EXTRACTED FEATURES:</span>
                <p className="text-cyan-400 font-semibold">{m.features_list.length} signals active</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
