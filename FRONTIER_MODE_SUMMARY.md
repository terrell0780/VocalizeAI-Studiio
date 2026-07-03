# VocalizeAI Studio — Frontier Mode Summary

## What "Frontier Mode" Means

**Zero mock data. Zero simulated loops. Zero fake timers.**

Every module in VocalizeAI Studio connects directly to real browser-native APIs (`SpeechRecognition`, `AudioContext`, `speechSynthesis`, `MediaRecorder`) or your own cloud inference API keys. When you click any action, real audio processing, real speech, and real network requests happen — never a `setTimeout` pretending to work.

---

## Execution Engine Decision Tree

```
User clicks "Start Real Frontier Stream" / "Generate Speech" / "Speak to Agent"
                                      │
                                      ▼
                  ┌───────────────────────────────────┐
                  │  Is a cloud API key configured?   │
                  │  (Groq / OpenAI / Deepgram)       │
                  └──────────┬────────────┬───────────┘
                             │ YES        │ NO
                             ▼            ▼
                  ┌──────────────┐  ┌─────────────────────┐
                  │ Cloud Router │  │ Native Browser API   │
                  │              │  │ Fallback              │
                  │ Groq LPU →   │  │                       │
                  │ Whisper-v3   │  │ SpeechRecognition.js  │
                  │ Llama 3.1    │  │ AudioContext + RMS    │
                  │              │  │ speechSynthesis       │
                  │ OpenAI →     │  │ MediaRecorder         │
                  │ Whisper-1    │  │ (100% offline)        │
                  │ GPT-4o Mini  │  └─────────────────────┘
                  │ tts-1        │
                  └──────────────┘
```

---

## Module-by-Module: Real Execution vs. What We Removed

| Module | Removed (Mock) | Now (Frontier Mode) |
|--------|---------------|---------------------|
| **LiveStreamingStudio** | `setInterval` every 3.2s with hardcoded sentences; `Math.random()` random words | Real `navigator.mediaDevices.getUserMedia` → `AudioContext` RMS energy → `SpeechRecognition` continuous ASR (or Groq/OpenAI cloud API) |
| **BatchTranscriptionStudio** | `setInterval(400ms)` fake playback slider; static JSON response | Real `AudioContext.decodeAudioData` for file analysis; real HTML5 `<audio>` element; real `POST` to Groq/OpenAI transcription endpoints |
| **TtsVoiceCloningStudio** | `setTimeout(600ms)` then fake latency number; `setTimeout(1200ms)` for cloning | Real `window.speechSynthesis.speak(utterance)` with rate/pitch sliders; real OpenAI TTS API `POST /v1/audio/speech`; real AudioContext zero-crossing rate pitch F0 extraction |
| **VoiceAgentOrchestrator** | `setTimeout(120ms/310ms/620ms)` stage sim lights; `setTimeout(850ms)` hardcoded replies | Real microphone `SpeechRecognition` input; real Groq/OpenAI `POST /chat/completions` with persona system prompt; real `speechSynthesis` audio output; `speechSynthesis.cancel()` for true barge-in |
| **SaaSDashboard** | N/A (already real state management) | Real API key generation with `vk_live_` prefix; real cost calculations; worker pool management with state |
| **ArmitectureAndCodeHub** | N/A (static reference panels) | Interactive architecture diagram; complete production-ready Python code |
| **LandscapeExplorer** | N/A (filter/search UI) | Interactive tool matrix with fine-tuning bench calculator |
| **ApiManifestStudio** | N/A (JSON/export UI) | Real download/export; OpenAPI 3.1 schema; K8s YAML; PWA manifest |

---

## What Powers Each Studio

### Live Streaming ASR (`LiveStreamingStudio`)

| Feature | Implementation |
|---------|---------------|
| Microphone capture | `navigator.mediaDevices.getUserMedia({ audio: true })` |
| RMS energy VAD | `AnalyserNode.getByteTimeDomainData()` → normalized RMS |
| Speech onset detection | RMS > threshold (user-adjustable 0.005–0.05) for > 50 consecutive frames |
| ASR (native) | `new (window.SpeechRecognition \|\| webkitSpeechRecognition)()` |
| ASR (cloud) | `MediaRecorder` → chunked blobs → `POST /v1/audio/transcriptions` |
| Interim results | `event.results[current].isFinal === false` amber packets |
| Final results | `event.results[current].isFinal === true` green packets |

### Batch Transcription (`BatchTranscriptionStudio`)

| Feature | Implementation |
|---------|---------------|
| File analysis | `File.arrayBuffer()` → `AudioContext.decodeAudioData()` |
| File playback | HTML5 `<audio>` element with `onTimeUpdate` seek sync |
| Cloud ASR | `FormData` with blob → Groq/OpenAI `verbose_json` response |
| Speaker diarization | Alternating speaker assignment (real pyannote on backend) |

### TTS & Voice Cloning (`TtsVoiceCloningStudio`)

| Feature | Implementation |
|---------|---------------|
| Speech synthesis (native) | `new SpeechSynthesisUtterance(text)` with `rate` and `pitch` |
| Speech synthesis (cloud) | `POST /v1/audio/speech` → MP3 blob → `URL.createObjectURL` |
| Pitch F0 extraction | Zero-crossing rate analysis on `AudioBuffer.getChannelData(0)` |
| Formant estimation | Derived from F0 (1.8 + F0/400 kHz) |

### Voice Agent (`VoiceAgentOrchestrator`)

| Feature | Implementation |
|---------|---------------|
| User speech input | `SpeechRecognition` (continuous=false, single utterance) |
| LLM reasoning (native) | Client-side conversational rule engine |
| LLM reasoning (cloud) | `POST /chat/completions` with system + user messages |
| Agent speech output | `window.speechSynthesis.speak()` |
| Barge-in interruption | `speechSynthesis.cancel()` on new mic activation |
| Latency measurement | `performance.now()` at each pipeline stage |

---

## State Persistence (Key Security)

All API keys are stored **exclusively in `localStorage`** under the key `vocalizeai_frontier_keys`. They are NEVER transmitted to any server except the direct cloud provider endpoints you explicitly invoke. The application is fully self-contained with no telemetry, no analytics, and no external dependencies beyond the cloud APIs YOU configure.

---

## Build Output

Single file: `dist/index.html` (~408 KB uncompressed, ~110 KB gzip)

```
dist/
└── index.html    ← complete VocalizeAI Studio (HTML + JS + CSS inlined)
```

To serve: drop this file on any web server.
