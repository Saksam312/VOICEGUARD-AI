import React, { useEffect, useState } from 'react';
import { Clock, PhoneCall, AlertTriangle, ShieldCheck } from 'lucide-react';
import { CallTimelineItem } from '../types';
import { fetchCallTimeline } from '../services/api';

interface RiskTimelinePageProps {
  selectedCallId?: string;
}

export const RiskTimelinePage: React.FC<RiskTimelinePageProps> = ({ selectedCallId = 'VG-2026-9902' }) => {
  const [timeline, setTimeline] = useState<CallTimelineItem[]>([]);

  useEffect(() => {
    fetchCallTimeline(selectedCallId).then(setTimeline);
  }, [selectedCallId]);

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 border-l-4 border-l-cyan-500">
        <h2 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          Dynamic Call Risk Timeline: <span className="text-cyan-400">{selectedCallId}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Detailed temporal breakdown of risk score evolution across call duration (00:05 to 00:45). Click any timestamp event to inspect detected acoustic and neural indicators.
        </p>
      </div>

      <div className="glass-panel p-6 space-y-6">
        <div className="relative border-l-2 border-cyan-500/40 ml-4 space-y-6">
          {timeline.map((item, idx) => (
            <div key={idx} className="relative pl-6 group">
              {/* Timeline Dot */}
              <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-slate-950 ${
                item.risk_level === 'CRITICAL' ? 'bg-rose-500 animate-ping' :
                item.risk_level === 'HIGH' ? 'bg-orange-500' :
                item.risk_level === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />

              <div className="glass-panel p-4 space-y-2 group-hover:border-cyan-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-cyan-400">{item.timestamp_offset}</span>
                  <span className={`text-xs font-mono font-bold uppercase px-2 py-0.5 rounded ${
                    item.risk_level === 'CRITICAL' ? 'badge-critical' :
                    item.risk_level === 'HIGH' ? 'badge-high' :
                    item.risk_level === 'MEDIUM' ? 'badge-medium' : 'badge-low'
                  }`}>
                    RISK SCORE: {item.risk_score.toFixed(1)}% ({item.risk_level})
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-200">
                  Primary Detected Signal: <span className="text-cyan-300 font-mono">{item.primary_signal}</span>
                </div>

                <div className="space-y-1 pt-1">
                  {item.explanations.map((exp, eIdx) => (
                    <p key={eIdx} className="text-xs text-slate-300 font-mono bg-slate-950/60 p-2 rounded">
                      {exp}
                    </p>
                  ))}
                </div>

                <p className="text-[11px] text-slate-400 font-mono pt-1">
                  Action: <strong className="text-cyan-300">{item.recommended_action}</strong>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
