import React from 'react';

interface AISignalOrbProps {
  label: string;
  value: number; // 0 to 1
  statusText: string;
  colorType?: 'rose' | 'amber' | 'cyan' | 'purple' | 'emerald';
}

export const AISignalOrb: React.FC<AISignalOrbProps> = ({ label, value, statusText, colorType = 'cyan' }) => {
  const pct = Math.round(value * 100);

  const colors = {
    rose: 'border-rose-500 text-rose-400 bg-rose-950/40 shadow-rose-500/20',
    amber: 'border-amber-500 text-amber-400 bg-amber-950/40 shadow-amber-500/20',
    cyan: 'border-cyan-500 text-cyan-400 bg-cyan-950/40 shadow-cyan-500/20',
    purple: 'border-purple-500 text-purple-400 bg-purple-950/40 shadow-purple-500/20',
    emerald: 'border-emerald-500 text-emerald-400 bg-emerald-950/40 shadow-emerald-500/20'
  };

  const selectedColor = colors[colorType] || colors.cyan;

  return (
    <div className={`glass-panel p-4 flex items-center justify-between border-l-4 ${selectedColor} transition-transform hover:scale-[1.02]`}>
      <div className="space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-bold">
          {label}
        </span>
        <div className="text-xs font-mono font-bold tracking-wider text-slate-200">
          STATUS: <span className="uppercase">{statusText}</span>
        </div>
      </div>

      {/* Mini Circular Percentage Ring */}
      <div className="relative w-12 h-12 flex items-center justify-center font-mono text-xs font-extrabold text-slate-100">
        <svg className="w-12 h-12 transform -rotate-90">
          <circle cx="24" cy="24" r="18" stroke="#0f172a" strokeWidth="4" fill="transparent" />
          <circle
            cx="24"
            cy="24"
            r="18"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={113}
            strokeDashoffset={113 - (pct / 100) * 113}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700"
          />
        </svg>
        <span className="absolute">{pct}%</span>
      </div>
    </div>
  );
};
