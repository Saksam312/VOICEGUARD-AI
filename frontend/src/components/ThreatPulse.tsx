import React from 'react';
import { Activity } from 'lucide-react';

interface ThreatPulseProps {
  level: string;
}

export const ThreatPulse: React.FC<ThreatPulseProps> = ({ level }) => {
  const isHigh = level === 'HIGH' || level === 'CRITICAL';

  return (
    <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 font-mono text-xs shadow-inner">
      <div className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full ${isHigh ? 'bg-rose-500 animate-ping' : 'bg-emerald-400 animate-pulse'}`}></span>
        <span className={`w-2 h-2 rounded-full ${isHigh ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`}></span>
        <span className={`w-2 h-2 rounded-full ${isHigh ? 'bg-rose-500' : 'bg-emerald-400 opacity-50'}`}></span>
        <span className="w-2 h-2 rounded-full bg-slate-700"></span>
      </div>
      <span className={`font-bold tracking-wider ${isHigh ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
        {isHigh ? 'THREAT SIGNAL ACTIVE' : 'NO ACTIVE THREATS'}
      </span>
    </div>
  );
};
