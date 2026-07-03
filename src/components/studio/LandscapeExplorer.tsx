import React, { useState } from 'react';
import { VOICE_LANDSCAPE_TOOLS } from '../../data/mockData';
import { Search, Filter, Star, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

export const LandscapeExplorer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Fine-tuning lab states
  const [domainType, setDomainType] = useState('Medical Terminology & Pharmacology');
  const [datasetHours, setDatasetHours] = useState(50);
  const [useLora, setUseLora] = useState(true);

  const categories = [
    'All',
    'ASR Open Source',
    'ASR Commercial',
    'TTS Open Source',
    'TTS Commercial',
    'VAD & Diarization',
    'Agent Frameworks',
    'Telephony & Transport'
  ];

  const filteredTools = VOICE_LANDSCAPE_TOOLS.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.bestFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.notes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Calculate estimated WER reduction from fine-tuning
  const baseWer = domainType.includes('Medical') ? 8.4 : domainType.includes('Legal') ? 7.2 : 6.8;
  const reducedWer = Math.max(1.8, (baseWer - (datasetHours / 25) * (useLora ? 1.4 : 1.1))).toFixed(1);

  return (
    <div className="space-y-8">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
              Part 1 Complete Landscape & Direction #6
            </span>
            <span className="text-xs text-slate-400 font-mono">2024–2025 Comprehensive Matrix</span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1.5 flex items-center gap-2">
            The Complete Voice AI Tool Matrix & Whisper Fine-Tuning Lab
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Explore every open-source and commercial tool shaping modern voice intelligence. Filter across ASR leaderboards, TTS engines, and real-time orchestration frameworks.
          </p>
        </div>
      </div>

      {/* Part 1: Interactive Search & Category Bar */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tools, CTranslate2, Pipecat, cloning, Raspberry Pi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
            <Filter className="w-4 h-4 text-cyan-400" />
            <span>Showing {filteredTools.length} of {VOICE_LANDSCAPE_TOOLS.length} Tools</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-black shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tool Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 hover:border-slate-700 flex flex-col justify-between transition shadow-lg hover:shadow-cyan-500/5"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono font-bold">
                  {tool.category}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    tool.type === 'Open Source'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                  }`}
                >
                  {tool.type}
                </span>
              </div>

              <h3 className="font-bold text-white text-base flex items-center justify-between mt-1">
                <span>{tool.name}</span>
                {tool.stars && (
                  <span className="text-xs font-mono text-amber-400 font-normal flex items-center gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-current" /> {tool.stars}
                  </span>
                )}
              </h3>

              <div className="mt-2 text-xs text-cyan-300 font-medium">
                Best for: <span className="text-slate-200">{tool.bestFor}</span>
              </div>

              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{tool.notes}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              {tool.latencyMs ? (
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <Zap className="w-3 h-3" /> ~{tool.latencyMs}ms Latency
                </span>
              ) : (
                <span className="text-slate-500">Pipeline Module</span>
              )}

              {tool.pricing && (
                <span className="bg-slate-950 px-2 py-0.5 rounded text-amber-400 border border-slate-800">
                  {tool.pricing}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Direction #6: Whisper Domain Fine-Tuning Lab */}
      <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4 gap-2">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" /> Direction #6: Domain-Specific Whisper Fine-Tuning Lab
            </h3>
            <p className="text-xs text-slate-400">Simulate LoRA PEFT (Parameter-Efficient Fine-Tuning) to drastically reduce Word Error Rate (WER) on specialized vocabulary.</p>
          </div>
          <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
            HuggingFace Transformers + LoRA
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Controls */}
          <div className="space-y-4 bg-slate-950/60 p-5 rounded-xl border border-slate-800">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Target Audio Domain:</label>
              <select
                value={domainType}
                onChange={(e) => setDomainType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="Medical Terminology & Pharmacology">Medical Terminology & Pharmacology (High Jargon)</option>
                <option value="Legal Courtroom Dictation">Legal Courtroom Depositions & Case Law</option>
                <option value="Call Center Customer Service (Accents & Noise)">Noisy Call Center Recordings (Strong Accents)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Domain Training Dataset Size:</span>
                <span className="font-mono text-purple-400">{datasetHours} Hours labeled audio</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                step="10"
                value={datasetHours}
                onChange={(e) => setDatasetHours(parseInt(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-300 font-medium">Fine-Tuning Method:</span>
              <button
                onClick={() => setUseLora(!useLora)}
                className={`px-3 py-1 rounded text-xs font-mono font-bold border transition ${
                  useLora
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {useLora ? 'LoRA Rank r=32 (Fast & Robust)' : 'Full Weight Fine-Tuning'}
              </button>
            </div>
          </div>

          {/* Benchmark Results Display */}
          <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-white mb-3">Predicted Evaluation Benchmarks (jiwer WER)</h4>
              <div className="space-y-3">
                
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Baseline Whisper (Zero-Shot on {domainType.split(' ')[0]}):</span>
                    <span className="font-mono text-red-400 font-bold">{baseWer}% WER</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: `${(baseWer / 10) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Deepgram Nova-3 API Benchmark:</span>
                    <span className="font-mono text-amber-400 font-bold">4.2% WER</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: `42%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-emerald-400 font-semibold">Your Custom Fine-Tuned faster-whisper Model:</span>
                    <span className="font-mono text-emerald-400 font-extrabold text-sm">{reducedWer}% WER</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full" style={{ width: `${(parseFloat(reducedWer) / 10) * 100}%` }} />
                  </div>
                </div>

              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                By training with {datasetHours} hours of {domainType.split(' ')[0]} data via LoRA, you beat generic commercial APIs by ~2.4% WER!
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
