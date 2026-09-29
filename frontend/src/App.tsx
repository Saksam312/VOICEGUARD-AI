import React, { useState } from 'react';
import { TopCommandBar } from './components/TopCommandBar';
import { PremiumSidebar } from './components/PremiumSidebar';
import { DemoModeModal } from './components/DemoModeModal';

import { OverviewPage } from './pages/OverviewPage';
import { LiveCallPage } from './pages/LiveCallPage';
import { VoiceAnalysisPage } from './pages/VoiceAnalysisPage';
import { RiskTimelinePage } from './pages/RiskTimelinePage';
import { SpeakerVerificationPage } from './pages/SpeakerVerificationPage';
import { ContextIntelligencePage } from './pages/ContextIntelligencePage';
import { AttackLabPage } from './pages/AttackLabPage';
import { RobustnessLabPage } from './pages/RobustnessLabPage';
import { ModelEvaluationPage } from './pages/ModelEvaluationPage';
import { ModelRegistryPage } from './pages/ModelRegistryPage';
import { DriftMonitoringPage } from './pages/DriftMonitoringPage';
import { SecurityEventsPage } from './pages/SecurityEventsPage';
import { BlockchainAuditPage } from './pages/BlockchainAuditPage';
import { ApiDocsPage } from './pages/ApiDocsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { SettingsPage } from './pages/SettingsPage';
import { ForensicReportPage } from './pages/ForensicReportPage';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [activeDemoScenario, setActiveDemoScenario] = useState<string | undefined>(undefined);
  const [selectedCallId, setSelectedCallId] = useState<string>('CALL-042');

  const handleNavigate = (tab: string, callId?: string) => {
    setActiveTab(tab);
    if (callId) setSelectedCallId(callId);
  };

  const handleSelectScenario = (scenarioKey: string) => {
    setActiveDemoScenario(scenarioKey);
    setActiveTab('live-call');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100 font-sans cyber-grid-overlay selection:bg-cyan-500 selection:text-slate-950">
      <TopCommandBar
        onOpenDemo={() => setIsDemoModalOpen(true)}
        activeCallId={activeTab === 'live-call' ? selectedCallId : undefined}
        activeRiskLevel={activeTab === 'live-call' ? 'HIGH' : undefined}
      />

      <div className="flex flex-1 overflow-hidden">
        <PremiumSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950">
          {activeTab === 'overview' && <OverviewPage onNavigate={handleNavigate} />}
          {activeTab === 'live-call' && (
            <LiveCallPage
              activeDemoScenario={activeDemoScenario}
              onNavigateReport={(callId) => handleNavigate('report', callId)}
            />
          )}
          {activeTab === 'voice-analysis' && <VoiceAnalysisPage />}
          {activeTab === 'timeline' && <RiskTimelinePage selectedCallId={selectedCallId} />}
          {activeTab === 'speaker-verification' && <SpeakerVerificationPage />}
          {activeTab === 'context-intelligence' && <ContextIntelligencePage />}
          {activeTab === 'attack-lab' && <AttackLabPage />}
          {activeTab === 'robustness-lab' && <RobustnessLabPage />}
          {activeTab === 'model-evaluation' && <ModelEvaluationPage />}
          {activeTab === 'model-registry' && <ModelRegistryPage />}
          {activeTab === 'drift-monitoring' && <DriftMonitoringPage />}
          {activeTab === 'security-events' && <SecurityEventsPage onNavigateReport={(callId) => handleNavigate('report', callId)} />}
          {activeTab === 'blockchain-audit' && <BlockchainAuditPage />}
          {activeTab === 'api-docs' && <ApiDocsPage />}
          {activeTab === 'privacy' && <PrivacyPage />}
          {activeTab === 'settings' && <SettingsPage />}
          {activeTab === 'report' && (
            <ForensicReportPage
              callId={selectedCallId}
              onBack={() => setActiveTab('live-call')}
            />
          )}
        </main>
      </div>

      <DemoModeModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onSelectScenario={handleSelectScenario}
      />
    </div>
  );
}

export default App;
