import React, { useState } from 'react';
import { MOCK_GPU_WORKERS, MOCK_API_KEYS } from '../../data/mockData';
import { GPUWorker, APIKeyRecord } from '../../types';
import { Cpu, Key, DollarSign, Plus, Trash2, TrendingUp, X } from 'lucide-react';

interface SaaSDashboardProps {
  onClose: () => void;
}

export const SaaSDashboard: React.FC<SaaSDashboardProps> = ({ onClose }) => {
  const [workers, setWorkers] = useState<GPUWorker[]>(MOCK_GPU_WORKERS);
  const [apiKeys, setApiKeys] = useState<APIKeyRecord[]>(MOCK_API_KEYS);
  const [newKeyName, setNewKeyName] = useState('');
  const [justGeneratedKey, setJustGeneratedKey] = useState<string | null>(null);

  // Cost calculator state
  const [monthlyMinutes, setMonthlyMinutes] = useState<number>(100000); // 100k mins (~1,666 hours)

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const rawToken = "vk_live_" + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    const newKey: APIKeyRecord = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      prefix: rawToken.slice(0, 14) + "...88c",
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      usageMinutes: 0,
      active: true,
    };

    setApiKeys((prev) => [newKey, ...prev]);
    setJustGeneratedKey(rawToken);
    setNewKeyName('');
  };

  const handleRevokeKey = (id: string) => {
    setApiKeys((prev) => prev.map((k) => (k.id === id ? { ...k, active: false } : k)));
  };

  const handleAddWorker = () => {
    const newWorker: GPUWorker = {
      id: `worker-${Date.now()}`,
      name: `gpu-node-faster-whisper-0${workers.length + 1}`,
      gpuType: 'NVIDIA A10G (24GB)',
      status: 'Processing',
      currentLoad: 42,
      activeJobs: 6,
      modelLoaded: 'faster-whisper-large-v3 (FP16)',
      memoryUsedGb: 13.5,
      memoryTotalGb: 24.0,
    };
    setWorkers((prev) => [...prev, newWorker]);
  };

  // Cost calculations
  const deepgramCost = (monthlyMinutes * 0.0043).toFixed(2);
  const assemblyCost = (monthlyMinutes * 0.0063).toFixed(2);
  const ourApiCost = (monthlyMinutes * 0.0035).toFixed(2); // Our self-hosted optimization
  const savingsVsDeepgram = (parseFloat(deepgramCost) - parseFloat(ourApiCost)).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Cloud SaaS Dashboard & GPU Infrastructure</h2>
              <p className="text-xs text-slate-400">Manage SHA256 API keys, scale RunPod/Modal GPU workers, and inspect pricing.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Part 1: Cost Undercut Calculator */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-950 to-emerald-950/40 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" /> Live Cost Undercut Calculator (Self-Hosted GPU vs Commercial APIs)
                </h3>
                <p className="text-xs text-slate-400">Calculate how much you save by running faster-whisper on our self-hosted architecture.</p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 whitespace-nowrap">
                Save ~20% vs Deepgram
              </span>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                <span>Monthly Audio Processing Volume:</span>
                <span className="font-mono text-cyan-400 font-bold">{monthlyMinutes.toLocaleString()} Minutes (~{(monthlyMinutes / 60).toFixed(0)} Hours)</span>
              </div>
              <input
                type="range"
                min="10000"
                max="1000000"
                step="10000"
                value={monthlyMinutes}
                onChange={(e) => setMonthlyMinutes(parseInt(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs text-slate-400">AssemblyAI Universal-2 ($0.0063/min)</div>
                <div className="text-xl font-bold font-mono text-slate-300 mt-1">${assemblyCost}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs text-slate-400">Deepgram Nova-3 ($0.0043/min)</div>
                <div className="text-xl font-bold font-mono text-slate-300 mt-1">${deepgramCost}</div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 shadow-lg shadow-emerald-500/5">
                <div className="text-xs text-emerald-400 font-semibold">Your VocalizeAI Stack ($0.0035/min)</div>
                <div className="text-2xl font-extrabold font-mono text-emerald-300 mt-1">${ourApiCost}</div>
                <div className="text-[11px] text-emerald-400 font-mono mt-1 font-semibold">
                  🎉 Save ${savingsVsDeepgram} / month!
                </div>
              </div>
            </div>
          </div>

          {/* Part 2: GPU Worker Infrastructure */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-cyan-400" /> GPU Worker Pool (NVIDIA RunPod / Modal Instances)
                </h3>
                <p className="text-xs text-slate-400">Real-time inference nodes handling bi-directional WebSocket audio buffers.</p>
              </div>
              <button
                onClick={handleAddWorker}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Scale Pool (+1 A10G Node)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workers.map((w) => (
                <div key={w.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-white font-mono">{w.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {w.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono">{w.gpuType} • {w.modelLoaded}</div>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>GPU Compute Load ({w.currentLoad}%)</span>
                        <span className="font-mono text-cyan-400">{w.activeJobs} Active Streams</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${w.currentLoad}%` }} />
                      </div>
                    </div>

                    <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-900">
                      <span>VRAM: {w.memoryUsedGb}GB / {w.memoryTotalGb}GB</span>
                      <span>CTranslate2 FP16</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Part 3: API Keys Management */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-400" /> API Keys & SHA256 Verification System
            </h3>

            {/* Create Form */}
            <form onSubmit={handleCreateKey} className="flex gap-3">
              <input
                type="text"
                placeholder="Key Description (e.g. Production Twilio Voice Agent)..."
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="submit"
                disabled={!newKeyName.trim()}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition shadow disabled:opacity-50"
              >
                Generate API Key
              </button>
            </form>

            {justGeneratedKey && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-amber-300">New Secret Key Generated (Only shown once! Store securely):</div>
                  <div className="font-mono text-white mt-1 select-all">{justGeneratedKey}</div>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(justGeneratedKey)}
                  className="px-3 py-1.5 rounded bg-amber-500 text-black font-bold transition"
                >
                  Copy Secret
                </button>
              </div>
            )}

            {/* Keys Table */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="p-3.5">Key Name</th>
                    <th className="p-3.5 font-mono">Token Prefix</th>
                    <th className="p-3.5">Usage Volume</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {apiKeys.map((k) => (
                    <tr key={k.id} className="hover:bg-slate-900/40 transition">
                      <td className="p-3.5 font-bold text-white">{k.name}</td>
                      <td className="p-3.5 font-mono text-slate-400">{k.prefix}</td>
                      <td className="p-3.5 font-mono">{k.usageMinutes.toLocaleString()} mins</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            k.active
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-500/15 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {k.active ? 'Active' : 'Revoked'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        {k.active && (
                          <button
                            onClick={() => handleRevokeKey(k.id)}
                            className="text-red-400 hover:text-red-300 transition"
                            title="Revoke Key"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
          >
            Close SaaS Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};
