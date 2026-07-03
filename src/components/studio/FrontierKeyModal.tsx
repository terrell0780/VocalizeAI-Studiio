import React from 'react';
import { useApiSettings } from '../../context/ApiSettingsContext';
import { Key, X, Radio } from 'lucide-react';

interface FrontierKeyModalProps {
  onClose: () => void;
}

export const FrontierKeyModal: React.FC<FrontierKeyModalProps> = ({ onClose }) => {
  const { keys, updateKey } = useApiSettings();

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Frontier SaaS Mode — Live API & Engine Configuration</h2>
              <p className="text-xs text-slate-400">All studios execute real audio processing and live inference without mock simulations.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 flex items-start gap-2.5">
            <Radio className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Real Native Execution Enabled:</span> Even if you leave API keys blank, VocalizeAI Studio uses your browser's real <strong>Web Speech Recognition API</strong>, <strong>AudioContext Linear PCM Buffers</strong>, and <strong>Web Speech Synthesis Engine</strong> to process live audio in real time!
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Groq API Key (Ultra-Fast Whisper-large-v3 & Llama 3):</label>
              <input
                type="password"
                placeholder="gsk_..."
                value={keys.groqKey}
                onChange={(e) => updateKey('groqKey', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
              />
              <span className="text-[11px] text-slate-500 mt-0.5 block">Powers sub-100ms real audio transcription via Groq LPU cluster.</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">OpenAI API Key (Whisper API & GPT-4o / Realtime):</label>
              <input
                type="password"
                placeholder="sk-..."
                value={keys.openAiKey}
                onChange={(e) => updateKey('openAiKey', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Deepgram API Key (Nova-3 Cloud API):</label>
              <input
                type="password"
                placeholder="Token ..."
                value={keys.deepgramKey}
                onChange={(e) => updateKey('deepgramKey', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Self-Hosted / Local FastAPI WebSocket URL:</label>
              <input
                type="text"
                value={keys.localServerUrl}
                onChange={(e) => updateKey('localServerUrl', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
              />
            </div>

            <label className="flex items-center space-x-2 pt-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={keys.useNativeBrowserFallback}
                onChange={(e) => updateKey('useNativeBrowserFallback', e.target.checked)}
                className="rounded bg-slate-950 border-slate-800 text-cyan-500"
              />
              <span>Auto-fallback to Native Web Speech Recognition & Synthesis when no cloud key is provided</span>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition shadow-lg"
          >
            Save & Execute Frontier Mode
          </button>
        </div>
      </div>
    </div>
  );
};
