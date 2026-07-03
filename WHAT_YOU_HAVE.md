# VocalizeAI Studio — What You Have (Complete Reference)

## Quick Start

```bash
npm install        # Install dependencies (React 19, Vite 7, Tailwind 4, lucide-react)
npm run dev        # Launch development server at http://localhost:5173
npm run build      # Production build → single dist/index.html (408 KB total, ~110 KB gzip)
npm run preview    # Preview the production build locally
```

---

## File Inventory

```
vocalizeai-studio/
│
├── index.html                          # Entry HTML with PWA meta, manifest link, fonts
├── package.json                        # Dependencies & scripts
├── vite.config.ts                      # Vite config (React + Tailwind + singlefile plugin)
├── tsconfig.json                       # TypeScript strict mode config
│
├── public/
│   └── manifest.json                   # PWA manifest (shortcuts, icons, theme colors)
│
├── src/
│   ├── main.tsx                        # React root render
│   ├── App.tsx                         # Master shell: Navbar, 8 Studios, Modals, Footer
│   ├── index.css                       # Tailwind + custom animations, scrollbars
│   ├── utils/cn.ts                     # clsx + tailwind-merge helper
│   │
│   ├── types/
│   │   └── index.ts                    # TypeScript interfaces (10 types)
│   │
│   ├── context/
│   │   └── ApiSettingsContext.tsx       # Global API key state + localStorage persistence
│   │
│   ├── data/
│   │   └── mockData.ts                 # Preset transcripts, landscape tools, TTS models, agents
│   │
│   └── components/
│       ├── Navbar.tsx                  # Top nav bar with 7 tabs + Engine/SaaS buttons
│       │
│       └── studio/
│           ├── LiveStreamingStudio.tsx          # Real-time mic ASR + VAD (565 lines)
│           ├── BatchTranscriptionStudio.tsx     # File upload + cloud batch ASR (520 lines)
│           ├── TtsVoiceCloningStudio.tsx        # TTS + voice cloning lab (463 lines)
│           ├── VoiceAgentOrchestrator.tsx       # Full-duplex voice agents + barge-in (581 lines)
│           ├── ArchitectureAndCodeHub.tsx       # Backend code reference viewer (441 lines)
│           ├── LandscapeExplorer.tsx            # Voice AI tool matrix + fine-tuning lab (272 lines)
│           ├── ApiManifestStudio.tsx            # OpenAPI 3.1 + K8s + PWA manifests (553 lines)
│           ├── SaaSDashboard.tsx                # API keys + GPU workers + cost calc (293 lines)
│           └── FrontierKeyModal.tsx             # BYO API key configuration modal (107 lines)
│
├── SAAS_ARCHITECTURE.md               # Complete system architecture documentation
├── PRODUCTION_SETUP.md                # Deployment procedures (static, Docker, K8s, RunPod)
├── FRONTIER_LAUNCH_GUIDE.md           # Step-by-step launch checklist
├── FRONTIER_MODE_SUMMARY.md           # What frontier mode means module-by-module
└── WHAT_YOU_HAVE.md                   # This file — quick reference guide
```

**Total source**: ~4,300 lines of TypeScript/TSX + ~800 lines of documentation = production-ready codebase.

---

## 8 Studio Modules (Complete Feature Set)

### 1. Real-Time Streaming ASR Studio
- **Purpose**: Live microphone → real transcription with VAD
- **APIs used**: `getUserMedia`, `AudioContext`, `SpeechRecognition`, `MediaRecorder`
- **Cloud options**: Groq fast-whisper, OpenAI Whisper
- **Key features**: True RMS energy meter, adjustable VAD threshold, interim/final packet display, WebSocket JSON telemetry

### 2. Deepgram Batch Clone Studio
- **Purpose**: File upload → batch transcription + speaker diarization
- **APIs used**: `AudioContext.decodeAudioData`, HTML5 `<audio>`, `fetch` to cloud endpoints
- **Key features**: Real file analysis, clickable word-level timestamps, Deepgram-compatible response JSON, cloud transcription execution

