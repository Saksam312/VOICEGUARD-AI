import React, { useState } from 'react';
import { AudioCanvas } from './AudioCanvas';

interface LiveWaveformPanelProps {
  isLive?: boolean;
  snrDb?: number;
}

export const LiveWaveformPanel: React.FC<LiveWaveformPanelProps> = ({ isLive = false, snrDb = 28.5 }) => {
  const [activeTab, setActiveTab] = useState<'WAVEFORM' | 'SPECTROGRAM' | 'VOICE_ENERGY'>('WAVEFORM');

  return (
    <div className="glass-panel-command p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'}`}></span>
            LIVE VOICE STREAM ANALYZER
          </span>
          <span className="text-[10px] uppercase bg-cyan-950/80 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
            ● ANALYZING
          </span>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(['WAVEFORM', 'SPECTROGRAM', 'VOICE_ENERGY'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider transition-all ${
                activeTab === tab
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <AudioCanvas isLive={isLive} snrDb={snrDb} />
    </div>
  );
};
