import React from 'react';
import { Mic, Activity, Volume2, Bot, Cpu, Layers, DollarSign, FileCode } from 'lucide-react';

export type ActiveTab = 'streaming' | 'batch' | 'tts' | 'agents' | 'architecture' | 'landscape' | 'manifests';

import { useApiSettings } from '../context/ApiSettingsContext';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenDashboard: () => void;
  onOpenFrontierModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenDashboard, onOpenFrontierModal }) => {
  const { activeProviderName } = useApiSettings();
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'streaming', label: 'Real-Time Streaming ASR', icon: <Mic className="w-4 h-4" />, badge: 'WebSocket' },
    { id: 'batch', label: 'Deepgram Batch Clone', icon: <Activity className="w-4 h-4" />, badge: 'Diarization' },
    { id: 'tts', label: 'TTS & Voice Cloning', icon: <Volume2 className="w-4 h-4" />, badge: 'Cartesia 90ms' },
    { id: 'agents', label: 'Voice Agent Pipeline', icon: <Bot className="w-4 h-4" />, badge: 'Pipecat' },
    { id: 'architecture', label: 'Backend Architecture & Code', icon: <Cpu className="w-4 h-4" />, badge: 'FastAPI + GPU' },
    { id: 'landscape', label: 'Voice AI Landscape 2025', icon: <Layers className="w-4 h-4" />, badge: '50+ Tools' },
    { id: 'manifests', label: 'API & Deployment Manifests', icon: <FileCode className="w-4 h-4" />, badge: 'OpenAPI / K8s' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('streaming')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-500 shadow-lg shadow-cyan-500/20">
              <Mic className="w-5 h-5 text-white animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                  VocalizeAI Studio
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  v3.4 Enterprise
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                Deepgram Clone & Complete Voice AI Cloud
              </p>
            </div>
          </div>

          {/* Telemetry Bar & SaaS Dashboard Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-3 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>4x GPU Cluster Active</span>
              </div>
              <span className="text-slate-700">|</span>
              <div className="text-slate-300 font-mono">
                P50 Latency: <span className="text-cyan-400 font-semibold">135ms</span>
              </div>
              <span className="text-slate-700">|</span>
              <div className="text-slate-300 font-mono">
                ASR Cost: <span className="text-amber-400 font-semibold">$0.0040/min</span>
              </div>
            </div>

            <button
              onClick={onOpenFrontierModal}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-medium text-xs transition shadow-md"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>⚡ Engine: {activeProviderName.split(' ')[0]} (Configure)</span>
            </button>

            <button
              onClick={onOpenDashboard}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium text-xs transition shadow-md hover:shadow-cyan-500/25"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>SaaS Billing & Pool</span>
            </button>
          </div>
        </div>

        {/* Studio Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none border-t border-slate-900 pt-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <span className={isActive ? 'text-cyan-400' : 'text-slate-500'}>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
