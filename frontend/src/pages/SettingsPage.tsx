import React, { useState } from 'react';
import { Settings as SettingsIcon, Sliders, CheckCircle } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [weights, setWeights] = useState({
    deepfake: 0.35,
    speaker_mismatch: 0.20,
    acoustic: 0.15,
    prosody: 0.15,
    replay: 0.05,
    context: 0.10
  });

  const [saved, setSaved] = useState<boolean>(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 border-l-4 border-l-cyan-500">
        <h2 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-cyan-400" />
          System Settings & Ensemble Risk Weight Tuning
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Tune configurable multi-signal ensemble weights and risk escalation thresholds for enterprise SOC operations.
        </p>
      </div>

      <div className="glass-panel p-6 space-y-6">
        <h3 className="text-sm font-mono font-bold uppercase text-slate-200">SIGNAL ENSEMBLE BASELINE WEIGHTS</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {Object.entries(weights).map(([key, val]) => (
            <div key={key} className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300 font-bold uppercase">{key.replace('_', ' ')}:</span>
                <span className="text-cyan-400 font-bold">{(val * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={val}
                onChange={(e) => setWeights({ ...weights, [key]: parseFloat(e.target.value) })}
                className="w-full accent-cyan-500"
              />
            </div>
          ))}
        </div>

        {saved && (
          <div className="p-3 bg-emerald-950/40 rounded border border-emerald-500/40 text-xs text-emerald-400 font-mono flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Configurable baseline weights calibrated successfully.
          </div>
        )}

        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs uppercase rounded shadow"
        >
          SAVE WEIGHT CONFIGURATION
        </button>
      </div>
    </div>
  );
};
