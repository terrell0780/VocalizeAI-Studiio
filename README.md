# VocalizeAI Studio

Real-time voice AI platform with streaming speech-to-text, text-to-speech, voice agents, and a full SaaS billing infrastructure. Powered by browser-native APIs and optional cloud inference (Groq, OpenAI, Deepgram).

## Features

- **Live Streaming ASR** — Real-time speech recognition with browser microphone, RMS energy VAD, and cloud API fallback
- **Batch Transcription** — File upload transcription with speaker diarization
- **TTS & Voice Cloning** — Native browser speech synthesis and cloud TTS with pitch/formant analysis
- **Voice Agent Orchestrator** — Full-duplex voice agent with barge-in interruption, LLM reasoning, and speech output
- **SaaS Dashboard** — Stripe subscriptions, Supabase auth, API key management, CRM leads, usage tracking

## Quick Start

```bash
npm install
npm run dev
```

Build single-file output:
```bash
npm run build
# dist/index.html — complete app inlined
```

## Tech Stack

React 19, Vite 7, TypeScript, Tailwind CSS 4, Supabase, Stripe, TanStack Query

## License

MIT
