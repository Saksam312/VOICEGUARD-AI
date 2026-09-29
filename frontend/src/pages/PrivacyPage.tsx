import React, { useEffect, useState } from 'react';
import { Lock, Shield, Trash2, CheckCircle } from 'lucide-react';
import { PrivacySettings } from '../types';
import { fetchPrivacySettings, updatePrivacySettings } from '../services/api';

export const PrivacyPage: React.FC = () => {
  const [settings, setSettings] = useState<PrivacySettings>({
    audio_retention_minutes: 0,
    store_raw_audio: false,
    store_feature_data: true,
    anonymize_metadata: true,
    audit_logging_enabled: true
  });
  const [msg, setMsg] = useState<string>('');

  useEffect(() => {
    fetchPrivacySettings().then(setSettings);
  }, []);

  const handleSave = async () => {
    try {
      const res = await updatePrivacySettings(settings);
      setSettings(res);
      setMsg('Privacy policy configuration saved successfully.');
      setTimeout(() => setMsg(''), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePurge = async () => {
    if (confirm('Are you sure you want to purge all historical call logs and temporary audio buffers?')) {
      await fetch('/api/v1/privacy/purge-data', { method: 'POST' });
      setMsg('All historical audio data purged successfully.');
      setTimeout(() => setMsg(''), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 border-l-4 border-l-cyan-500">
        <h2 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
          <Lock className="w-5 h-5 text-cyan-400" />
          Privacy & Data Security Controls
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Zero-raw-audio retention policy by default. VOICEGUARD AI processes audio in memory and minimizes stored metadata.
        </p>
      </div>

      <div className="glass-panel p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
            <div>
              <span className="text-xs font-mono font-bold text-slate-200">Zero Raw Audio Storage Policy</span>
              <p className="text-[11px] text-slate-400">Do not store raw call audio files permanently on disk or database.</p>
            </div>
            <input
              type="checkbox"
              checked={!settings.store_raw_audio}
              onChange={(e) => setSettings({ ...settings, store_raw_audio: !e.target.checked })}
              className="w-4 h-4 accent-cyan-500 rounded"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
            <div>
              <span className="text-xs font-mono font-bold text-slate-200">Audio Retention Window (Minutes)</span>
              <p className="text-[11px] text-slate-400">Time to hold temporary in-memory audio buffer (0 = immediate purge).</p>
            </div>
            <select
              value={settings.audio_retention_minutes}
              onChange={(e) => setSettings({ ...settings, audio_retention_minutes: parseInt(e.target.value) })}
              className="bg-slate-900 text-xs font-mono text-cyan-300 p-2 rounded border border-slate-700"
            >
              <option value={0}>0 Minutes (Zero Retention)</option>
              <option value={5}>5 Minutes</option>
              <option value={15}>15 Minutes</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
            <div>
              <span className="text-xs font-mono font-bold text-slate-200">Metadata Anonymization</span>
              <p className="text-[11px] text-slate-400">Sanitize caller phone numbers and identity metadata in logs.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.anonymize_metadata}
              onChange={(e) => setSettings({ ...settings, anonymize_metadata: e.target.checked })}
              className="w-4 h-4 accent-cyan-500 rounded"
            />
          </div>
        </div>

        {msg && (
          <div className="p-3 bg-emerald-950/40 rounded border border-emerald-500/40 text-xs text-emerald-400 font-mono">
            {msg}
          </div>
        )}

        <div className="flex items-center gap-4 pt-2 border-t border-slate-800">
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs uppercase rounded"
          >
            SAVE PRIVACY CONFIGURATION
          </button>

          <button
            onClick={handlePurge}
            className="px-4 py-2 bg-rose-950 text-rose-400 border border-rose-500/40 hover:bg-rose-900 font-bold text-xs uppercase rounded flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            PURGE ALL CALL DATA
          </button>
        </div>
      </div>
    </div>
  );
};
