import React from 'react';

interface AdvancedRiskOrbProps {
  score: number; // 0 to 100
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  threatType?: string;
  signals?: {
    voice: number; // 0-1
    speaker: number; // 0-1
    prosody: number; // 0-1
    context: number; // 0-1
  };
}

export const AdvancedRiskOrb: React.FC<AdvancedRiskOrbProps> = ({
  score,
  level,
  threatType = 'AI IMPERSONATION',
  signals = { voice: 0.87, speaker: 0.31, prosody: 0.68, context: 0.91 }
}) => {
  const normScore = Math.min(100, Math.max(0, score));
  
  // Dynamic color palette & animation class based on level
  const levelStyles = {
    LOW: {
      primary: '#10b981',
      secondary: '#06b6d4',
      bgGlow: 'rgba(16, 185, 129, 0.2)',
      pulseClass: 'animate-pulse duration-1000',
      badgeClass: 'badge-low'
    },
    MEDIUM: {
      primary: '#f59e0b',
      secondary: '#f97316',
      bgGlow: 'rgba(245, 158, 11, 0.25)',
      pulseClass: 'animate-pulse duration-700',
      badgeClass: 'badge-medium'
    },
    HIGH: {
      primary: '#f97316',
      secondary: '#f43f5e',
      bgGlow: 'rgba(249, 115, 22, 0.35)',
      pulseClass: 'animate-pulse duration-500',
      badgeClass: 'badge-high'
    },
    CRITICAL: {
      primary: '#f43f5e',
      secondary: '#e11d48',
      bgGlow: 'rgba(244, 63, 94, 0.5)',
      pulseClass: 'animate-ping duration-300 opacity-75',
      badgeClass: 'badge-critical'
    }
  };

  const currentStyle = levelStyles[level] || levelStyles.HIGH;

  // SVG calculations for rings
  const size = 260;
  const strokeWidthOuter = 12;
  const strokeWidthInner = 8;
  
  const outerRadius = 110;
  const innerRadius = 85;
  
  const outerCircumference = 2 * Math.PI * outerRadius;
  const innerCircumference = 2 * Math.PI * innerRadius;
  
  const outerOffset = outerCircumference - (normScore / 100) * outerCircumference;
  const innerOffset = innerCircumference - (signals.voice) * innerCircumference;

  // Orbit indicator angles (4 quadrants)
  const orbitPoints = [
    { label: 'VOICE', value: `${Math.round(signals.voice * 100)}%`, angle: 45, color: '#06b6d4' },
    { label: 'SPEAKER', value: `${Math.round(signals.speaker * 100)}%`, angle: 135, color: level === 'CRITICAL' || level === 'HIGH' ? '#f43f5e' : '#10b981' },
    { label: 'PROSODY', value: `${Math.round(signals.prosody * 100)}%`, angle: 225, color: '#a855f7' },
    { label: 'CONTEXT', value: `${Math.round(signals.context * 100)}%`, angle: 315, color: '#f59e0b' }
  ];

  return (
    <div className="relative flex flex-col items-center justify-center p-4 my-2 select-none group">
      {/* Dynamic Background Glow */}
      <div
        className="absolute rounded-full blur-3xl transition-all duration-700 pointer-events-none"
        style={{
          width: size * 0.95,
          height: size * 0.95,
          backgroundColor: currentStyle.primary,
          opacity: level === 'CRITICAL' ? 0.45 : 0.25
        }}
      />

      {/* Security Pulsing Ring */}
      <div 
        className={`absolute rounded-full border-2 border-dashed pointer-events-none transition-all duration-500 ${currentStyle.pulseClass}`}
        style={{
          width: size + 20,
          height: size + 20,
          borderColor: currentStyle.primary,
          opacity: 0.3
        }}
      />

      <svg width={size} height={size} className="transform -rotate-90 relative z-10">
        <defs>
          <linearGradient id="outerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={currentStyle.primary} />
            <stop offset="100%" stopColor={currentStyle.secondary} />
          </linearGradient>

          <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>

          <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Ring Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={outerRadius}
          stroke="#0f172a"
          strokeWidth={strokeWidthOuter}
          fill="transparent"
        />

        {/* Outer Ring Value (Overall Risk) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={outerRadius}
          stroke="url(#outerGradient)"
          strokeWidth={strokeWidthOuter}
          strokeDasharray={outerCircumference}
          strokeDashoffset={outerOffset}
          strokeLinecap="round"
          fill="transparent"
          filter="url(#glowEffect)"
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />

        {/* Inner Ring Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={innerRadius}
          stroke="#1e293b"
          strokeWidth={strokeWidthInner}
          strokeDasharray="4 4"
          fill="transparent"
        />

        {/* Inner Ring Value (Voice Signal) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={innerRadius}
          stroke="url(#innerGradient)"
          strokeWidth={strokeWidthInner}
          strokeDasharray={innerCircumference}
          strokeDashoffset={innerOffset}
          strokeLinecap="round"
          fill="transparent"
          style={{ transition: 'stroke-dashoffset 1.2s ease-in-out' }}
        />
      </svg>

      {/* Orbit Indicators around Orb */}
      <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
        {orbitPoints.map((pt, i) => {
          const rad = (pt.angle * Math.PI) / 180;
          const dist = size / 2 + 18;
          const x = Math.cos(rad) * dist;
          const y = Math.sin(rad) * dist;

          return (
            <div
              key={i}
              className="absolute flex items-center gap-1 bg-slate-950/90 border border-slate-800 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-mono font-bold text-slate-300 shadow-md"
              style={{
                transform: `translate(${x}px, ${y}px)`
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: pt.color }}></span>
              <span>{pt.label}</span>
              <span className="text-slate-400 font-extrabold">{pt.value}</span>
            </div>
          );
        })}
      </div>

      {/* Center Typography Content */}
      <div className="absolute flex flex-col items-center justify-center text-center z-30 pointer-events-auto">
        <span className="text-5xl font-black font-mono text-slate-100 tracking-tighter glow-rose">
          {Math.round(normScore)}
        </span>

        <span className={`mt-1 text-[11px] font-mono font-bold uppercase tracking-widest ${currentStyle.badgeClass}`}>
          {level} RISK
        </span>

        <span className="mt-1 text-[9px] font-mono font-bold uppercase tracking-widest text-cyan-400/90 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
          {threatType}
        </span>
      </div>
    </div>
  );
};
