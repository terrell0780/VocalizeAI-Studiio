import React, { useState } from 'react';
import { FileCode, Server, Download, Copy, Check, Terminal, Layers, Globe, Cpu, Sparkles } from 'lucide-react';

export const ApiManifestStudio: React.FC = () => {
  const [manifestType, setManifestType] = useState<'openapi' | 'kubernetes' | 'pipecat' | 'pwa'>('openapi');
  const [copied, setCopied] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<'post-listen' | 'ws-listen' | 'post-synthesize' | 'post-agent'>('post-listen');

  const openApiJsonManifest = {
    openapi: "3.1.0",
    info: {
      title: "VocalizeAI API — Deepgram Alternative & Voice AI Ecosystem",
      version: "3.4.0",
      description: "High-throughput speech-to-text (ASR), ultra-low latency text-to-speech (TTS), and full-duplex Pipecat voice agent orchestration API.",
      contact: { name: "VocalizeAI Architecture Team", url: "https://vocalizeai.io" }
    },
    servers: [
      { url: "https://api.vocalizeai.io", description: "Global Anycast Production Cluster (NVIDIA A10G)" },
      { url: "wss://api.vocalizeai.io", description: "Real-Time WebSocket Streaming Endpoint" }
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
          description: "Format: Token vk_live_YOUR_API_KEY or Bearer vk_live_YOUR_API_KEY"
        }
      }
    },
    security: [{ ApiKeyAuth: [] }],
    paths: {
      "/v1/listen": {
        post: {
          summary: "Synchronous Batch Transcription & Speaker Diarization",
          description: "Exact compatibility with Deepgram POST /v1/listen. Transcribes WAV/MP3 files using faster-whisper with pyannote speaker diarization.",
          parameters: [
            { name: "model", in: "query", schema: { type: "string", default: "faster-whisper-large-v3" } },
            { name: "diarize", in: "query", schema: { type: "boolean", default: true } },
            { name: "punctuate", in: "query", schema: { type: "boolean", default: true } },
            { name: "vad_filter", in: "query", schema: { type: "boolean", default: true } }
          ],
          requestBody: {
            required: true,
            content: { "audio/*": { schema: { type: "string", format: "binary" } } }
          },
          responses: {
            "200": {
              description: "Successful Transcription Response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      metadata: {
                        type: "object",
                        properties: {
                          duration: { type: "number", example: 38.5 },
                          model: { type: "string", example: "faster-whisper-large-v3" },
                          cost_usd: { type: "number", example: 0.00256 }
                        }
                      },
                      results: {
                        type: "object",
                        properties: {
                          channels: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                alternatives: {
                                  type: "array",
                                  items: {
                                    type: "object",
                                    properties: {
                                      transcript: { type: "string" },
                                      words: { type: "array" },
                                      segments: { type: "array" }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/v1/listen (WebSocket)": {
        get: {
          summary: "Real-Time Bidirectional WebSocket Audio Streaming",
          description: "Establishes a WebSocket connection streaming 16-bit linear PCM audio @ 16kHz. Silero VAD performs sub-10ms endpointing while faster-whisper sends draft interim results before locking in final sentences.",
          parameters: [
            { name: "model", in: "query", schema: { type: "string", default: "faster-whisper-large-v3" } },
            { name: "interim_results", in: "query", schema: { type: "boolean", default: true } },
            { name: "vad_threshold", in: "query", schema: { type: "number", default: 0.015 } }
          ]
        }
      },
      "/v1/synthesize": {
        post: {
          summary: "Ultra-Low Latency Conversational TTS",
          description: "Synthesizes natural speech with <90ms Time-To-First-Byte (TTFB) using Cartesia Sonic or Kokoro 82M.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    model_id: { type: "string", example: "cartesia-sonic-en" },
                    text: { type: "string", example: "Hello! How can I help you today?" },
                    speed: { type: "number", example: 1.0 }
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  const kubernetesDeploymentManifest = `# Production Kubernetes Manifest for Self-Hosted Deepgram Alternative
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vocalizeai-gpu-workers
  namespace: voice-ai-prod
  labels:
    app: vocalizeai-asr
    tier: inference-gpu
spec:
  replicas: 4
  selector:
    matchLabels:
      app: vocalizeai-asr
  template:
    metadata:
      labels:
        app: vocalizeai-asr
    spec:
      containers:
      - name: faster-whisper-worker
        image: ghcr.io/vocalizeai/server:v3.4.0
        env:
        - name: MODEL_NAME
          value: "large-v3"
        - name: COMPUTE_TYPE
          value: "float16"
        - name: REDIS_URL
          value: "redis://redis-master.voice-ai-prod.svc.cluster.local:6379/0"
        ports:
        - containerPort: 8000
          name: http-ws
        resources:
          limits:
            nvidia.com/gpu: 1           # Dedicated NVIDIA A10G / L4 GPU per pod
            memory: "24Gi"
            cpu: "8000m"
          requests:
            nvidia.com/gpu: 1
            memory: "16Gi"
            cpu: "4000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: vocalizeai-gpu-hpa
  namespace: voice-ai-prod
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: vocalizeai-gpu-workers
  minReplicas: 2
  maxReplicas: 16
  metrics:
  - type: External
    external:
      metric:
        name: container_gpu_utilization
      target:
        type: Value
        averageValue: "75"
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: vocalizeai-websocket-ingress
  namespace: voice-ai-prod
  annotations:
    nginx.ingress.kubernetes.io/proxy-read-timeout: "3600"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "3600"
    nginx.ingress.kubernetes.io/websocket-services: "vocalizeai-gpu-workers"
spec:
  rules:
  - host: api.vocalizeai.io
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: vocalizeai-service
            port:
              number: 8000`;

  const pipecatDeclarativeManifest = {
    "$schema": "https://vocalizeai.io/schemas/pipecat-manifest.json",
    "version": "1.0.0",
    "agent_id": "agent-support-elena",
    "name": "SaaS Technical Concierge (Elena)",
    "orchestration": {
      "framework": "pipecat-ai",
      "duplex_mode": "full_duplex_barge_in",
      "target_latency_budget_ms": 780
    },
    "pipeline_stages": [
      {
        "stage": 1,
        "type": "transport_in",
        "protocol": "websocket_pcm_16khz",
        "vad": {
          "engine": "silero-vad-onnx",
          "speech_pad_ms": 150,
          "threshold": 0.015,
          "interrupt_on_speech": true
        }
      },
      {
        "stage": 2,
        "type": "asr_streaming",
        "engine": "faster-whisper-ctranslate2",
        "model": "large-v3",
        "decoding": "greedy_beam_1",
        "interim_results": true
      },
      {
        "stage": 3,
        "type": "llm_streaming",
        "engine": "openai-gpt-4o-mini",
        "temperature": 0.3,
        "system_prompt": "You are Elena, a voice AI systems architect. Speak concisely in 1-2 short sentences."
      },
      {
        "stage": 4,
        "type": "tts_synthesis",
        "engine": "cartesia-sonic",
        "model_id": "cartesia-sonic-en",
        "sample_rate": 24000,
        "buffer_sentence_by_sentence": true
      }
    ]
  };

  const pwaManifestContent = {
    "short_name": "VocalizeAI",
    "name": "VocalizeAI Studio — Deepgram Alternative & Voice AI Ecosystem",
    "display": "standalone",
    "theme_color": "#06b6d4",
    "background_color": "#020617",
    "start_url": "/",
    "shortcuts": [
      { "name": "Live Streaming ASR", "url": "/?tab=streaming" },
      { "name": "Deepgram Batch Clone", "url": "/?tab=batch" }
    ]
  };

  const getManifestText = () => {
    if (manifestType === 'openapi') return JSON.stringify(openApiJsonManifest, null, 2);
    if (manifestType === 'kubernetes') return kubernetesDeploymentManifest;
    if (manifestType === 'pipecat') return JSON.stringify(pipecatDeclarativeManifest, null, 2);
    return JSON.stringify(pwaManifestContent, null, 2);
  };

  const handleCopyManifest = () => {
    navigator.clipboard.writeText(getManifestText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadManifest = () => {
    const text = getManifestText();
    const filename =
      manifestType === 'openapi'
        ? 'vocalizeai-openapi-manifest.json'
        : manifestType === 'kubernetes'
        ? 'vocalizeai-gpu-deployment.yaml'
        : manifestType === 'pipecat'
        ? 'pipecat-agent-manifest.json'
        : 'manifest.json';
    const blob = new Blob([text], { type: manifestType === 'kubernetes' ? 'text/yaml' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
              System & API Specifications Hub
            </span>
            <span className="text-xs text-slate-400 font-mono">OpenAPI 3.1 • K8s YAML • PWA Manifest</span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1.5 flex items-center gap-2">
            VocalizeAI Architecture & API Manifest Studio
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Inspect, test, and export our OpenAPI 3.1 API manifests, Kubernetes GPU worker production deployment files, and declarative Pipecat voice agent orchestration schemas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadManifest}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs transition shadow-lg shadow-cyan-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Download Manifest File</span>
          </button>
        </div>
      </div>

      {/* Manifest Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <button
          onClick={() => setManifestType('openapi')}
          className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
            manifestType === 'openapi'
              ? 'bg-cyan-500/15 border-cyan-500 shadow-lg shadow-cyan-500/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <FileCode className="w-5 h-5 text-cyan-400" />
            <span className="font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded text-cyan-300">OpenAPI 3.1</span>
          </div>
          <h3 className="font-bold text-white text-sm">REST & WebSocket API Manifest</h3>
          <p className="text-xs text-slate-400 mt-1">Deepgram compatibility endpoints & auth schema</p>
        </button>

        <button
          onClick={() => setManifestType('kubernetes')}
          className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
            manifestType === 'kubernetes'
              ? 'bg-emerald-500/15 border-emerald-500 shadow-lg shadow-emerald-500/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <Server className="w-5 h-5 text-emerald-400" />
            <span className="font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded text-emerald-300">K8s YAML</span>
          </div>
          <h3 className="font-bold text-white text-sm">Kubernetes GPU Cluster Manifest</h3>
          <p className="text-xs text-slate-400 mt-1">NVIDIA A10G pods, HPA auto-scaler & Ingress</p>
        </button>

        <button
          onClick={() => setManifestType('pipecat')}
          className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
            manifestType === 'pipecat'
              ? 'bg-purple-500/15 border-purple-500 shadow-lg shadow-purple-500/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <span className="font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded text-purple-300">Declarative JSON</span>
          </div>
          <h3 className="font-bold text-white text-sm">Pipecat Agent Pipeline Manifest</h3>
          <p className="text-xs text-slate-400 mt-1">VAD latency budget & full-duplex orchestration</p>
        </button>

        <button
          onClick={() => setManifestType('pwa')}
          className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
            manifestType === 'pwa'
              ? 'bg-amber-500/15 border-amber-500 shadow-lg shadow-amber-500/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <Globe className="w-5 h-5 text-amber-400" />
            <span className="font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded text-amber-300">PWA Manifest</span>
          </div>
          <h3 className="font-bold text-white text-sm">Web App Manifest (manifest.json)</h3>
          <p className="text-xs text-slate-400 mt-1">Standalone desktop/mobile PWA installation</p>
        </button>

      </div>

      {/* Split Screen: Interactive Endpoint Explorer vs Raw Manifest Code */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Interactive Navigation & Schema Docs */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" /> Manifest Details & Schema Explorer
          </h3>

          {manifestType === 'openapi' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-300 font-semibold mb-1">Endpoints in Manifest:</div>
              
              <div
                onClick={() => setSelectedEndpoint('post-listen')}
                className={`p-3 rounded-xl border cursor-pointer transition ${
                  selectedEndpoint === 'post-listen' ? 'bg-cyan-950/60 border-cyan-500' : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 font-mono text-xs font-bold">
                  <span className="bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded text-[10px]">POST</span>
                  <span className="text-white">/v1/listen</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Batch audio file transcription + diarization</p>
              </div>

              <div
                onClick={() => setSelectedEndpoint('ws-listen')}
                className={`p-3 rounded-xl border cursor-pointer transition ${
                  selectedEndpoint === 'ws-listen' ? 'bg-cyan-950/60 border-cyan-500' : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 font-mono text-xs font-bold">
                  <span className="bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded text-[10px]">WSS</span>
                  <span className="text-white">/v1/listen</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Bi-directional streaming PCM audio socket</p>
              </div>

              <div
                onClick={() => setSelectedEndpoint('post-synthesize')}
                className={`p-3 rounded-xl border cursor-pointer transition ${
                  selectedEndpoint === 'post-synthesize' ? 'bg-cyan-950/60 border-cyan-500' : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 font-mono text-xs font-bold">
                  <span className="bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded text-[10px]">POST</span>
                  <span className="text-white">/v1/synthesize</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Cartesia Sonic & Kokoro TTS audio generator</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-xs font-mono text-slate-300">
                <div className="text-cyan-400 font-bold">Security Scheme:</div>
                <div>Header: Authorization: Token vk_live_...</div>
                <div>Hash Verification: SHA256 in Redis / Postgres</div>
              </div>
            </div>
          )}

          {manifestType === 'kubernetes' && (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" /> GPU Allocation Spec
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Requests 1 dedicated NVIDIA GPU (`nvidia.com/gpu: 1`) per pod running CTranslate2 FP16 inference engine.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> HPA Auto-Scaling Rule
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Automatically scales from 2 to 16 pod replicas when container GPU utilization exceeds 75% threshold.
                </p>
              </div>
            </div>
          )}

          {manifestType === 'pipecat' && (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-purple-400">Declarative Pipeline Configuration</div>
                <p className="text-slate-300 leading-relaxed">
                  Allows defining multi-model voice agents purely via JSON manifests without writing boilerplate code.
                </p>
              </div>
            </div>
          )}

          {manifestType === 'pwa' && (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-amber-400">Progressive Web App Setup</div>
                <p className="text-slate-300 leading-relaxed">
                  VocalizeAI Studio includes `manifest.json` and Apple PWA headers so you can install it as a standalone application on macOS, Windows, iOS, or Android.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right 2 Columns: Raw Manifest Code Inspector */}
        <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 shadow-xl flex flex-col h-[520px]">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/40 rounded-t-2xl">
            <div className="flex items-center space-x-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white text-sm font-mono">
                {manifestType === 'openapi'
                  ? 'openapi-3.1.0-manifest.json'
                  : manifestType === 'kubernetes'
                  ? 'k8s-gpu-deployment-manifest.yaml'
                  : manifestType === 'pipecat'
                  ? 'pipecat-agent-pipeline.json'
                  : 'public/manifest.json'}
              </span>
            </div>
            <button
              onClick={handleCopyManifest}
              className="flex items-center space-x-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition border border-slate-700 font-mono"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Manifest!' : 'Copy Raw Code'}</span>
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto font-mono text-xs text-cyan-300 bg-slate-950/90 leading-relaxed">
            <pre>{getManifestText()}</pre>
          </div>
        </div>

      </div>

    </div>
  );
};
