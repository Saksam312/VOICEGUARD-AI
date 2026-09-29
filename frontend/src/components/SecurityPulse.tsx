import React from 'react';
import { Activity, ShieldAlert, PhoneCall, Cpu } from 'lucide-react';

interface SecurityPulseProps {
  liveCallsCount?: number;
  highRiskCount?: number;
  threatsCount?: number;
  systemHealth?: number;
}

export const SecurityPulse: React.FC<SecurityPulseProps> = ({
  liveCallsCount = 3,
  highRiskCount = 2,
  threatsCount = 14,
  systemHealth = 99
}) => {
  return (
    <div className="glass-panel-command px-6 py-3 flex flex-wrap items-center justify-between gap-6 border-l-4 border-l-cyan-500 font-mono text-xs">
      <div className="flex items-center gap-2">
        <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
        <span className="font-extrabold text-slate-200 tracking-wider">SECURITY PULSE</span>
      </div>

      <div className="flex items-center gap-8 text-xs font-mono">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">LIVE CALLS:</span>
          <strong className="text-slate-100 font-extrabold text-sm">{liveCallsCount.toString().padStart(2, '0')}</strong>
        </div>

        <div className="flex items-center gap-2 border-l border-slate-800 pl-8">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span className="text-slate-400">HIGH-RISK:</span>
          <strong className="text-rose-400 font-extrabold text-sm">{highRiskCount.toString().padStart(2, '0')}</strong>
        </div>

        <div className="flex items-center gap-2 border-l border-slate-800 pl-8">
          <Activity className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400">THREATS DETECTED:</span>
          <strong className="text-amber-400 font-extrabold text-sm">{threatsCount.toString().padStart(2, '0')}</strong>
        </div>

        <div className="flex items-center gap-2 border-l border-slate-800 pl-8">
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">SYSTEM HEALTH:</span>
          <strong className="text-emerald-400 font-extrabold text-sm">{systemHealth}%</strong>
        </div>
      </div>
    </div>
  );
};
