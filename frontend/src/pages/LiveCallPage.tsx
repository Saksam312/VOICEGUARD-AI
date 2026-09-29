import React, { useState, useEffect } from 'react';
import { PhoneCall, Mic, MicOff, Upload, ShieldAlert, CheckCircle, AlertTriangle, FileText, Lock, ArrowRight, Activity, Cpu } from 'lucide-react';
import { AdvancedRiskOrb } from '../components/AdvancedRiskOrb';
import { AISignalOrb } from '../components/AISignalOrb';
import { ThreatPulse } from '../components/ThreatPulse';
import { LiveIntelligencePanel } from '../components/LiveIntelligencePanel';
import { PreventionPanel } from '../components/PreventionPanel';
import { WhyRiskyBlock } from '../components/WhyRiskyBlock';
import { RiskGraph } from '../components/RiskGraph';
import { AudioAnalysisResponse, CallTimelineItem } from '../types';
import { AudioStreamer } from '../services/audioStreamer';
import { analyzeAudioFile } from '../services/api';

interface LiveCallPageProps {
  activeDemoScenario?: string;
  onNavigateReport: (callId: string) => void;
}

export const LiveCallPage: React.FC<LiveCallPageProps> = ({ activeDemoScenario, onNavigateReport }) => {
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [callId, setCallId] = useState<string>('CALL-042');
  const [analysis, setAnalysis] = useState<AudioAnalysisResponse | null>(null);
  const [timeline, setTimeline] = useState<CallTimelineItem[]>([]);
  const [streamer] = useState<AudioStreamer>(new AudioStreamer());

  useEffect(() => {
    // Set atmosphere background according to risk level
    document.body.className = 'threat-high';
    return () => {
      document.body.className = '';
    };
  }, []);

  useEffect(() => {
    if (!analysis) {
      setAnalysis({
        call_id: 'CALL-042',
        timestamp_offset: '02:41',
        risk_score: 78.0,
        risk_level: 'HIGH',
        signals: {
          deepfake_score: 0.87,
          acoustic_anomaly: 0.65,
          prosody_anomaly: 0.68,
          speaker_match_score: 0.31,
          replay_probability: 0.15,
          context_risk_score: 0.91,
          uncertainty: 0.12
        },
        uncertainty_category: 'Known synthetic',
        explanations: [
          'SYNTHETIC VOICE SIGNAL: Unusual spectral characteristics & vocoder cutoff detected (87%)',
          'SPEAKER MISMATCH: Current voice differs from registered voiceprint profile (Similarity: 31%)',
          'SENSITIVE REQUEST: Financial transaction wire transfer demand detected (Context Risk: 91%)'
        ],
        recommended_action: 'Perform secondary identity verification before executing financial request.',
        audio_metrics: { snr_db: 28.5, speech_duration_sec: 3.0, latency_ms: 38.2 }
      });

      setTimeline([
        { timestamp_offset: '00:05', risk_score: 18.0, risk_level: 'LOW', primary_signal: 'Call Connected', explanations: ['Call connected'], recommended_action: 'Standard monitoring' },
        { timestamp_offset: '00:45', risk_score: 42.0, risk_level: 'MEDIUM', primary_signal: 'Voice Anomaly', explanations: ['Pitch contour variation'], recommended_action: 'Enhanced monitoring' },
        { timestamp_offset: '01:20', risk_score: 63.0, risk_level: 'HIGH', primary_signal: 'Synthetic Signal', explanations: ['Neural vocoder cutoff artifact'], recommended_action: 'Request verification' },
        { timestamp_offset: '02:10', risk_score: 74.0, risk_level: 'HIGH', primary_signal: 'Speaker Mismatch', explanations: ['Voiceprint mismatch'], recommended_action: 'Request MFA' },
        { timestamp_offset: '02:41', risk_score: 78.0, risk_level: 'HIGH', primary_signal: 'Sensitive Request', explanations: ['Financial request detected'], recommended_action: 'Perform secondary verification' }
      ]);
    }
  }, []);

  const toggleMic = () => {
    if (isMicActive) {
      streamer.stopStream();
      setIsMicActive(false);
    } else {
      const newCallId = `CALL-${Math.floor(Math.random()*900)+100}`;
      setCallId(newCallId);
      setIsMicActive(true);
      streamer.startStream(newCallId, (data) => {
        setAnalysis(data);
        if (data.timestamp_offset) {
          setTimeline(prev => [...prev, {
            timestamp_offset: data.timestamp_offset,
            risk_score: data.risk_score,
            risk_level: data.risk_level,
            primary_signal: data.risk_score > 60 ? 'Synthetic AI Indicator' : 'Voice Authenticity',
            explanations: data.explanations,
            recommended_action: data.recommended_action
          }]);
        }
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    try {
      const res = await analyzeAudioFile(e.target.files[0]);
      setAnalysis(res);
      setCallId(res.call_id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* HERO CALL HEADER */}
      <div className="glass-panel-hero p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-cyan-400">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono font-extrabold text-2xl text-slate-100">
              {callId} <span className="text-cyan-400 font-normal">| INDIGO ENTERPRISE</span>
            </span>
            <span className="badge-critical flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
              ● LIVE STREAMING
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time sliding ensemble analyzing spectral flux, neural vocoder artifacts, and conversation intent.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ThreatPulse level={analysis?.risk_level || 'HIGH'} />

          <label className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-all border border-slate-700">
            <Upload className="w-4 h-4 text-cyan-400" />
            Upload Test Audio
            <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={toggleMic}
            className={`flex items-center gap-2 font-mono font-bold text-xs uppercase px-5 py-2.5 rounded-xl transition-all ${
              isMicActive
                ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-500/30'
                : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-lg shadow-emerald-500/30'
            }`}
          >
            {isMicActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {isMicActive ? 'STOP MIC' : 'START MIC'}
          </button>
        </div>
      </div>

      {/* ADVANCED MULTI-RING RISK ORB & AI SIGNALS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-5 glass-panel-command p-6 flex flex-col items-center justify-center">
          <AdvancedRiskOrb
            score={analysis?.risk_score || 78.0}
            level={analysis?.risk_level as any || 'HIGH'}
            threatType="AI IMPERSONATION"
            signals={{
              voice: analysis?.signals.deepfake_score || 0.87,
              speaker: analysis?.signals.speaker_match_score || 0.31,
              prosody: analysis?.signals.prosody_anomaly || 0.68,
              context: analysis?.signals.context_risk_score || 0.91
            }}
          />
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AISignalOrb label="VOICE SIGNAL" value={analysis?.signals.deepfake_score || 0.87} statusText={analysis?.signals.deepfake_score! > 0.6 ? 'SYNTHETIC' : 'NATURAL'} colorType="rose" />
          <AISignalOrb label="SPEAKER CONSISTENCY" value={analysis?.signals.speaker_match_score || 0.31} statusText={analysis?.signals.speaker_match_score! < 0.6 ? 'MISMATCH' : 'MATCHED'} colorType="amber" />
          <AISignalOrb label="ACOUSTIC PROFILE" value={analysis?.signals.acoustic_anomaly || 0.65} statusText={analysis?.signals.acoustic_anomaly! > 0.5 ? 'ANOMALY' : 'NORMAL'} colorType="purple" />
          <AISignalOrb label="PROSODY CONTOUR" value={analysis?.signals.prosody_anomaly || 0.68} statusText={analysis?.signals.prosody_anomaly! > 0.5 ? 'UNNATURAL' : 'NATURAL'} colorType="cyan" />
          <AISignalOrb label="CONTEXT INTEL" value={analysis?.signals.context_risk_score || 0.91} statusText={analysis?.signals.context_risk_score! > 0.6 ? 'CRITICAL REQUEST' : 'NORMAL'} colorType="rose" />
        </div>
      </div>

      {/* LIVE INTELLIGENCE WAVEFORM PANEL */}
      <LiveIntelligencePanel
        isLive={isMicActive || true}
        snrDb={analysis?.audio_metrics.snr_db || 28.5}
        pitchF0={142.5}
        syntheticScore={analysis?.signals.deepfake_score || 0.87}
        speakerMatch={analysis?.signals.speaker_match_score || 0.31}
      />

      {/* RISK EVOLUTION TIMELINE GRAPH */}
      <RiskGraph timeline={timeline.map(t => ({ offset: t.timestamp_offset, score: t.risk_score }))} />

      {/* WHY THIS CALL IS RISKY & SECURITY PREVENTION PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <WhyRiskyBlock />
        </div>

        <div className="lg:col-span-5">
          <PreventionPanel
            callId={callId}
            riskScore={analysis?.risk_score || 78.0}
            onActionExecuted={(act) => console.log('Action:', act)}
          />
        </div>
      </div>
    </div>
  );
};
