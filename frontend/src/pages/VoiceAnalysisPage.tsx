import React, { useState } from 'react';
import { Activity, Upload, BarChart2, Cpu, CheckCircle } from 'lucide-react';
import { analyzeAudioFile } from '../services/api';
import { AudioAnalysisResponse } from '../types';

export const VoiceAnalysisPage: React.FC = () => {
  const [analysis, setAnalysis] = useState<AudioAnalysisResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setLoading(true);
    try {
      const res = await analyzeAudioFile(e.target.files[0]);
      setAnalysis(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 border-l-4 border-l-cyan-500">
        <h2 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          Voice Forensic Analysis Lab
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Perform deep forensic acoustic, prosodic, spectral flux, and neural vocoder artifact analysis on uploaded or selected audio files.
        </p>
      </div>

      <div className="glass-panel p-8 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-xl space-y-4">
        <Upload className="w-10 h-10 text-cyan-400 animate-bounce" />
        <div className="text-center">
          <h3 className="text-sm font-bold text-slate-200">Upload Voice Recording for Forensic Inspection</h3>
          <p className="text-xs text-slate-400 mt-0.5">Supports WAV, MP3, OGG, FLAC (16kHz sample rate recommended)</p>
        </div>
        <label className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs px-6 py-2.5 rounded-lg cursor-pointer transition-all">
          {loading ? 'ANALYZING AUDIO...' : 'SELECT AUDIO FILE'}
          <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-sm font-mono font-bold uppercase text-cyan-400">ACOUSTIC & PROSODIC PARAMETERS</h3>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between p-2 bg-slate-950 rounded">
                <span className="text-slate-400">Harmonic-to-Noise Ratio (HNR):</span>
                <span className="font-bold text-emerald-400">{analysis.audio_metrics.snr_db} dB</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-950 rounded">
                <span className="text-slate-400">Deepfake Probability:</span>
                <span className="font-bold text-rose-400">{(analysis.signals.deepfake_score * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-950 rounded">
                <span className="text-slate-400">Acoustic Anomaly Score:</span>
                <span className="font-bold text-amber-400">{(analysis.signals.acoustic_anomaly * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-950 rounded">
                <span className="text-slate-400">Prosody Anomaly Score:</span>
                <span className="font-bold text-purple-400">{(analysis.signals.prosody_anomaly * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-950 rounded">
                <span className="text-slate-400">Speaker Cosine Similarity:</span>
                <span className="font-bold text-cyan-400">{(analysis.signals.speaker_match_score * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-sm font-mono font-bold uppercase text-cyan-400">FORENSIC EXPLANATIONS & INDICATORS</h3>
            <div className="space-y-2 text-xs">
              {analysis.explanations.map((exp, idx) => (
                <div key={idx} className="p-3 bg-slate-950 rounded border border-slate-800 text-slate-200 font-mono">
                  {exp}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
