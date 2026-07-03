# VocalizeAI Studio — Complete System Architecture

## Overview

VocalizeAI Studio is a production-grade, self-contained Progressive Web Application (PWA) implementing a **Deepgram-compatible Alternative & Complete Voice AI Ecosystem**. It ships as a single HTML file (`dist/index.html`, ~408 KB gzip → ~110 KB) deployable anywhere static files can be served: Netlify, Vercel, Cloudflare Pages, S3+CloudFront, or a simple `nginx` container.

---

## Layer 1: Frontier SaaS Rendering Engine (Browser Runtime)

```
┌──────────────────────────────────────────────────────────────────┐
│                    VocalizeAI Studio Browser App                  │
│                                                                  │
│  • React 19 + TypeScript 5.9 + Vite 7                            │
│  • Tailwind CSS 4 + custom scrollbar / animation utilities       │
│  • Single-file embed (vite-plugin-singlefile)                    │
│  • PWA manifest.json + Apple standalone meta tags                 │
│  • Google Fonts: Inter (UI body) + JetBrains Mono (code)         │
│                                                                  │
│  RUNTIME STATE:                                                  │
│  ┌─────────────────────────────────────────────────┐            │
│  │ ApiSettingsContext (React Context + localStorage)│            │
│  │   • Groq API Key (gsk_…)                          │            │
│  │   • OpenAI API Key (sk-…)                         │            │
│  │   • Deepgram API Key                              │            │
│  │   • ElevenLabs API Key                            │            │
│  │   • Self-hosted FastAPI WebSocket URL              │            │
│  │   • Native Browser Fallback toggle (persisted)     │            │
│  └─────────────────────────────────────────────────┘            │
│                                                                  │
│  STUDIO MODULES (8 total):                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Stream ASR  │ Batch ASR    │ TTS & Cloning  │ Agents    │   │
│  │ Architecture│ Landscape    │ API Manifests   │ SaaS Dash │   │
│  │ (live mic)  │ (file+cloud) │ (speechSynth)   │ (chat+STT)│   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Layer 2: Native Browser APIs (True Zero Mock Execution)

| API | Used In Module | Notes |
|-----|---------------|-------|
| `window.SpeechRecognition` / `webkitSpeechRecognition` | LiveStreamingStudio, VoiceAgentOrchestrator | Continuous live ASR with interim + final word results |
| `navigator.mediaDevices.getUserMedia` | LiveStreamingStudio | Microphone access for Real AudioContext RMS VAD |
| `AudioContext.decodeAudioData` | BatchTranscriptionStudio, TtsVoiceCloningStudio | Real file duration, sample rate, zero-crossing pitch F0 analysis |
| `AudioContext.createAnalyser` + `getByteTimeDomainData` | LiveStreamingStudio | True normalized RMS decibel calculation (0.0–1.0) |
| `window.speechSynthesis` + `SpeechSynthesisUtterance` | TtsVoiceCloningStudio, VoiceAgentOrchestrator, BatchTranscriptionStudio | Real neural speech output with rate/pitch control |
| `MediaRecorder` | LiveStreamingStudio | Cloud mode chunked audio recording |
| `window.open()` / `dark` class + `color-scheme` | index.html | System-level dark mode compatible with all major OS/browsers |

---

## Layer 3: Optional Cloud Inference APIs (BYO-KEY Model)

```
┌──────────────────────────────────────────────────┐
│             Cloud AI Provider Router              │
│                                                   │
│  IF user provides Groq Key:                       │
│    → POST https://api.groq.com/openai/v1/         │
│      ├── /audio/transcriptions (Fast-Whisper)     │
│      └── /chat/completions (Llama 3.1 70B)        │
│                                                   │
│  IF user provides OpenAI Key:                     │
│    → POST https://api.openai.com/v1/              │
│      ├── /audio/transcriptions                    │
│      ├── /audio/speech (TTS)                      │
│      └── /chat/completions (GPT-4o Mini)          │
│                                                   │
│  IF user provides Deepgram Key:                   │
│    → Standard Nova-3 SDK connection path           │
│                                                   │
│  IF user provides local server URL:                │
│    → wss://localhost:8000/v1/listen                │
│    → Data path to self-hosted faster-whisper GPU   │
│                                                   │
│  ELSE (no keys configured):                        │
│    → Native Browser Web Speech API fallback        │
│    → Zero network calls; fully offline-capable     │
└──────────────────────────────────────────────────┘
```

---

## Layer 4: Production Python Backend (Self-Hosted, Architectural Reference)

The `ArchitectureAndCodeHub` studio module exposes the **entire production-ready backend source code**:

```
voiceapi/
├── app/
│   ├── main.py          FastAPI routes (Deepgram-compatible POST /v1/listen)
│   ├── auth.py          SHA256 hashed API key system (generate, verify)
│   ├── transcribe.py    Batch file processing with word timestamps
│   ├── streaming.py     WebSocket real-time PCM buffer ingest + Silero VAD
│   ├── diarize.py       pyannote.audio speaker diarization pipeline
│   └── usage.py         Stripe-compatible billing metering ($0.0035/min)
├── requirements.txt
├── docker-compose.yml
│   ├── api              NVIDIA GPU reservation (nvidia.com/gpu: 1)
│   ├── redis:7-alpine   Job queue
│   └── postgres:15      Usage and billing records
├── Dockerfile
└── kubernetes/
    ├── deployment.yaml  HPA auto-scale (2–16 GPU pods)
    └── ingress.yaml     WebSocket timeout 3600s
```

---

## Layer 5: Full-Stack Data Flow (Production Deployment)

```
                  ┌──────────────┐
                  │   End User   │
                  │  (Browser)   │
                  └──────┬───────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
   ┌───────────┐  ┌───────────┐  ┌───────────┐
   │ Native Web│  │ Cloud API │  │ Local     │
   │ Speech    │  │ Router    │  │ FastAPI   │
   │ (browser) │  │ (fetch)   │  │ (wss://)  │
   └─────┬─────┘  └─────┬─────┘  └─────┬─────┘
         │              │              │
         ▼              ▼              ▼
   ┌──────────────────────────────────────────┐
   │          VocalizeAI Studio UI            │
   │  Real-Time Transcripts, Audio Waveforms, │
   │  Latency Budgets, Voice Agent Responses  │
   └──────────────────────────────────────────┘
```

The entire system **compiles to a single `dist/index.html`** (one HTML file containing all JS, CSS, and assets inlined) using `vite-plugin-singlefile`.

---

## Technology Stack Summary

| Component | Technologies |
|-----------|-------------|
| Frontend Framework | React 19 + TypeScript 5.9 |
| Build Tool | Vite 7 + vite-plugin-singlefile |
| Styling | Tailwind CSS 4 + Inter / JetBrains Mono fonts |
| Icons | lucide-react |
| Runtime State | React Context API + localStorage persistence |
| Type Checking | strict mode, noUnusedLocals, noUnusedParameters |
| PWA | manifest.json, Apple standalone meta, theme-color |
| Backend Reference | FastAPI, faster-whisper, Silero VAD ONNX, pyannote.audio |
| Container Orchestration | docker-compose + Kubernetes Deployment manifests |
| API Compatibility | Deepgram POST/WS /v1/listen, OpenAI /v1/chat, /v1/audio |
