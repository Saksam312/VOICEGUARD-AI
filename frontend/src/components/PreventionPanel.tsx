import React from 'react';
import { AlertTriangle, Lock, PhoneCall, Key, ShieldCheck } from 'lucide-react';

interface PreventionPanelProps {
  score?: number;
  level?: string;
  recommendedAction?: string;
  onAction?: (actionType: string) => void;
  callId?: string;
  riskScore?: number;
  onActionExecuted?: (actionType: string) => void;
}

export const PreventionPanel: React.FC<PreventionPanelProps> = ({
  score = 78,
  level = 'HIGH',
  recommendedAction = 'Perform secondary identity verification before executing request.',
  onAction,
  riskScore,
  onActionExecuted
}) => {
  const actualScore = riskScore !== undefined ? riskScore : score;
  const isHigh = level === 'HIGH' || level === 'CRITICAL' || actualScore > 60;

  if (!isHigh) return null;

  return (
    <div className="glass-panel-intervention p-6 space-y-4 font-mono text-xs">
      <div className="flex items-center gap-3 text-rose-400 font-extrabold text-sm border-b border-rose-500/40 pb-3">
        <AlertTriangle className="w-6 h-6 animate-bounce text-rose-400" />
        <span className="tracking-wider">⚠ SECURITY INTERVENTION REQUIRED</span>
      </div>

      <div className="space-y-1">
        <p className="text-slate-200 text-sm font-bold">
          Potential AI Voice Impersonation Threat Flagged.
        </p>
        <div className="text-slate-300">
          IMPERSONATION RISK SCORE: <strong className="text-rose-400 text-base">{score.toFixed(1)} / 100</strong> ({level})
        </div>
      </div>

      <div className="p-3 bg-slate-950/80 rounded-xl border border-rose-500/30 text-slate-300 space-y-1">
        <span className="text-[10px] text-rose-400 uppercase font-bold block">RECOMMENDED PREVENTIVE ACTION:</span>
        <p className="text-slate-100 font-semibold">{recommendedAction}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <button
          onClick={() => onAction('VERIFY_CALLER')}
          className="py-2.5 px-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 transform hover:scale-[1.02] transition-all"
        >
          <ShieldCheck className="w-4 h-4" />
          [ VERIFY CALLER ]
        </button>

        <button
          onClick={() => onAction('REQUEST_OTP')}
          className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transform hover:scale-[1.02] transition-all"
        >
          <Key className="w-4 h-4" />
          [ REQUEST OTP ]
        </button>

        <button
          onClick={() => onAction('TRUSTED_CALLBACK')}
          className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transform hover:scale-[1.02] transition-all"
        >
          <PhoneCall className="w-4 h-4" />
          [ TRUSTED CALLBACK ]
        </button>
      </div>
    </div>
  );
};
