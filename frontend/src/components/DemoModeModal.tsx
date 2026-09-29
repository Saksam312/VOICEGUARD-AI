import React from 'react';
import { X, Play, ShieldAlert, Cpu, Repeat, AlertTriangle, PhoneCall, CheckCircle } from 'lucide-react';

interface DemoModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenarioKey: string) => void;
}

export const DemoModeModal: React.FC<DemoModeModalProps> = ({ isOpen, onClose, onSelectScenario }) => {
  if (!isOpen) return null;

  const scenarios = [
    {
      key: 'GENUINE_EXECUTIVE',
      title: 'Scenario 1: Genuine Executive Call',
      badge: 'LOW RISK (8-14%)',
      badgeClass: 'badge-low',
      icon: CheckCircle,
      iconColor: 'text-emerald-400',
      description: 'Authenticated executive discussing routine quarterly project update. Voiceprint matches baseline.'
    },
    {
      key: 'AI_VOICE_CLONE',
      title: 'Scenario 2: AI Voice Cloning Attack',
      badge: 'CRITICAL RISK (88%)',
      badgeClass: 'badge-critical',
      icon: Cpu,
      iconColor: 'text-rose-400',
      description: 'Deepfake voice clone attempting identity spoofing. High-frequency neural vocoder cutoff flagged.'
    },
    {
      key: 'VOICE_CONVERSION',
      title: 'Scenario 3: Voice Conversion (RVC) Attack',
      badge: 'CRITICAL RISK (81%)',
      badgeClass: 'badge-critical',
      icon: ShieldAlert,
      iconColor: 'text-orange-400',
      description: 'Real-time Retrieval-based Voice Conversion (RVC) overlay with micro-pitch tracking alignment.'
    },
    {
      key: 'REPLAY_ATTACK',
      title: 'Scenario 4: Replay Attack',
      badge: 'HIGH RISK (64%)',
      badgeClass: 'badge-high',
      icon: Repeat,
      iconColor: 'text-amber-400',
      description: 'Pre-recorded human speech replayed through a smartphone speaker into microphone.'
    },
    {
      key: 'SYNTHETIC_FINANCIAL',
      title: 'Scenario 5: Synthetic Voice + Financial Urgency',
      badge: 'CRITICAL RISK (95%)',
      badgeClass: 'badge-critical',
      icon: AlertTriangle,
      iconColor: 'text-rose-400',
      description: 'AI generated voice demanding immediate ₹10 Lakh wire transfer. High contextual & deepfake risk.'
    },
    {
      key: 'NOISY_TELEPHONE',
      title: 'Scenario 6: Noisy Cellular Telephone Call',
      badge: 'MEDIUM RISK (35%)',
      badgeClass: 'badge-medium',
      icon: PhoneCall,
      iconColor: 'text-cyan-400',
      description: 'Legitimate caller in noisy environment with G.711 telephone compression. High uncertainty.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="glass-panel-glow max-w-3xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/30">
                HACKATHON PRESENTATION MODE
              </span>
            </div>
            <h2 className="text-xl font-bold font-mono text-slate-100 mt-1">
              Select Reproducible Demo Scenario
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300">
          Demo mode allows judges to experience the full real-time detection, signal breakdown, dynamic risk timeline, XAI explanation, and tamper-evident audit workflow without live telecom wiring.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios.map((sc) => {
            const Icon = sc.icon;
            return (
              <div
                key={sc.key}
                onClick={() => {
                  onSelectScenario(sc.key);
                  onClose();
                }}
                className="glass-panel p-4 hover:border-cyan-500/50 cursor-pointer transition-all hover:scale-[1.01] space-y-2 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${sc.iconColor}`} />
                    <h3 className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300">
                      {sc.title}
                    </h3>
                  </div>
                  <span className={sc.badgeClass}>{sc.badge}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {sc.description}
                </p>
                <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 pt-1 font-semibold group-hover:underline">
                  <Play className="w-3 h-3 fill-cyan-400" />
                  RUN SCENARIO SIMULATION
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span>* All demo values explicitly tagged as DEMO / SIMULATION mode.</span>
          <button onClick={onClose} className="px-3 py-1 bg-slate-800 text-slate-200 rounded text-xs hover:bg-slate-700">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
