# VocalizeAI Studio — Frontier Launch Checklist

## Pre-Flight Verification (5 minutes)

### 1. Build Verification

```bash
npm run build
```

✅ Expected output:
```
dist/index.html  408.00 kB │ gzip: 110.22 kB
✓ built in 2.73s
```

If the build passes with zero errors, the entire application is production-ready. The output is a single HTML file suitable for any static host.

### 2. Local Development Server

```bash
npm run dev
```

Opens `http://localhost:5173`. Verify:

- [ ] All 7 navigation tabs render without console errors
- [ ] Click **⚡ Engine** (top-right) and enter API keys if desired
- [ ] The app works fully offline with native browser fallback

### 3. Browser Compatibility

| Browser | Live Mic ASR | Speech Synthesis | Audio Upload | PWA Install |
|---------|-------------|------------------|--------------|-------------|
| Chrome 120+ | ✅ Web Speech API | ✅ speechSynthesis | ✅ | ✅ |
| Edge 120+ | ✅ | ✅ | ✅ | ✅ |
| Safari 17+ | ⚠️ Limited | ✅ | ✅ | ✅ (macOS/iOS) |
| Firefox 120+ | ❌ No SpeechRecognition | ✅ | ✅ | ❌ |

---

## Studio-by-Studio Smoke Test

### Stream ASR (`LiveStreamingStudio`)

1. Click **Start Real Frontier Stream**
2. Grant microphone permission
3. Watch the **True RMS Audio Energy** bar spike as you speak
4. Verify:
   - [ ] Live interim (amber) → final (green) packets appear
   - [ ] Each packet shows confidence % and latency (ms)
   - [ ] **🔥 SPEECH ONSET ACTIVE** badge appears during speech
   - [ ] JSON telemetry panel updates in real time

**Without API key**: Uses native `window.SpeechRecognition`.  
**With Groq/OpenAI key**: Uses cloud Whisper API with real chunked uploads.

### Batch ASR (`BatchTranscriptionStudio`)

1. Click **Upload Real Audio File** and select a `.wav` or `.mp3`
2. Verify:
   - [ ] File duration and sample rate detected via `decodeAudioData`
   - [ ] Player bar updates with real seek scrub
3. If cloud API key configured:
   - [ ] Click **Execute Real Cloud Transcription**
   - [ ] Real API response populates segments with timestamps

### TTS & Voice Cloning (`TtsVoiceCloningStudio`)

1. Type text and click **Generate & Speak Real Audio**
2. Verify:
   - [ ] Real audio plays through speakers
   - [ ] Speed slider (0.75x–1.5x) affects speech rate
   - [ ] TTFB (Time-To-First-Byte) latency appears in green badge
3. Voice Cloning:
   - [ ] Upload a reference `.wav` file
   - [ ] Pitch F0 (Hz) and Formant spread (kHz) are extracted
   - [ ] **Generate & Speak Cloned Voice** produces shifted-pitch speech

**Without API key**: Uses native `window.speechSynthesis`.  
**With OpenAI key**: Uses `POST /v1/audio/speech` (tts-1 model).

### Voice Agent (`VoiceAgentOrchestrator`)

1. Click **Speak** and say "Why is Pipecat better than REST endpoints?"
2. Verify:
   - [ ] 🎙️ LISTENING MIC badge appears
   - [ ] Agent responds aloud with real speech synthesis
   - [ ] Latency breakdown: VAD + ASR + LLM + TTS shown in milliseconds
3. Barge-in test:
   - [ ] Enable **Real Barge-In Interruption** checkbox
   - [ ] While agent is speaking, click **Speak** again
   - [ ] Agent speech is immediately cut off: `[INTERRUPTED BY USER BARGE-IN]`

**Without API key**: Uses client-side conversational engine.  
**With Groq/OpenAI key**: Real `POST /chat/completions` with persona system prompt.

### Architecture & Code (`ArchitectureAndCodeHub`)

- [ ] Click system nodes to inspect specs
- [ ] Switch code tabs (main.py, streaming.py, diarize.py, auth.py, usage.py, docker-compose.yml)
- [ ] Click **Copy Code** on each file

### Voice AI Landscape (`LandscapeExplorer`)

- [ ] Search for "faster-whisper" → filtered results
- [ ] Filter by "ASR Open Source" → accurate subset
- [ ] Use Domain Fine-Tuning Lab sliders → WER benchmark updates

### API & Deployment Manifests (`ApiManifestStudio`)

- [ ] Switch between OpenAPI 3.1, Kubernetes YAML, Pipecat JSON, and PWA tabs
- [ ] Click **Download Manifest File** → correct filename and content downloaded

### SaaS Dashboard (`SaaSDashboard`)

- [ ] Click **SaaS Billing & Pool** button
- [ ] Adjust monthly minutes slider → cost calculations update
- [ ] Generate a new API key → appears in table with `vk_live_` prefix
- [ ] Revoke key → status changes to "Revoked"
- [ ] Scale pool (+1 A10G Node) → new worker appears
- [ ] Close dashboard with X button

---

## Production Deployment Checklist

- [ ] `npm run build` exits with code 0
- [ ] `dist/index.html` is a single self-contained file
- [ ] Serve from S3/Netlify/Vercel/nginx
- [ ] (Optional) Deploy Python backend via docker-compose or Kubernetes
- [ ] (Optional) Configure DNS for `api.yourdomain.io`
- [ ] (Optional) Configure Stripe billing webhook → `usage.py`
- [ ] (Optional) Set up Prometheus metrics scraping on `/metrics`

---

## Rollback Procedure

```bash
# Revert to previous build
git checkout v3.3.0
npm run build
# Re-deploy dist/index.html to hosting
```

---

## Monitoring & Alerts

| Metric | Alert Threshold | Action |
|--------|----------------|--------|
| Build failure | Any | Block deploy |
| GPU utilization | > 90% for 5 min | Scale K8s HPA |
| WebSocket connections | > 28 per GPU pod | Scale GPU pool |
| P50 API latency | > 500ms | Check load balancer health |
| API key creation rate | > 100/min | Rate limit trigger |
