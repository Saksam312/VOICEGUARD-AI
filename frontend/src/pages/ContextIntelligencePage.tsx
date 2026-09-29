import React, { useState } from 'react';
import { MessageSquareText, ShieldAlert, AlertTriangle, CheckCircle, Search } from 'lucide-react';

export const ContextIntelligencePage: React.FC = () => {
  const [transcript, setTranscript] = useState<string>(
    "Hello, this is Dr. Rajesh Kumar. I need you to immediately execute a wire transfer of ₹10 Lakh to our vendor account right away."
  );
  const [analysis, setAnalysis] = useState<any>({
    risk_score: 85.0,
    sensitive_intent: "FINANCIAL_TRANSACTION",
    triggers: ["wire transfer", "₹10 Lakh", "immediately"],
    recommendation: "Potentially high-risk request detected. Verify independently before executing wire transfer."
  });

  const handleTestText = () => {
    const textLower = transcript.toLowerCase();
    let score = 0.0;
    let intent = "NORMAL_CONVERSATION";
    let triggers = [];

    if (textLower.includes("transfer") || textLower.includes("lakh") || textLower.includes("money") || textLower.includes("pay")) {
      score += 85.0;
      intent = "FINANCIAL_TRANSACTION";
      triggers.push("transfer", "₹10 Lakh", "financial demand");
    }
    if (textLower.includes("otp") || textLower.includes("pin") || textLower.includes("password")) {
      score += 90.0;
      intent = "CREDENTIAL_REQUEST";
      triggers.push("OTP / Password request");
    }

    setAnalysis({
      risk_score: score || 10.0,
      sensitive_intent: intent,
      triggers: triggers.length ? triggers : ["None"],
      recommendation: score > 50 ? "Potentially high-risk request detected. Verify independently." : "Conversation text within normal operational limits."
    });
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 border-l-4 border-l-cyan-500">
        <h2 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
          <MessageSquareText className="w-5 h-5 text-cyan-400" />
          Context / Social Engineering Risk Intelligence
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Analyzes Speech-to-Text (STT) transcripts to flag sensitive request intents such as financial wire transfers, OTP requests, credential demands, and emergency coercion.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-5 space-y-4">
          <h3 className="text-sm font-mono font-bold uppercase text-slate-200">TRANSCRIPT TEXT INPUT</h3>
          <textarea
            rows={5}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="w-full bg-slate-950 text-xs text-slate-100 p-3 rounded-lg border border-slate-800 focus:border-cyan-500 focus:outline-none font-mono"
          />
          <button
            onClick={handleTestText}
            className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs uppercase rounded flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            ANALYZE CONTEXT INTENT
          </button>
        </div>

        <div className="glass-panel p-5 space-y-4">
          <h3 className="text-sm font-mono font-bold uppercase text-slate-200">INTENT ANALYSIS OUTPUT</h3>

          <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Context Risk Score:</span>
              <span className="font-bold text-rose-400">{analysis.risk_score.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Detected Sensitive Intent:</span>
              <span className="font-bold text-cyan-400">{analysis.sensitive_intent}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Trigger Keywords:</span>
              <span className="text-amber-400">{analysis.triggers.join(', ')}</span>
            </div>
          </div>

          <div className="p-3 bg-amber-950/30 rounded border border-amber-500/40 text-xs space-y-1">
            <span className="font-bold text-amber-400 font-mono">SOC GUIDANCE:</span>
            <p className="text-slate-200">{analysis.recommendation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
