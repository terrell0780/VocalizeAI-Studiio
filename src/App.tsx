import { useState } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { LiveStreamingStudio } from './components/studio/LiveStreamingStudio';
import { BatchTranscriptionStudio } from './components/studio/BatchTranscriptionStudio';
import { TtsVoiceCloningStudio } from './components/studio/TtsVoiceCloningStudio';
import { VoiceAgentOrchestrator } from './components/studio/VoiceAgentOrchestrator';
import { ArchitectureAndCodeHub } from './components/studio/ArchitectureAndCodeHub';
import { LandscapeExplorer } from './components/studio/LandscapeExplorer';
import { ApiManifestStudio } from './components/studio/ApiManifestStudio';
import { SaaSDashboard } from './components/studio/SaaSDashboard';
import { FrontierKeyModal } from './components/studio/FrontierKeyModal';
import { ApiSettingsProvider } from './context/ApiSettingsContext';
import { Terminal, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('streaming');
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isFrontierModalOpen, setIsFrontierModalOpen] = useState(false);

  return (
    <ApiSettingsProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
        
        {/* Navigation */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenDashboard={() => setIsDashboardOpen(true)}
          onOpenFrontierModal={() => setIsFrontierModalOpen(true)}
        />

      {/* Hero Notice / Quick Studio Selector Bar */}
      <div className="bg-slate-900/60 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between text-xs gap-2">
          <div className="flex items-center space-x-2 text-slate-300">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
              <Sparkles className="w-3.5 h-3.5" /> All 6 Directions Built
            </span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="text-slate-400">
              Interactive Deepgram Clone + Complete Voice AI Ecosystem Studio (2024–2025)
            </span>
          </div>

          <div className="flex items-center space-x-4 text-slate-400 font-mono text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> SHA256 Auth Active
            </span>
            <span className="flex items-center gap-1 text-cyan-400">
              <Zap className="w-3.5 h-3.5" /> CTranslate2 GPU FP16
            </span>
          </div>
        </div>
      </div>

      {/* Main Studio Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'streaming' && <LiveStreamingStudio />}
        {activeTab === 'batch' && <BatchTranscriptionStudio />}
        {activeTab === 'tts' && <TtsVoiceCloningStudio />}
        {activeTab === 'agents' && <VoiceAgentOrchestrator />}
        {activeTab === 'architecture' && <ArchitectureAndCodeHub />}
        {activeTab === 'landscape' && <LandscapeExplorer />}
        {activeTab === 'manifests' && <ApiManifestStudio />}
      </main>

      {/* SaaS Dashboard Modal */}
      {isDashboardOpen && <SaaSDashboard onClose={() => setIsDashboardOpen(false)} />}
      {isFrontierModalOpen && <FrontierKeyModal onClose={() => setIsFrontierModalOpen(false)} />}

      {/* Footer */}
      <footer className="bg-slate-900/80 border-t border-slate-800/80 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 font-bold text-white text-sm">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>VocalizeAI Studio</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Open-source architecture demonstration combining faster-whisper, Silero VAD, pyannote speaker diarization, and Pipecat voice agent orchestration into a cohesive enterprise cloud.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Tech Stack Core</h4>
            <ul className="space-y-2 text-slate-400 font-mono">
              <li>faster-whisper (CTranslate2)</li>
              <li>Silero VAD (ONNX Runtime)</li>
              <li>pyannote/speaker-diarization-3.1</li>
              <li>Pipecat Python Framework</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">API Compatibilities</h4>
            <ul className="space-y-2 text-slate-400 font-mono">
              <li>POST /v1/listen (REST Batch)</li>
              <li>WS /v1/listen (Streaming)</li>
              <li>POST /v1/synthesize (Cartesia TTS)</li>
              <li>Twilio Media Streams TwiML</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">SaaS Optimization</h4>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between font-mono">
                <span className="text-slate-400">Deepgram Rate:</span>
                <span className="text-red-400">$0.0043/min</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-emerald-400 font-bold">VocalizeAI Rate:</span>
                <span className="text-emerald-400 font-bold">$0.0035/min</span>
              </div>
              <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                Self-hosted on NVIDIA A10G RunPod instances with Redis job queuing.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900 py-4 bg-slate-950/50 text-center text-[11px] text-slate-500 font-mono">
          © 2025 VocalizeAI / PulseVoice Cloud Studio — All 6 Architectural Directions Integrated
        </div>
      </footer>

      </div>
    </ApiSettingsProvider>
  );
}

export default App;
