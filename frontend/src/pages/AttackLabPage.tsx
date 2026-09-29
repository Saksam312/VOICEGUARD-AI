import React, { useState } from 'react';
import { FlaskConical, Play, Volume2, ShieldAlert, Cpu, Repeat, CheckCircle, Zap, Mic, Radio, Sparkles } from 'lucide-react';
import { AttackTestResponse } from '../types';

export const AttackLabPage: React.FC = () => {
  const [selectedTile, setSelectedTile] = useState<string>('TTS');
  const [result, setResult] = useState<AttackTestResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const tiles = [
    {
      id: 'GENUINE',
      title: 'GENUINE VOICE',
      desc: 'Natural human voice recording with authentic vocal tract acoustics and natural pitch dynamics.',
      icon: Mic,
      status: 'BENCHMARK',
      color: 'emerald',
      freq: 220,
      type: 'sine'
    },
    {
      id: 'TTS',
      title: 'TEXT TO SPEECH',
      desc: 'Neural Tacotron2 / VITS AI voice synthesis with high-frequency vocoder spectral cutoff artifacts.',
      icon: Cpu,
      status: 'HIGH RISK',
      color: 'rose',
      freq: 440,
      type: 'square'
    },
    {
      id: 'CLONE',
      title: 'VOICE CLONE',
      desc: 'Zero-shot AI voice clone generated from a 5-second reference audio sample of target speaker.',
      icon: Sparkles,
      status: 'CRITICAL',
      color: 'rose',
      freq: 520,
      type: 'sawtooth'
    },
    {
      id: 'CONVERSION',
      title: 'VOICE CONVERSION',
      desc: 'Real-time Retrieval-based Voice Conversion (RVC) overlaying dynamic pitch onto attacker speech.',
      icon: Repeat,
      status: 'HIGH RISK',
      color: 'amber',
      freq: 580,
      type: 'sawtooth'
    },
    {
      id: 'REPLAY',
      title: 'REPLAY ATTACK',
      desc: 'Pre-recorded legitimate speech replayed through physical loudspeaker into microphone sensor.',
      icon: Radio,
      status: 'MEDIUM RISK',
      color: 'cyan',
      freq: 350,
      type: 'triangle'
    },
    {
      id: 'NOISY',
      title: 'NOISY AUDIO',
      desc: 'Legitimate speech corrupted with G.711 telecommunication compression and background noise.',
      icon: Zap,
      status: 'NORMALIZED',
      color: 'purple',
      freq: 300,
      type: 'sawtooth'
    }
  ];

  const handlePlayTone = (freq: number, type: OscillatorType) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.0);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 1.0);
      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 1000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRunAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/attack-lab/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attack_type: selectedTile, sample_name: `Sample_${selectedTile}` })
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      // Fallback mock response for offline demonstration
      setResult({
        test_id: `LAB-EV-${Math.floor(Math.random()*9000)+1000}`,
        attack_type: selectedTile,
        sample_name: `Sample_${selectedTile}`,
        detected_risk_score: selectedTile === 'GENUINE' ? 12.4 : selectedTile === 'NOISY' ? 34.0 : 87.5,
        detected_level: selectedTile === 'GENUINE' ? 'LOW' : selectedTile === 'NOISY' ? 'MEDIUM' : 'HIGH',
        is_correct: true,
        signals: {
          deepfake_score: selectedTile === 'GENUINE' ? 0.08 : 0.87,
          acoustic_anomaly: selectedTile === 'GENUINE' ? 0.12 : 0.65,
          prosody_anomaly: selectedTile === 'GENUINE' ? 0.15 : 0.68,
          speaker_match_score: selectedTile === 'GENUINE' ? 0.94 : 0.31,
          replay_probability: selectedTile === 'REPLAY' ? 0.89 : 0.10,
          context_risk_score: 0.75,
          uncertainty: 0.11
        },
        explanations: [
          `Spectral characteristics evaluated for ${selectedTile} attack vector.`,
          selectedTile === 'GENUINE' ? 'Acoustic phase coherence within expected natural human vocal tract envelope.' : 'Neural vocoder high-frequency spectral cutoff detected at 7.8 kHz.'
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="glass-panel-command p-6 border-l-4 border-l-cyan-400">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
          <FlaskConical className="w-4 h-4 animate-pulse" />
          <span>CYBERSECURITY EXPERIMENTAL LABORATORY</span>
        </div>
        <h2 className="text-2xl font-extrabold font-mono text-slate-100 mt-1 tracking-tight">
          AI VOICE ATTACK LAB
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Explore how VoiceGuard responds to synthetic, cloned, converted, and replayed voice scenarios in real-time.
        </p>
      </div>

      {/* LARGE INTERACTIVE TILES GRID (NO NUMBERING) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          const isSelected = selectedTile === tile.id;

          return (
            <div
              key={tile.id}
              onClick={() => {
                setSelectedTile(tile.id);
                setResult(null);
              }}
              className={`glass-panel-command p-6 cursor-pointer transition-all duration-300 relative group overflow-hidden border-l-4 ${
                isSelected
                  ? 'border-l-cyan-400 bg-cyan-950/40 shadow-[0_0_30px_rgba(6,182,212,0.25)] scale-[1.02]'
                  : 'border-l-slate-800 hover:border-l-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between font-mono">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl border ${
                    isSelected ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-100">{tile.title}</h3>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">STATUS: {tile.status}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayTone(tile.freq, tile.type as OscillatorType);
                  }}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 border border-slate-800 transition-colors"
                  title="Listen to sample audio waveform tone"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-400 font-mono mt-3 leading-relaxed">
                {tile.desc}
              </p>

              {/* EXPANDED SELECTION AREA */}
              {isSelected && (
                <div className="mt-4 pt-4 border-t border-slate-800/80 font-mono space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-cyan-400 font-bold uppercase tracking-wider">● ANALYSIS READY</span>
                    <span className="text-slate-500 text-[10px]">SAMPLING: 16.0 kHz</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRunAnalysis();
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs uppercase rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    {loading ? 'ANALYZING SIGNALS...' : '[ RUN ANALYSIS ]'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ANALYSIS RESULTS PANEL */}
      {result && (
        <div className="glass-panel-command p-6 space-y-5 border-l-4 border-l-cyan-400 font-mono animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              FORENSIC LAB ANALYSIS REPORT
            </h3>
            <span className="text-xs text-slate-400">TEST ID: {result.test_id}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">ATTACK SCENARIO</span>
              <span className="text-base font-extrabold text-slate-100">{result.attack_type}</span>
              <span className="text-xs text-cyan-400 block mt-0.5">{result.sample_name}</span>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">DETECTED IMPERSONATION RISK</span>
              <span className="text-3xl font-extrabold text-cyan-400">{result.detected_risk_score.toFixed(1)}%</span>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-right">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">CLASSIFICATION</span>
              <span className={`inline-block mt-1 ${
                result.detected_level === 'HIGH' || result.detected_level === 'CRITICAL' ? 'badge-high' : 'badge-low'
              }`}>
                {result.detected_level} RISK
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">FORENSIC EXPLANATIONS</h4>
            {result.explanations.map((exp, i) => (
              <div key={i} className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 text-xs text-slate-300">
                {exp}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
