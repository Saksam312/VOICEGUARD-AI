import React from 'react';

interface RiskGaugeProps {
  score: number; // 0 to 100
  level: string;
  size?: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, level, size = 210 }) => {
  const normalizedScore = Math.min(100, Math.max(0, score));
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let strokeColor = '#10b981'; // Emerald LOW
  let glowColor = 'rgba(16, 185, 129, 0.4)';
  let glowClass = 'shadow-emerald-500/30';

  if (normalizedScore > 80) {
    strokeColor = '#f43f5e'; // Rose CRITICAL
    glowColor = 'rgba(244, 63, 94, 0.5)';
    glowClass = 'shadow-rose-500/40';
  } else if (normalizedScore > 60) {
    strokeColor = '#f97316'; // Orange HIGH
    glowColor = 'rgba(249, 115, 22, 0.4)';
    glowClass = 'shadow-orange-500/35';
  } else if (normalizedScore > 30) {
    strokeColor = '#f59e0b'; // Amber MEDIUM
    glowColor = 'rgba(245, 158, 11, 0.35)';
    glowClass = 'shadow-amber-500/30';
  }

  return (
    <div className="flex flex-col items-center justify-center relative my-2">
      {/* Outer ambient glow circle */}
      <div
        className="absolute rounded-full blur-2xl transition-all duration-700 pointer-events-none opacity-40"
        style={{
          width: size * 0.9,
          height: size * 0.9,
          backgroundColor: strokeColor
        }}
      />

      <svg width={size} height={size} className="transform -rotate-90 relative z-10">
        <defs>
          <radialGradient id="gaugeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#0f172a"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Outer dashed accent ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius + 8}
          stroke="rgba(51, 65, 85, 0.5)"
          strokeWidth={1}
          strokeDasharray="4 6"
          fill="transparent"
        />

        {/* Value progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{
            filter: `drop-shadow(0 0 8px ${glowColor})`,
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      </svg>

      {/* Center typography content */}
      <div className="absolute flex flex-col items-center justify-center text-center z-20">
        <span className="text-4xl font-extrabold font-mono text-slate-100 tracking-tight">
          {score.toFixed(1)}<span className="text-base text-cyan-400 font-bold">%</span>
        </span>
        <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mt-0.5 font-bold">
          IMPERSONATION RISK
        </span>
        <span className={`mt-2 font-mono font-bold uppercase tracking-wider ${
          level === 'CRITICAL' ? 'badge-critical' :
          level === 'HIGH' ? 'badge-high' :
          level === 'MEDIUM' ? 'badge-medium' :
          'badge-low'
        }`}>
          {level}
        </span>
      </div>
    </div>
  );
};
