import React, { useState, useEffect } from 'react';
import { Shield, Radio, Play, Activity, Cpu, Lock, User } from 'lucide-react';

interface TopCommandBarProps {
  onOpenDemo: () => void;
  activeCallId?: string;
  activeRiskLevel?: string;
}

export const TopCommandBar: React.FC<TopCommandBarProps> = ({ onOpenDemo, activeCallId, activeRiskLevel }) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeStr(now.toISOString().substring(11, 19) + ' UTC');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 bg-slate-900/60 backdrop-blur-2xl border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Branding */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-base tracking-wider text-slate-100 font-mono">
              VOICEGUARD<span className="text-cyan-400">.AI</span>
            </h1>
            <span className="text-[9px] uppercase font-bold tracking-widest bg-cyan-950/90 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/40">
              COMMAND CENTER
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
            REAL-TIME AI VOICE INTEGRITY & THREAT DEFENSE
          </p>
        </div>
      </div>

      {/* Center: Live Monitoring Status Badge */}
      <div className="hidden md:flex items-center gap-3 bg-slate-950/80 px-4 py-1.5 rounded-full border border-slate-800/80 shadow-inner">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
        </span>
        <span className="text-xs font-mono font-bold tracking-wider text-slate-200">
          ● LIVE MONITORING
        </span>
        {activeCallId && (
          <span className="text-xs font-mono text-cyan-400 font-semibold border-l border-slate-800 pl-3">
            ACTIVE SESSION: {activeCallId}
          </span>
        )}
      </div>

      {/* Right: Controls & Floating Security Status */}
      <div className="flex items-center gap-4 font-mono text-xs">
        <div className="hidden lg:flex items-center gap-3 bg-slate-950/80 px-3.5 py-1.5 rounded-xl border border-slate-800 text-[10px] text-slate-300 shadow-inner">
          <div className="flex items-center gap-1 text-emerald-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>● SYSTEM OPERATIONAL</span>
          </div>
          <span className="text-slate-800">|</span>
          <span className="text-slate-400">AI ENGINE <strong className="text-cyan-400">ONLINE</strong></span>
          <span className="text-slate-800">|</span>
          <span className="text-slate-400">PIPELINE <strong className="text-emerald-400">ACTIVE</strong></span>
          <span className="text-slate-800">|</span>
          <span className="text-slate-400">MODEL <strong className="text-indigo-400">READY</strong></span>
          <span className="text-slate-800">|</span>
          <span className="text-slate-400 font-semibold">{timeStr || '20:54:59 UTC'}</span>
        </div>

        <button
          onClick={onOpenDemo}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 via-indigo-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs uppercase px-4 py-2 rounded-xl shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-[1.02] border border-cyan-400/30"
        >
          <Play className="w-3.5 h-3.5 fill-slate-950" />
          ▶ THREAT SIMULATION
        </button>
      </div>
    </header>
  );
};
