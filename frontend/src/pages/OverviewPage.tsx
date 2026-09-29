import React, { useEffect, useState } from 'react';
import { PhoneCall, ShieldAlert, Radio, ArrowRight, Activity, Zap, CheckCircle2, Shield, Lock } from 'lucide-react';
import { AdvancedRiskOrb } from '../components/AdvancedRiskOrb';
import { LiveIntelligencePanel } from '../components/LiveIntelligencePanel';
import { WhyRiskyBlock } from '../components/WhyRiskyBlock';
import { PreventionPanel } from '../components/PreventionPanel';
import { SecurityPulse } from '../components/SecurityPulse';
import { CallSummary, SecurityEventItem } from '../types';
import { fetchRecentCalls, fetchSecurityEvents } from '../services/api';

interface OverviewPageProps {
  onNavigate: (tab: string, callId?: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate }) => {
  const [calls, setCalls] = useState<CallSummary[]>([]);
  const [events, setEvents] = useState<SecurityEventItem[]>([]);

  useEffect(() => {
    fetchRecentCalls().then(setCalls);
    fetchSecurityEvents().then(setEvents);

    // Set body background threat atmosphere to HIGH for overview demo
    document.body.className = 'threat-high';
    return () => {
      document.body.className = '';
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* 1. TOP COMPACT SECURITY PULSE HEADER */}
      <SecurityPulse
        liveCallsCount={calls.length || 7}
        highRiskCount={2}
        threatsCount={14}
        systemHealth={99}
      />

      {/* 2. MAIN ASYMMETRICAL HERO COMMAND PANEL */}
      <div className="glass-panel-hero p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-l-4 border-l-cyan-400">
        
        {/* LEFT COLUMN: LIVE CALL IDENTIFIER */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>LIVE CALL MONITORING</span>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-100 tracking-tight">
                CALL-042
              </h2>
              <span className="badge-critical flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
                ● LIVE
              </span>
            </div>

            <div className="font-mono text-xs text-cyan-400 font-bold mt-1">
              DURATION: 02:41
            </div>

            <p className="text-xs text-slate-400 font-mono mt-3 leading-relaxed bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
              "Voice stream currently under multi-signal spectral and context neural analysis..."
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('live-call', 'CALL-042')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 via-indigo-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs uppercase px-6 py-3 rounded-xl shadow-lg shadow-cyan-500/30 transform hover:scale-[1.02] transition-all font-mono"
            >
              <PhoneCall className="w-4 h-4 fill-slate-950" />
              INVESTIGATE LIVE SESSION
            </button>
          </div>
        </div>

        {/* CENTER COLUMN: LARGE INTERACTIVE MULTI-RING RISK ORB */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center">
          <AdvancedRiskOrb
            score={78}
            level="HIGH"
            threatType="AI IMPERSONATION"
            signals={{ voice: 0.87, speaker: 0.31, prosody: 0.68, context: 0.91 }}
          />
        </div>

        {/* RIGHT COLUMN: THREAT INTELLIGENCE SUMMARY (NO NUMBERS) */}
        <div className="lg:col-span-4 space-y-3 font-mono text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-slate-300 font-bold uppercase tracking-wider">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>THREAT INTELLIGENCE</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <span className="text-slate-400">Synthetic Voice</span>
              <span className="badge-high">HIGH (87%)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <span className="text-slate-400">Speaker Match</span>
              <span className="badge-critical">LOW (31%)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <span className="text-slate-400">Prosody Flux</span>
              <span className="badge-medium">HIGH (68%)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <span className="text-slate-400">Context Risk</span>
              <span className="badge-critical">CRITICAL (91%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. LIVE VOICE INTELLIGENCE PANEL */}
      <LiveIntelligencePanel
        isLive={true}
        snrDb={28.5}
        pitchF0={142.5}
        syntheticScore={0.87}
        speakerMatch={0.31}
      />

      {/* 4. ASYMMETRICAL BOTTOM ROW: WHY RISKY + SECURITY ACTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <WhyRiskyBlock />
        </div>

        <div className="lg:col-span-5">
          <PreventionPanel
            callId="CALL-042"
            riskScore={78}
            onActionExecuted={(action) => console.log('Action triggered:', action)}
          />
        </div>
      </div>

      {/* 5. VISUAL CALL MONITORING WALL */}
      <div className="space-y-4">
        <div className="flex items-center justify-between font-mono">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-cyan-400" />
            REAL-TIME CALL MONITORING WALL
          </h3>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
            ● 3 SESSIONS STREAMING
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {calls.map((call) => (
            <div
              key={call.call_id}
              onClick={() => onNavigate('live-call', call.call_id)}
              className={`glass-panel-command p-5 space-y-4 cursor-pointer hover:scale-[1.02] transition-all border-l-4 ${
                call.risk_level === 'CRITICAL' ? 'border-l-rose-500' :
                call.risk_level === 'HIGH' ? 'border-l-orange-500' :
                call.risk_level === 'MEDIUM' ? 'border-l-amber-500' : 'border-l-emerald-500'
              }`}
            >
              <div className="flex items-center justify-between font-mono">
                <div>
                  <span className="font-extrabold text-sm text-slate-100">{call.call_id}</span>
                  <span className="text-[10px] text-slate-500 block">● LIVE STREAM</span>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                  call.risk_level === 'CRITICAL' ? 'badge-critical' :
                  call.risk_level === 'HIGH' ? 'badge-high' :
                  call.risk_level === 'MEDIUM' ? 'badge-medium' : 'badge-low'
                }`}>
                  {call.risk_level}
                </span>
              </div>

              {/* Mini Animated Waveform Visual */}
              <div className="h-10 bg-slate-950/90 rounded-lg p-2 flex items-center justify-center border border-slate-800/80 overflow-hidden">
                <div className="flex items-center gap-1 w-full justify-between px-2">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-300 ${
                        call.risk_level === 'HIGH' || call.risk_level === 'CRITICAL'
                          ? 'bg-rose-500 animate-pulse'
                          : 'bg-cyan-400'
                      }`}
                      style={{
                        height: `${Math.max(15, Math.sin(i + call.final_risk_score) * 80 + 20)}%`
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 font-mono text-xs bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
                <div className="flex justify-between">
                  <span className="text-slate-400">Risk Score:</span>
                  <span className="font-extrabold text-slate-100">{call.final_risk_score.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Speaker Status:</span>
                  <span className={call.final_risk_score > 60 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {call.final_risk_score > 60 ? 'MISMATCH' : 'MATCHED'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Context:</span>
                  <span className="text-cyan-400 font-bold">
                    {call.final_risk_score > 60 ? 'FINANCIAL' : 'ROUTINE'}
                  </span>
                </div>
              </div>

              <button className="w-full py-2 bg-slate-800/80 hover:bg-cyan-500 hover:text-slate-950 font-mono text-xs font-bold uppercase rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-700/80">
                [ INVESTIGATE SESSION ] <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
