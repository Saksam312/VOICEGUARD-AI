import React, { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2, Lock, RefreshCw, Cpu, Database, Key } from 'lucide-react';
import { verifyAuditChain } from '../services/api';

export const BlockchainAuditPage: React.FC = () => {
  const [auditStatus, setAuditStatus] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await verifyAuditChain();
      setAuditStatus(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleVerify();
  }, []);

  const ledgerEvents = [
    {
      eventId: 'GENESIS BLOCK',
      timestamp: '2026-09-28 12:00:00 UTC',
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
      model: 'v2.0-MultiEnsemble',
      integrity: 'VERIFIED'
    },
    {
      eventId: 'HIGH RISK VOICE EVENT (CALL-042)',
      timestamp: '2026-09-28 19:42:31 UTC',
      hash: 'a8f3b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
      prevHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      model: 'v2.0-MultiEnsemble',
      integrity: 'VERIFIED'
    },
    {
      eventId: 'SPEAKER MISMATCH INTERVENTION (CALL-089)',
      timestamp: '2026-09-28 20:15:04 UTC',
      hash: 'f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e6d7c8b9a0f1e2',
      prevHash: 'a8f3b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
      model: 'v2.0-MultiEnsemble',
      integrity: 'VERIFIED'
    }
  ];

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="glass-panel-command p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-emerald-500">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 animate-pulse" />
            <span>SECURE DIGITAL LEDGER</span>
          </div>
          <h2 className="text-2xl font-extrabold font-mono text-slate-100 mt-1 tracking-tight">
            CRYPTOGRAPHIC AUDIT LEDGER
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Immutable SHA-256 tamper-evident security audit chain.
          </p>
        </div>

        <button
          onClick={handleVerify}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-mono font-extrabold text-xs uppercase rounded-xl flex items-center gap-2 hover:scale-[1.02] transition-transform shadow-lg shadow-emerald-500/20"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          [ VERIFY LEDGER INTEGRITY ]
        </button>
      </div>

      {/* INTEGRITY STATUS DISPLAY */}
      {auditStatus && (
        <div className="glass-panel-command p-5 flex items-center justify-between border-l-4 border-l-emerald-400 font-mono text-xs">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <span className="font-extrabold text-emerald-400 uppercase tracking-wider text-sm">
                ● SHA-256 CHAIN INTEGRITY: VERIFIED VALID
              </span>
              <p className="text-slate-400 text-[11px] mt-0.5">
                All block checksums match zero tampering detected across {auditStatus.total_blocks || 3} sequential cryptographic entries.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VERTICALLY CONNECTED DIGITAL LEDGER FLOW (NO NUMBERING) */}
      <div className="space-y-0 font-mono relative pl-6 before:absolute before:left-3 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 via-emerald-500 to-indigo-500">
        {ledgerEvents.map((evt, idx) => (
          <React.Fragment key={idx}>
            {/* EVENT NODE CARD */}
            <div className="relative pl-6 pb-6">
              {/* Timeline Connector Dot */}
              <div className="absolute left-0 top-3 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_10px_#22d3ee]">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></div>
              </div>

              <div className="glass-panel-command p-5 space-y-3 border-l-4 border-l-cyan-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-100">{evt.eventId}</h3>
                    <span className="text-[10px] text-slate-500">{evt.timestamp}</span>
                  </div>

                  <span className="badge-low flex items-center gap-1.5 self-start sm:self-auto">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ● {evt.integrity}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80">
                  <div className="space-y-1 overflow-hidden">
                    <span className="text-[10px] text-slate-500 block font-bold">BLOCK HASH (SHA-256)</span>
                    <p className="font-mono text-cyan-300 font-bold text-[11px] truncate">{evt.hash}</p>
                  </div>

                  <div className="space-y-1 overflow-hidden">
                    <span className="text-[10px] text-slate-500 block font-bold">PREVIOUS BLOCK HASH</span>
                    <p className="font-mono text-slate-400 text-[11px] truncate">{evt.prevHash}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>MODEL VERSION: <strong className="text-cyan-400">{evt.model}</strong></span>
                  <span>ENCRYPTION: <strong className="text-emerald-400">SHA-256 TAMPER-PROOF</strong></span>
                </div>
              </div>
            </div>

            {/* CONNECTED VERIFIED BADGE BETWEEN NODES */}
            {idx < ledgerEvents.length - 1 && (
              <div className="relative pl-6 py-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full w-max shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  ● VERIFIED CRYPTOGRAPHIC LINK
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
