import React, { useEffect, useState } from 'react';
import { AlertOctagon, ShieldAlert, FileText, Clock, List, LayoutGrid, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { SecurityEventItem } from '../types';
import { fetchSecurityEvents } from '../services/api';

interface SecurityEventsPageProps {
  onNavigateReport: (callId: string) => void;
}

export const SecurityEventsPage: React.FC<SecurityEventsPageProps> = ({ onNavigateReport }) => {
  const [events, setEvents] = useState<SecurityEventItem[]>([]);
  const [viewMode, setViewMode] = useState<'FEED' | 'TABLE'>('FEED');

  useEffect(() => {
    fetchSecurityEvents().then(setEvents);
  }, []);

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="glass-panel-command p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-rose-500">
        <div>
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
            <AlertOctagon className="w-4 h-4 animate-pulse" />
            <span>SECURITY INCIDENTS FEED</span>
          </div>
          <h2 className="text-2xl font-extrabold font-mono text-slate-100 mt-1 tracking-tight">
            SECURITY INCIDENTS
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time threat detection feed and immutable incident ledger.
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 font-mono text-xs">
          <button
            onClick={() => setViewMode('FEED')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold transition-all ${
              viewMode === 'FEED'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            VISUAL FEED
          </button>
          <button
            onClick={() => setViewMode('TABLE')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold transition-all ${
              viewMode === 'TABLE'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            TABLE MODE
          </button>
        </div>
      </div>

      {/* VISUAL INCIDENT FEED VIEW */}
      {viewMode === 'FEED' && (
        <div className="space-y-4 font-mono">
          {events.map((evt) => (
            <div
              key={evt.event_id}
              className={`glass-panel-command p-5 space-y-4 transition-all hover:scale-[1.01] border-l-4 ${
                evt.severity === 'CRITICAL' ? 'border-l-rose-500' :
                evt.severity === 'HIGH' ? 'border-l-orange-500' : 'border-l-amber-500'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-rose-400">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-extrabold text-slate-100">{evt.event_id}</span>
                      <span className="text-slate-700">|</span>
                      <span className="text-cyan-400 font-bold">{evt.call_id}</span>
                      <span className="text-slate-700">|</span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" /> 19:42:31 UTC
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-100 mt-1">{evt.title}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${
                    evt.severity === 'CRITICAL' ? 'badge-critical' : 'badge-high'
                  }`}>
                    {evt.severity} RISK
                  </span>

                  <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                    UNDER REVIEW
                  </span>

                  <button
                    onClick={() => onNavigateReport(evt.call_id)}
                    className="px-4 py-2 bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 text-xs font-bold rounded-xl border border-cyan-500/40 flex items-center gap-2 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    FORENSIC REPORT
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed">
                {evt.description}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-3 gap-2">
                <span>ACTION TAKEN: <strong className="text-cyan-300">{evt.action_taken}</strong></span>
                <span>AUDIT HASH: <strong className="text-slate-300 font-mono">{evt.audit_hash.slice(0, 24)}...</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* OPTIONAL TABLE MODE VIEW */}
      {viewMode === 'TABLE' && (
        <div className="glass-panel-command p-6 font-mono text-xs overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase tracking-wider">
                <th className="p-3">TIMESTAMP</th>
                <th className="p-3">EVENT ID</th>
                <th className="p-3">CALL ID</th>
                <th className="p-3">THREAT TYPE</th>
                <th className="p-3">RISK LEVEL</th>
                <th className="p-3">STATUS</th>
                <th className="p-3">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {events.map((evt) => (
                <tr key={evt.event_id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 text-slate-400">19:42:31</td>
                  <td className="p-3 font-bold text-rose-400">{evt.event_id}</td>
                  <td className="p-3 font-bold text-cyan-300">{evt.call_id}</td>
                  <td className="p-3 font-bold">{evt.title}</td>
                  <td className="p-3">
                    <span className="badge-high">{evt.severity}</span>
                  </td>
                  <td className="p-3 text-amber-400 font-bold">UNDER REVIEW</td>
                  <td className="p-3">
                    <button
                      onClick={() => onNavigateReport(evt.call_id)}
                      className="px-3 py-1 bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 text-[11px] font-bold rounded border border-cyan-500/30 flex items-center gap-1"
                    >
                      REPORT
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
