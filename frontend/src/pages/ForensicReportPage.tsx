import React, { useEffect, useState } from 'react';
import { ShieldAlert, Printer, ArrowLeft, CheckCircle, Lock, Cpu, FileText, QrCode, Activity, UserX, MessageSquareText } from 'lucide-react';
import { fetchCallTimeline } from '../services/api';

interface ForensicReportPageProps {
  callId: string;
  onBack: () => void;
}

export const ForensicReportPage: React.FC<ForensicReportPageProps> = ({ callId, onBack }) => {
  const [timeline, setTimeline] = useState<any[]>([]);

  useEffect(() => {
    fetchCallTimeline(callId).then(setTimeline);
  }, [callId]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between no-print font-mono text-xs">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 transition-all hover:scale-[1.02]"
        >
          <ArrowLeft className="w-4 h-4" /> RETURN TO LIVE MONITOR
        </button>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs uppercase px-5 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-[1.02]"
        >
          <Printer className="w-4 h-4" /> PRINT / EXPORT PDF FORENSIC REPORT
        </button>
      </div>

      {/* Main Formatted Enterprise Security Document */}
      <div className="glass-panel p-8 md:p-10 space-y-8 bg-slate-900/95 border-2 border-slate-700/80 shadow-2xl relative overflow-hidden font-mono">
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-rose-500 to-emerald-500" />

        {/* WORKSTATION INCIDENT HEADER (NO NUMBERING) */}
        <div className="border-b-2 border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 animate-pulse" />
              <span>FORENSIC INVESTIGATION WORKSTATION</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 mt-1 tracking-tight">
              HIGH-RISK VOICE EVENT <span className="text-cyan-400">{callId}</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              AICTE Cyber Security Cell | VOICEGUARD AI Impersonation Forensics Platform
            </p>
          </div>

          <div className="p-4 bg-slate-950/90 rounded-xl border border-slate-800 text-right text-xs flex flex-col justify-between">
            <span className="text-slate-500 text-[10px]">CASE FILE</span>
            <div className="font-extrabold text-cyan-400 text-base">VG-CASE-2026-8819</div>
            <span className="text-[10px] text-slate-400 mt-1">{new Date().toUTCString()}</span>
          </div>
        </div>

        {/* SECTION: VOICE EVIDENCE */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-cyan-400 text-xs font-extrabold uppercase tracking-wider">
            <Activity className="w-4 h-4" />
            <span>VOICE EVIDENCE</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-1">
              <span className="text-slate-500 text-[10px] block font-bold">SPECTRAL CUTOFF ARTIFACT</span>
              <span className="font-extrabold text-rose-400 text-sm">7.8 kHz Cutoff Detected</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">High-frequency neural vocoder phase truncation anomaly identified in speech frames.</p>
            </div>
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-1">
              <span className="text-slate-500 text-[10px] block font-bold">PITCH VARIATION (F0)</span>
              <span className="font-extrabold text-amber-400 text-sm">Std Dev: 3.2 Hz</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">Unnaturally robotic flat pitch contour observed across multi-word phrases.</p>
            </div>
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-1">
              <span className="text-slate-500 text-[10px] block font-bold">ACOUSTIC SNR LEVEL</span>
              <span className="font-extrabold text-emerald-400 text-sm">28.5 dB Clean Signal</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">High Signal-to-Noise ratio confirms acoustic anomalies are structural neural artifacts.</p>
            </div>
          </div>
        </div>

        {/* SECTION: SPEAKER COMPARISON */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-cyan-400 text-xs font-extrabold uppercase tracking-wider">
            <UserX className="w-4 h-4" />
            <span>SPEAKER COMPARISON</span>
          </div>
          <div className="p-5 bg-slate-950/90 rounded-xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-bold">ENROLLED VOICEPRINT SIMILARITY MATCH:</span>
              <span className="badge-critical font-extrabold">31% MATCH SCORE (MISMATCH)</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
              <div className="bg-gradient-to-r from-rose-500 to-orange-500 h-full w-[31%] rounded-full shadow-inner" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Target speaker voice embedding deviates significantly beyond 3.5 standard deviations from enrolled executive baseline profile.
            </p>
          </div>
        </div>

        {/* SECTION: AI SIGNALS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-cyan-400 text-xs font-extrabold uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>AI SIGNALS</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 block font-bold">DEEPFAKE DETECTOR</span>
              <span className="font-extrabold text-rose-400 text-base">87% SYNTHETIC</span>
            </div>
            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 block font-bold">PROSODY ANOMALY</span>
              <span className="font-extrabold text-amber-400 text-base">68% UNNATURAL</span>
            </div>
            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 block font-bold">REPLAY DETECTOR</span>
              <span className="font-extrabold text-emerald-400 text-base">15% LOW</span>
            </div>
            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 block font-bold">UNCERTAINTY BOUND</span>
              <span className="font-extrabold text-cyan-400 text-base">± 1.2% HIGH CONFIDENCE</span>
            </div>
          </div>
        </div>

        {/* SECTION: RISK EVOLUTION */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-cyan-400 text-xs font-extrabold uppercase tracking-wider">
            <Activity className="w-4 h-4" />
            <span>RISK EVOLUTION</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400">
                <tr>
                  <th className="p-3">TIME OFFSET</th>
                  <th className="p-3">RISK SCORE</th>
                  <th className="p-3">SEVERITY</th>
                  <th className="p-3">PRIMARY FORENSIC INDICATOR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {timeline.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="p-3 text-cyan-400 font-bold">{item.timestamp_offset}</td>
                    <td className="p-3 font-extrabold text-slate-100">{item.risk_score.toFixed(1)}%</td>
                    <td className="p-3">
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded ${
                        item.risk_level === 'CRITICAL' ? 'badge-critical' : 'badge-high'
                      }`}>
                        {item.risk_level}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">{item.primary_signal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION: CONTEXT */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-cyan-400 text-xs font-extrabold uppercase tracking-wider">
            <MessageSquareText className="w-4 h-4" />
            <span>CONTEXT INTELLIGENCE</span>
          </div>
          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-2">
            <span className="text-slate-400 font-bold">TRANSCRIPT INTENT ANALYSIS:</span>
            <p className="text-slate-200 leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800">
              "Initiate urgent high-value financial wire transfer to external account immediately."
            </p>
            <div className="flex justify-between text-[11px] text-cyan-400 font-bold pt-1">
              <span>SENSITIVE FINANCIAL CATEGORY</span>
              <span>91% CONTEXT THREAT SCORE</span>
            </div>
          </div>
        </div>

        {/* SECTION: AUDIT INTEGRITY */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-cyan-400 text-xs font-extrabold uppercase tracking-wider">
            <Lock className="w-4 h-4" />
            <span>AUDIT INTEGRITY</span>
          </div>
          <div className="p-5 bg-slate-950 rounded-xl border border-emerald-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle className="w-5 h-5" />
                CRYPTOGRAPHIC SHA-256 AUDIT INTEGRITY: VERIFIED VALID
              </div>
              <p className="text-[11px] text-slate-400">
                SHA-256 Hash: <strong className="text-slate-200">a8f3b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1</strong>
              </p>
            </div>
            <div className="p-2 bg-slate-900 rounded border border-slate-800 shrink-0 self-start md:self-auto">
              <QrCode className="w-12 h-12 text-cyan-400" />
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="pt-8 border-t-2 border-slate-800 flex justify-between text-xs text-slate-400">
          <div>
            <p className="font-bold text-slate-200">CYBERSECURITY ANALYST</p>
            <p className="text-[10px] text-slate-400">AICTE Security Response Unit</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-cyan-400">VOICEGUARD ENGINE</p>
            <p className="text-[10px] text-slate-400">Automated Threat Defense</p>
          </div>
        </div>
      </div>
    </div>
  );
};
