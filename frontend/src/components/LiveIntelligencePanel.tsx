import React, { useState } from 'react';
import { AudioCanvas } from './AudioCanvas';
import { Activity, Radio, Cpu, Zap, Volume2 } from 'lucide-react';

interface LiveIntelligencePanelProps {
  isLive?: boolean;
  snrDb?: number;
  pitchF0?: number; // e.g. 142.5 Hz
  syntheticScore?: number; // e.g. 0.87
  speakerMatch?: number; // e.g. 0.31
}

export const LiveIntelligencePanel: React.FC<LiveIntelligencePanelProps> = ({
  isLive = true,
  snrDb = 28.5,
  pitchF0 = 142.5,
  syntheticScore = 0.87,
  speakerMatch = 0.31
}) => {
  const [activeTab, setActiveTab] = useState<'WAVEFORM' | 'SPECTROGRAM' | 'VOICE_ENERGY'>('WAVEFORM');

  return (
    <div className="glass-panel-command p-6 space-y-4 relative overflow-hidden border-t-2 border-t-cyan-400">
      {/* Panel Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1 rounded-xl border border-slate-800">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="font-bold text-slate-100 uppercase tracking-wider text-sm">
              LIVE INTELLIGENCE
            </span>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase bg-cyan-950/80 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            REAL-TIME PIPELINE ACTIVE
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800/80">
          {(['WAVEFORM', 'SPECTROGRAM', 'VOICE_ENERGY'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wider transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Visualizer Container with Overlay Signal Markers */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800/90 shadow-2xl bg-slate-950">
        <AudioCanvas isLive={isLive} snrDb={snrDb} />

        {/* Live Signal Overlay Markers directly on canvas */}
        <div className="absolute top-3 left-4 flex flex-wrap items-center gap-2 pointer-events-none z-10">
          <div className="flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-cyan-500/40 text-[10px] font-mono font-bold text-cyan-300 shadow">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>VOICE ACTIVITY</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-rose-500/50 text-[10px] font-mono font-bold text-rose-400 shadow">
            <Zap className="w-3 h-3 text-rose-400 animate-pulse" />
            <span>SYNTHETIC SIGNAL DETECTED</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-amber-500/40 text-[10px] font-mono font-bold text-amber-300 shadow">
            <Activity className="w-3 h-3 text-amber-400" />
            <span>SPEAKER CHANGE TRIGGERED</span>
          </div>
        </div>

        {/* Dynamic Acoustic Telemetry Overlay (Bottom Strip inside the visualizer) */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-3 pt-6 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-300 gap-4 border-t border-slate-800/40">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>PITCH (F0):</span>
              <strong className="text-cyan-300">{pitchF0.toFixed(1)} Hz</strong>
            </span>

            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>SNR:</span>
              <strong className="text-emerald-300">{snrDb.toFixed(1)} dB</strong>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span>SYNTHETIC PROBABILITY:</span>
              <strong className="text-rose-400 font-bold">{(syntheticScore * 100).toFixed(0)}%</strong>
            </span>

            <span className="flex items-center gap-1.5">
              <span>SPEAKER SIMILARITY:</span>
              <strong className="text-amber-400 font-bold">{(speakerMatch * 100).toFixed(0)}%</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
