import React from 'react';
import { FileCode, ExternalLink, Code } from 'lucide-react';

export const ApiDocsPage: React.FC = () => {
  const endpoints = [
    { method: 'POST', path: '/api/v1/analyze-audio', desc: 'Analyzes uploaded audio file for voice cloning, synthetic speech, and acoustic anomalies.' },
    { method: 'POST', path: '/api/v1/analyze-chunk', desc: 'Analyzes base64 audio chunk in sliding window.' },
    { method: 'POST', path: '/api/v1/call/start', desc: 'Initializes new call monitoring session.' },
    { method: 'POST', path: '/api/v1/call/end/{call_id}', desc: 'Terminates active call monitoring session.' },
    { method: 'GET', path: '/api/v1/call/{call_id}/timeline', desc: 'Fetches dynamic call risk timeline.' },
    { method: 'POST', path: '/api/v1/speaker/register', desc: 'Enrolls executive voiceprint embedding vector.' },
    { method: 'POST', path: '/api/v1/speaker/verify', desc: 'Verifies audio sample against registered speaker profile.' },
    { method: 'GET', path: '/api/v1/security-events', desc: 'Fetches SOC security incident log.' },
    { method: 'GET', path: '/api/v1/audit/verify-chain', desc: 'Verifies SHA-256 blockchain audit ledger integrity.' },
    { method: 'WS', path: '/ws/live-call/{call_id}', desc: 'Real-time 16kHz PCM audio streaming WebSocket endpoint.' }
  ];

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 border-l-4 border-l-cyan-500 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-cyan-400" />
            API Documentation & Integration Specification
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            OpenAPI / Swagger REST & WebSocket endpoints for telecom, VoIP, enterprise communication, and banking integrations.
          </p>
        </div>
        <a
          href="/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs font-semibold rounded border border-cyan-500/30 flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          SWAGGER UI
        </a>
      </div>

      <div className="glass-panel p-5 space-y-3">
        <h3 className="text-sm font-mono font-bold uppercase text-slate-200">AVAILABLE ENDPOINTS</h3>
        <div className="space-y-2 font-mono text-xs">
          {endpoints.map((ep, idx) => (
            <div key={idx} className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                  ep.method === 'WS' ? 'bg-purple-950 text-purple-400 border border-purple-500/40' :
                  ep.method === 'POST' ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/40' :
                  'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                }`}>
                  {ep.method}
                </span>
                <span className="font-bold text-slate-200">{ep.path}</span>
              </div>
              <p className="text-slate-400 text-[11px] font-sans">{ep.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
