import React from 'react';
import {
  LayoutDashboard, PhoneCall, Activity, Clock, UserCheck, MessageSquareText,
  FlaskConical, Gauge, BarChart3, Database, TrendingUp, AlertOctagon,
  ShieldCheck, FileCode, Lock, Settings
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'overview', label: '1. Overview', icon: LayoutDashboard },
    { id: 'live-call', label: '2. Live Call Monitor', icon: PhoneCall, highlight: true },
    { id: 'voice-analysis', label: '3. Voice Analysis', icon: Activity },
    { id: 'timeline', label: '4. Risk Timeline', icon: Clock },
    { id: 'speaker-verification', label: '5. Speaker Verification', icon: UserCheck },
    { id: 'context-intelligence', label: '6. Context Intelligence', icon: MessageSquareText },
    { id: 'attack-lab', label: '7. Deepfake Attack Lab', icon: FlaskConical },
    { id: 'robustness-lab', label: '8. Robustness Lab', icon: Gauge },
    { id: 'model-evaluation', label: '9. Model Evaluation', icon: BarChart3 },
    { id: 'model-registry', label: '10. Model Registry', icon: Database },
    { id: 'drift-monitoring', label: '11. Drift Monitoring', icon: TrendingUp },
    { id: 'security-events', label: '12. Security Events', icon: AlertOctagon },
    { id: 'blockchain-audit', label: '13. Blockchain Audit', icon: ShieldCheck },
    { id: 'api-docs', label: '14. API Documentation', icon: FileCode },
    { id: 'privacy', label: '15. Privacy & Security', icon: Lock },
    { id: 'settings', label: '16. Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900/60 border-r border-slate-800 flex flex-col justify-between overflow-y-auto shrink-0">
      <div className="p-4 space-y-1">
        <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500 px-3 py-2">
          SOC NAVIGATION VIEWS
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              } ${item.highlight && !isActive ? 'border border-cyan-500/20 text-cyan-400' : ''}`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-500 font-mono space-y-1">
        <p className="font-semibold text-slate-400">AICTE CYBER SECURITY</p>
        <p>Problem ID: 26104</p>
        <p className="text-cyan-500">VOICEGUARD AI v2.0</p>
      </div>
    </aside>
  );
};
