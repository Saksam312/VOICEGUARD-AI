import React, { useEffect, useState } from 'react';
import { UserCheck, Plus, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { SpeakerProfile } from '../types';
import { fetchSpeakerProfiles } from '../services/api';

export const SpeakerVerificationPage: React.FC = () => {
  const [profiles, setProfiles] = useState<SpeakerProfile[]>([]);

  useEffect(() => {
    fetchSpeakerProfiles().then(setProfiles);
  }, []);

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 border-l-4 border-l-cyan-500">
        <h2 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-cyan-400" />
          Speaker Voiceprint Verification & Profile Enrollment
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Register executive voiceprints and compare current speaker embedding feature vectors against enrolled speaker profiles using cosine similarity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profiles.map((p) => (
          <div key={p.speaker_id} className="glass-panel p-5 space-y-3 border-l-4 border-l-emerald-500">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{p.speaker_id}</span>
                <h3 className="text-base font-bold text-slate-100">{p.name}</h3>
                <p className="text-xs text-slate-400">{p.role_or_title || 'Executive'}</p>
              </div>
              <span className="badge-low">ENROLLED</span>
            </div>

            <div className="p-3 bg-slate-950/70 rounded border border-slate-800 space-y-1 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Sample Count:</span>
                <span className="text-slate-200">{p.sample_count} audio files</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Vector Dimension:</span>
                <span className="text-cyan-400">23-dim MFCC + Pitch F0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Similarity Threshold:</span>
                <span className="text-emerald-400">70.0% Cosine Match</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              * Note: Voice matching provides speaker consistency checking. System does not rely on voice alone for absolute identity verification.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
