export interface WordTimestamp {
  word: string;
  start: number;
  end: number;
  confidence: number;
  speaker?: string;
}

export interface TranscriptSegment {
  id: string;
  start: number;
  end: number;
  text: string;
  speaker?: string;
  words?: WordTimestamp[];
}

export interface ASRMetadata {
  duration: number;
  language: string;
  processing_time: number;
  model: string;
  cost: number;
}

export interface DeepgramResponse {
  metadata: ASRMetadata;
  results: {
    channels: [
      {
        alternatives: [
          {
            transcript: string;
            words?: WordTimestamp[];
            segments: TranscriptSegment[];
          }
        ];
      }
    ];
  };
}

export interface SampleAudio {
  id: string;
  title: string;
  category: 'Sales Call' | 'Podcast' | 'Medical Dictation' | 'Customer Support';
  duration: number;
  audioUrl?: string;
  description: string;
  response: DeepgramResponse;
}

export interface LandscapeTool {
  id: string;
  name: string;
  category: 'ASR Open Source' | 'ASR Commercial' | 'TTS Open Source' | 'TTS Commercial' | 'VAD & Diarization' | 'Realtime / S2S' | 'Agent Frameworks' | 'Telephony & Transport' | 'Cloning & Conversion' | 'Audio Utils & Eval';
  type: 'Open Source' | 'Commercial' | 'Hybrid';
  bestFor: string;
  notes: string;
  latencyMs?: number;
  wer?: string;
  pricing?: string;
  stars?: string;
  url?: string;
}

export interface VoiceModelTTS {
  id: string;
  name: string;
  provider: string;
  latency: string;
  type: 'Zero-Shot Cloning' | 'Expressive Neural' | 'Ultra-Low Latency' | 'Edge CPU';
  sampleRate: number;
  description: string;
}

export interface VoiceAgentConfig {
  id: string;
  name: string;
  persona: string;
  systemPrompt: string;
  asrProvider: string;
  llmProvider: string;
  ttsProvider: string;
  vadThreshold: number;
  interruptionBargeIn: boolean;
}

export interface GPUWorker {
  id: string;
  name: string;
  gpuType: 'NVIDIA A10G (24GB)' | 'NVIDIA L4 (24GB)' | 'NVIDIA T4 (16GB)' | 'NVIDIA H100 (80GB)';
  status: 'Idle' | 'Processing' | 'Scaling';
  currentLoad: number;
  activeJobs: number;
  modelLoaded: string;
  memoryUsedGb: number;
  memoryTotalGb: number;
}

export interface APIKeyRecord {
  id: string;
  name: string;
  prefix: string;
  created: string;
  lastUsed: string;
  usageMinutes: number;
  active: boolean;
}
