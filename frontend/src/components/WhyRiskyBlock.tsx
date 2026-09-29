import React from 'react';
import { Zap, UserX, AlertTriangle, ShieldAlert } from 'lucide-react';

interface ThreatReason {
  type: 'SYNTHETIC_VOICE' | 'SPEAKER_MISMATCH' | 'CONTEXT_ANOMALY';
  title: string;
  description: string;
  metricLabel: string;
  metricValue: string;
  color: 'rose' | 'amber' | 'cyan' | 'purple';
}

interface WhyRiskyBlockProps {
  reasons?: ThreatReason[];
}

export const WhyRiskyBlock: React.FC<WhyRiskyBlockProps> = ({
  reasons = [
    {
      type: 'SYNTHETIC_VOICE',
      title: 'SYNTHETIC VOICE',
      description: 'The acoustic signature contains patterns commonly associated with generated neural speech, vocoder artifacts, and pitch phase flux.',
      metricLabel: 'SIGNAL STRENGTH',
      metricValue: '87%',
      color: 'rose'
    },
    {
      type: 'SPEAKER_MISMATCH',
      title: 'SPEAKER MISMATCH',
      description: 'Current real-time voice characteristics differ significantly from the stored trusted speaker embedding profile.',
      metricLabel: 'SIMILARITY SCORE',
      metricValue: '31%',
      color: 'amber'
    },
    {
      type: 'CONTEXT ANOMALY',
      title: 'CONTEXT ANOMALY',
      description: 'High-risk financial intent and urgent wire-transfer request patterns detected in speech transcript.',
      metricLabel: 'CONTEXT RISK',
      metricValue: '91%',
      color: 'rose'
    }
  ]
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'SYNTHETIC_VOICE':
        return <Zap className="w-4 h-4 text-rose-400" />;
      case 'SPEAKER_MISMATCH':
        return <UserX className="w-4 h-4 text-amber-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <div className="glass-panel-command p-6 space-y-4 border-l-4 border-l-rose-500">
      <div className="flex items-center gap-2 font-mono pb-2 border-b border-slate-800/80">
        <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
        <h3 className="text-xs font-extrabold text-slate-100 uppercase tracking-wider">
          WHY THIS CALL IS RISKY
        </h3>
      </div>

      <div className="space-y-3.5">
        {reasons.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-rose-500/40 transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-100">
                {getIcon(item.type)}
                <span className="tracking-wider">{item.title}</span>
              </div>

              <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/40 shadow">
                {item.metricLabel}: {item.metricValue}
              </span>
            </div>

            <p className="text-xs text-slate-400 font-mono leading-relaxed pl-6">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
