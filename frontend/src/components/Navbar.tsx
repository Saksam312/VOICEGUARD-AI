import React, { useState, useEffect } from 'react';
import { Shield, Radio, Play, AlertTriangle, Lock } from 'lucide-react';

interface NavbarProps {
  onOpenDemo: () => void;
  activeCallId?: string;
  activeRiskLevel?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDemo, activeCallId, activeRiskLevel }) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Product Branding */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-cyan-600 to-emerald-500 p-0.5 shadow-lg shadow-cyan-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-between justify-center">
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-lg tracking-wider text-slate-100 font-mono">
              VOICEGUARD<span className="text-cyan-400">.AI</span>
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-widest bg-cyan-950/80 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/30">
              SOC v2.0
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">
            Real-Time AI Voice Integrity & Impersonation Defense Platform
          </p>
        </div>
      </div>

      {/* Center Active Call Indicator if Live */}
      {activeCallId && (
        <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-1.5 rounded-full border border-slate-800">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
          <span className="text-xs font-mono font-semibold text-slate-200">
            CALL LIVE: <span className="text-cyan-400">{activeCallId}</span>
          </span>
          {activeRiskLevel && (
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
              activeRiskLevel === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-500/40' :
              activeRiskLevel === 'HIGH' ? 'bg-orange-950 text-orange-400 border border-orange-500/40' :
              activeRiskLevel === 'MEDIUM' ? 'bg-amber-950 text-amber-400 border border-amber-500/40' :
              'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
            }`}>
              {activeRiskLevel}
            </span>
          )}
        </div>
      )}

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>SOC STATUS: <span className="text-emerald-400 font-semibold">ACTIVE</span></span>
          <span className="text-slate-600">|</span>
          <span>{timeStr || '19:54:59'}</span>
        </div>

        <button
          onClick={onOpenDemo}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase px-4 py-2 rounded-lg shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-[1.02]"
        >
          <Play className="w-3.5 h-3.5 fill-slate-950" />
          START DEMO MODE
        </button>
      </div>
    </header>
  );
};
