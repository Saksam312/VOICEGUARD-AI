import React from 'react';
import {
  PhoneCall, Activity, Clock, UserCheck, MessageSquareText,
  FlaskConical, AlertOctagon, FileText, ShieldCheck, Cpu,
  TrendingUp, BarChart3, Database, Shield, Settings, HeartPulse
} from 'lucide-react';

interface PremiumSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const PremiumSidebar: React.FC<PremiumSidebarProps> = ({ activeTab, setActiveTab }) => {
  const sections = [
    {
      category: 'LIVE SECURITY',
      items: [
        { id: 'live-call', label: 'Live Calls', icon: PhoneCall, highlight: true },
        { id: 'voice-analysis', label: 'Voice Intelligence', icon: Activity },
        { id: 'timeline', label: 'Risk Monitor', icon: Clock }
      ]
    },
    {
      category: 'ANALYSIS',
      items: [
        { id: 'speaker-verification', label: 'Speaker Verification', icon: UserCheck },
        { id: 'context-intelligence', label: 'Context Intelligence', icon: MessageSquareText },
        { id: 'attack-lab', label: 'Attack Lab', icon: FlaskConical }
      ]
    },
    {
      category: 'SECURITY',
      items: [
        { id: 'security-events', label: 'Incidents', icon: AlertOctagon },
        { id: 'report', label: 'Forensics', icon: FileText },
        { id: 'blockchain-audit', label: 'Audit Ledger', icon: ShieldCheck }
      ]
    },
    {
      category: 'AI OPERATIONS',
      items: [
        { id: 'model-registry', label: 'Model Intelligence', icon: Database },
        { id: 'drift-monitoring', label: 'Model Monitoring', icon: TrendingUp },
        { id: 'model-evaluation', label: 'Evaluation', icon: BarChart3 }
      ]
    },
    {
      category: 'SYSTEM',
      items: [
        { id: 'privacy', label: 'System Privacy', icon: HeartPulse },
        { id: 'api-docs', label: 'API Reference', icon: Cpu },
        { id: 'settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900/40 backdrop-blur-2xl border-r border-slate-800/80 flex flex-col justify-between overflow-y-auto shrink-0 select-none">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="px-2 py-1 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="font-mono font-extrabold text-xs tracking-wider text-slate-200">
              ◉ COMMAND CONSOLE
            </span>
          </div>
        </div>

        {/* Grouped Categories */}
        {sections.map((sec, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 px-3 py-1">
              {sec.category}
            </div>
            {sec.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono transition-all relative group ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {/* Active Left Accent Line */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r shadow-[0_0_8px_#22d3ee]"></span>
                  )}
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span className="truncate tracking-wide">{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 font-mono text-[10px] text-slate-500 space-y-0.5">
        <p className="font-bold text-slate-300">AICTE CYBERSECURITY CELL</p>
        <p>PROBLEM STATEMENT ID: 26104</p>
        <p className="text-cyan-400 font-semibold">VOICEGUARD AI v2.0</p>
      </div>
    </aside>
  );
};
