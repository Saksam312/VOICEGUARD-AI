import React from 'react';

interface RiskGraphProps {
  timeline: { offset: string; score: number; label?: string }[];
}

export const RiskGraph: React.FC<RiskGraphProps> = ({ timeline }) => {
  const points = timeline.length > 0 ? timeline : [
    { offset: '00:05', score: 18 },
    { offset: '00:10', score: 42 },
    { offset: '00:15', score: 63 },
    { offset: '00:20', score: 74 },
    { offset: '00:25', score: 89 }
  ];

  const width = 600;
  const height = 150;
  const maxScore = 100;

  // Build SVG path points
  const pathPoints = points.map((p, i) => {
    const x = (i / Math.max(1, points.length - 1)) * (width - 40) + 20;
    const y = height - 20 - (p.score / maxScore) * (height - 40);
    return `${x},${y}`;
  }).join(' L ');

  return (
    <div className="glass-panel-command p-4 space-y-2">
      <div className="flex items-center justify-between font-mono text-xs text-slate-300">
        <span className="font-bold tracking-wider">LIVE IMPERSONATION RISK TRAJECTORY</span>
        <span className="text-cyan-400 font-bold">REAL-TIME TREND</span>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-36 overflow-visible">
          {/* Subtle horizontal grid lines */}
          {[20, 40, 60, 80, 100].map((val) => {
            const y = height - 20 - (val / maxScore) * (height - 40);
            return (
              <g key={val}>
                <line x1="20" y1={y} x2={width - 20} y2={y} stroke="rgba(30, 41, 59, 0.6)" strokeDasharray="3 3" />
                <text x="5" y={y + 3} fill="#64748b" fontSize="9" fontFamily="monospace">{val}</text>
              </g>
            );
          })}

          {/* Glowing Line */}
          <path
            d={`M ${pathPoints}`}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="3"
            style={{ filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.7))' }}
          />

          {/* Data Points */}
          {points.map((p, i) => {
            const x = (i / Math.max(1, points.length - 1)) * (width - 40) + 20;
            const y = height - 20 - (p.score / maxScore) * (height - 40);
            const isHigh = p.score > 60;
            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  fill={isHigh ? '#f43f5e' : '#10b981'}
                  stroke="#020617"
                  strokeWidth="2"
                  className="transition-all"
                />
                <text x={x} y={y - 10} textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  {p.score.toFixed(0)}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