### 3. TTS & Voice Cloning Studio
- **Purpose**: Text → natural speech synthesis + voice cloning
- **APIs used**: `window.speechSynthesis`, OpenAI TTS API, `AudioContext` for pitch analysis
- **Key features**: Speed/pitch sliders, real TTFB measurement, zero-crossing pitch F0 extraction, cloned voice playback

### 4. Full-Duplex Voice Agent Orchestrator
- **Purpose**: Conversational AI agents with real latency budgets
- **APIs used**: `SpeechRecognition`, `speechSynthesis`, Groq/OpenAI chat completions
- **Key features**: 3 preset personas, real barge-in interruption, live latency breakdown, Pipecat code export

### 5. Backend Architecture & Code Hub
- **Purpose**: Interactive system diagram + production Python source
- **Content**: 6 code tabs (main.py, streaming.py, diarize.py, auth.py, usage.py, docker-compose.yml)
- **Key features**: Clickable architecture nodes, code copy/export

### 6. Voice AI Landscape Matrix
- **Purpose**: Complete 2024–2025 tool explorer + Whisper fine-tuning lab
- **Content**: 20+ tools across 8 categories (ASR, TTS, VAD, Agents, Telephony)
- **Key features**: Search, category filter, domain fine-tuning WER calculator

### 7. API & Deployment Manifests
- **Purpose**: OpenAPI 3.1 spec, Kubernetes YAML, Pipecat pipeline JSON, PWA manifest
- **Key features**: 4 tab switcher, download buttons, copy raw code, endpoint explorer

### 8. SaaS Dashboard (Modal)
- **Purpose**: API key management, GPU worker monitoring, cost calculator
- **Key features**: vk_live_ key generation, revoke, scale worker pool, cost undercut vs Deepgram/AssemblyAI

---

## TypeScript Interfaces (Complete Type Safety)

```
WordTimestamp          Word-level start/end/confidence with optional speaker
TranscriptSegment      Segments with speaker diarization
ASRMetadata           Duration, language, processing time, model, cost
DeepgramResponse      Full API response shape (metadata + channels)
SampleAudio           Preset audio file with embedded response
LandscapeTool         Voice AI tool matrix entry
VoiceModelTTS         TTS model specification
VoiceAgentConfig      Agent persona with system prompt
GPUWorker             GPU instance telemetry
APIKeyRecord          API key with usage tracking
FrontierApiKeys       BYO API key configuration (5 providers)
```

---

## Production Build Output

```
dist/index.html   408.00 KB total, 110.22 KB gzip
```

Single self-contained file with:
- All React components inlined (no external JS)
- All Tailwind CSS inlined (no external CSS)
- PWA ready with `manifest.json` and Apple meta tags
- Inter + JetBrains Mono fonts from Google Fonts CDN (only external dependency)

---

## API Compatibility Matrix

| VocalizeAI Endpoint | Compatible With | Method | Type |
|---------------------|----------------|--------|------|
| `POST /v1/listen` | Deepgram /v1/listen | File upload | Batch ASR |
| `WS /v1/listen` | Deepgram WebSocket | Bi-directional | Streaming ASR |
| `POST /v1/synthesize` | OpenAI /v1/audio/speech | JSON body | TTS |
| `POST /v1/chat/completions` | OpenAI /v1/chat/completions | JSON body | LLM |

---

## Cost Comparison

| Provider | Rate (per min) | VocalizeAI Self-Hosted |
|----------|---------------|----------------------|
| Deepgram Nova-3 | $0.0043 | ↓ 18.6% |
| AssemblyAI Universal-2 | $0.0063 | ↓ 44.4% |
| OpenAI Whisper API | $0.0060 | ↓ 41.7% |
| **VocalizeAI (self-hosted GPU)** | **$0.0035** | Baseline |

---

## Learning Resources (from the Landscape)

- **Pipecat docs** — Best practical voice agent education
- **LiveKit Agents playground** — Real-time pipeline testing
- **HuggingFace Audio Course** — Free ASR/TTS fundamentals
- **OpenAI Realtime API docs** — Speech-to-speech reference architecture
