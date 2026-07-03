import { SampleAudio, LandscapeTool, VoiceModelTTS, VoiceAgentConfig, GPUWorker, APIKeyRecord } from '../types';

export const SAMPLE_AUDIO_FILES: SampleAudio[] = [
  {
    id: 'sample-sales-call',
    title: 'Enterprise SaaS Discovery Call (B2B)',
    category: 'Sales Call',
    duration: 38.5,
    description: 'Two-speaker discussion between Account Executive (SPEAKER_00) and VP of Engineering (SPEAKER_01) regarding real-time transcription latency.',
    response: {
      metadata: {
        duration: 38.5,
        language: 'en',
        processing_time: 0.38,
        model: 'faster-whisper-large-v3',
        cost: 0.00256
      },
      results: {
        channels: [
          {
            alternatives: [
              {
                transcript: "Hi Alex, thanks for joining today. I wanted to understand your current audio pipeline bottlenecks. Hey Sarah, pleasure to be here. Right now we're using standard Whisper API, but our end-to-end latency is hovering around two seconds which breaks conversational flow. Exactly. With faster-whisper on CTranslate2 combined with Silero VAD, we cut streaming interim results down to under two hundred milliseconds.",
                segments: [
                  {
                    id: 'seg-1',
                    start: 0.2,
                    end: 5.4,
                    speaker: 'SPEAKER_00',
                    text: 'Hi Alex, thanks for joining today. I wanted to understand your current audio pipeline bottlenecks.',
                    words: [
                      { word: 'Hi', start: 0.2, end: 0.5, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'Alex,', start: 0.6, end: 1.0, confidence: 0.98, speaker: 'SPEAKER_00' },
                      { word: 'thanks', start: 1.1, end: 1.4, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'for', start: 1.5, end: 1.6, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'joining', start: 1.7, end: 2.1, confidence: 0.97, speaker: 'SPEAKER_00' },
                      { word: 'today.', start: 2.2, end: 2.6, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'I', start: 2.8, end: 2.9, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'wanted', start: 3.0, end: 3.3, confidence: 0.98, speaker: 'SPEAKER_00' },
                      { word: 'to', start: 3.4, end: 3.5, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'understand', start: 3.6, end: 4.1, confidence: 0.97, speaker: 'SPEAKER_00' },
                      { word: 'your', start: 4.2, end: 4.3, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'current', start: 4.4, end: 4.7, confidence: 0.96, speaker: 'SPEAKER_00' },
                      { word: 'audio', start: 4.8, end: 5.0, confidence: 0.98, speaker: 'SPEAKER_00' },
                      { word: 'pipeline', start: 5.1, end: 5.3, confidence: 0.95, speaker: 'SPEAKER_00' },
                      { word: 'bottlenecks.', start: 5.4, end: 5.8, confidence: 0.97, speaker: 'SPEAKER_00' }
                    ]
                  },
                  {
                    id: 'seg-2',
                    start: 6.2,
                    end: 18.1,
                    speaker: 'SPEAKER_01',
                    text: "Hey Sarah, pleasure to be here. Right now we're using standard Whisper API, but our end-to-end latency is hovering around two seconds which breaks conversational flow.",
                    words: [
                      { word: 'Hey', start: 6.2, end: 6.5, confidence: 0.99, speaker: 'SPEAKER_01' },
                      { word: 'Sarah,', start: 6.6, end: 7.0, confidence: 0.98, speaker: 'SPEAKER_01' },
                      { word: 'pleasure', start: 7.1, end: 7.5, confidence: 0.99, speaker: 'SPEAKER_01' },
                      { word: 'to', start: 7.6, end: 7.7, confidence: 0.99, speaker: 'SPEAKER_01' },
                      { word: 'be', start: 7.8, end: 7.9, confidence: 0.99, speaker: 'SPEAKER_01' },
                      { word: 'here.', start: 8.0, end: 8.3, confidence: 0.99, speaker: 'SPEAKER_01' },
                      { word: 'Right', start: 8.6, end: 8.9, confidence: 0.98, speaker: 'SPEAKER_01' },
                      { word: 'now', start: 9.0, end: 9.2, confidence: 0.99, speaker: 'SPEAKER_01' },
                      { word: "we're", start: 9.3, end: 9.5, confidence: 0.96, speaker: 'SPEAKER_01' },
                      { word: 'using', start: 9.6, end: 9.9, confidence: 0.98, speaker: 'SPEAKER_01' },
                      { word: 'standard', start: 10.0, end: 10.5, confidence: 0.97, speaker: 'SPEAKER_01' },
                      { word: 'Whisper', start: 10.6, end: 11.0, confidence: 0.99, speaker: 'SPEAKER_01' },
                      { word: 'API,', start: 11.1, end: 11.5, confidence: 0.99, speaker: 'SPEAKER_01' },
                      { word: 'but', start: 11.7, end: 11.9, confidence: 0.99, speaker: 'SPEAKER_01' },
                      { word: 'our', start: 12.0, end: 12.2, confidence: 0.99, speaker: 'SPEAKER_01' },
                      { word: 'end-to-end', start: 12.3, end: 13.0, confidence: 0.95, speaker: 'SPEAKER_01' },
                      { word: 'latency', start: 13.1, end: 13.6, confidence: 0.98, speaker: 'SPEAKER_01' },
                      { word: 'is', start: 13.7, end: 13.8, confidence: 0.99, speaker: 'SPEAKER_01' },
                      { word: 'hovering', start: 13.9, end: 14.4, confidence: 0.97, speaker: 'SPEAKER_01' },
                      { word: 'around', start: 14.5, end: 14.8, confidence: 0.99, speaker: 'SPEAKER_01' },
                      { word: 'two', start: 14.9, end: 15.1, confidence: 0.99, speaker: 'SPEAKER_01' },
                      { word: 'seconds', start: 15.2, end: 15.7, confidence: 0.99, speaker: 'SPEAKER_01' },
                      { word: 'which', start: 15.8, end: 16.0, confidence: 0.99, speaker: 'SPEAKER_01' },
                      { word: 'breaks', start: 16.1, end: 16.5, confidence: 0.98, speaker: 'SPEAKER_01' },
                      { word: 'conversational', start: 16.6, end: 17.4, confidence: 0.96, speaker: 'SPEAKER_01' },
                      { word: 'flow.', start: 17.5, end: 18.1, confidence: 0.99, speaker: 'SPEAKER_01' }
                    ]
                  },
                  {
                    id: 'seg-3',
                    start: 18.6,
                    end: 29.8,
                    speaker: 'SPEAKER_00',
                    text: 'Exactly. With faster-whisper on CTranslate2 combined with Silero VAD, we cut streaming interim results down to under two hundred milliseconds.',
                    words: [
                      { word: 'Exactly.', start: 18.6, end: 19.2, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'With', start: 19.5, end: 19.7, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'faster-whisper', start: 19.8, end: 20.7, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'on', start: 20.8, end: 20.9, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'CTranslate2', start: 21.0, end: 22.1, confidence: 0.98, speaker: 'SPEAKER_00' },
                      { word: 'combined', start: 22.2, end: 22.7, confidence: 0.98, speaker: 'SPEAKER_00' },
                      { word: 'with', start: 22.8, end: 23.0, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'Silero', start: 23.1, end: 23.6, confidence: 0.97, speaker: 'SPEAKER_00' },
                      { word: 'VAD,', start: 23.7, end: 24.1, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'we', start: 24.3, end: 24.4, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'cut', start: 24.5, end: 24.7, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'streaming', start: 24.8, end: 25.4, confidence: 0.98, speaker: 'SPEAKER_00' },
                      { word: 'interim', start: 25.5, end: 26.0, confidence: 0.96, speaker: 'SPEAKER_00' },
                      { word: 'results', start: 26.1, end: 26.5, confidence: 0.98, speaker: 'SPEAKER_00' },
                      { word: 'down', start: 26.6, end: 26.9, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'to', start: 27.0, end: 27.1, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'under', start: 27.2, end: 27.5, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'two', start: 27.6, end: 27.8, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'hundred', start: 27.9, end: 28.3, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'milliseconds.', start: 28.4, end: 29.8, confidence: 0.99, speaker: 'SPEAKER_00' }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  },
  {
    id: 'sample-podcast',
    title: 'AI Engineering Podcast: Voice Agents at Scale',
    category: 'Podcast',
    duration: 42.0,
    description: 'Technical deep-dive on Pipecat orchestration, WebRTC transport vs WebSocket, and interruption handling.',
    response: {
      metadata: {
        duration: 42.0,
        language: 'en',
        processing_time: 0.41,
        model: 'faster-whisper-large-v3',
        cost: 0.0028
      },
      results: {
        channels: [
          {
            alternatives: [
              {
                transcript: "Welcome back to AI Engineering. Today we are talking about full duplex voice agents. Why is Pipecat becoming the industry standard over traditional REST endpoints? Because handling barge-in interruptions cleanly requires frame-by-frame audio buffers and instant VAD endpointing.",
                segments: [
                  {
                    id: 'p-seg-1',
                    start: 0.5,
                    end: 7.8,
                    speaker: 'SPEAKER_00',
                    text: 'Welcome back to AI Engineering. Today we are talking about full duplex voice agents. Why is Pipecat becoming the industry standard over traditional REST endpoints?',
                    words: [
                      { word: 'Welcome', start: 0.5, end: 1.0, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'back', start: 1.1, end: 1.3, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'to', start: 1.4, end: 1.5, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'AI', start: 1.6, end: 1.9, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'Engineering.', start: 2.0, end: 2.7, confidence: 0.98, speaker: 'SPEAKER_00' },
                      { word: 'Today', start: 3.0, end: 3.4, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'we', start: 3.5, end: 3.6, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'are', start: 3.7, end: 3.8, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'talking', start: 3.9, end: 4.3, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'about', start: 4.4, end: 4.6, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'full', start: 4.7, end: 4.9, confidence: 0.98, speaker: 'SPEAKER_00' },
                      { word: 'duplex', start: 5.0, end: 5.4, confidence: 0.97, speaker: 'SPEAKER_00' },
                      { word: 'voice', start: 5.5, end: 5.8, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'agents.', start: 5.9, end: 6.4, confidence: 0.99, speaker: 'SPEAKER_00' }
                    ]
                  },
                  {
                    id: 'p-seg-2',
                    start: 8.2,
                    end: 18.5,
                    speaker: 'SPEAKER_01',
                    text: 'Because handling barge-in interruptions cleanly requires frame-by-frame audio buffers and instant VAD endpointing.',
                    words: [
                      { word: 'Because', start: 8.2, end: 8.6, confidence: 0.99, speaker: 'SPEAKER_01' },
                      { word: 'handling', start: 8.7, end: 9.2, confidence: 0.99, speaker: 'SPEAKER_01' },
                      { word: 'barge-in', start: 9.3, end: 9.9, confidence: 0.96, speaker: 'SPEAKER_01' },
                      { word: 'interruptions', start: 10.0, end: 10.8, confidence: 0.98, speaker: 'SPEAKER_01' },
                      { word: 'cleanly', start: 10.9, end: 11.4, confidence: 0.98, speaker: 'SPEAKER_01' },
                      { word: 'requires', start: 11.5, end: 12.0, confidence: 0.99, speaker: 'SPEAKER_01' },
                      { word: 'frame-by-frame', start: 12.1, end: 13.0, confidence: 0.97, speaker: 'SPEAKER_01' },
                      { word: 'audio', start: 13.1, end: 13.5, confidence: 0.99, speaker: 'SPEAKER_01' },
                      { word: 'buffers', start: 13.6, end: 14.1, confidence: 0.98, speaker: 'SPEAKER_01' },
                      { word: 'and', start: 14.2, end: 14.4, confidence: 0.99, speaker: 'SPEAKER_01' },
                      { word: 'instant', start: 14.5, end: 15.0, confidence: 0.99, speaker: 'SPEAKER_01' },
                      { word: 'VAD', start: 15.1, end: 15.4, confidence: 0.98, speaker: 'SPEAKER_01' },
                      { word: 'endpointing.', start: 15.5, end: 16.5, confidence: 0.99, speaker: 'SPEAKER_01' }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  },
  {
    id: 'sample-medical',
    title: 'Clinical Patient Intake & Dictation',
    category: 'Medical Dictation',
    duration: 25.0,
    description: 'High-accuracy medical terminology dictation testing Whisper large-v3 performance on specialized vocabulary.',
    response: {
      metadata: {
        duration: 25.0,
        language: 'en',
        processing_time: 0.22,
        model: 'faster-whisper-large-v3',
        cost: 0.0016
      },
      results: {
        channels: [
          {
            alternatives: [
              {
                transcript: "Patient presents with acute pharyngitis and mild lymphadenopathy. Prescribed amoxicillin 500mg twice daily for ten days. Recommended follow-up in one week if fever persists.",
                segments: [
                  {
                    id: 'm-seg-1',
                    start: 0.1,
                    end: 12.0,
                    speaker: 'SPEAKER_00',
                    text: 'Patient presents with acute pharyngitis and mild lymphadenopathy. Prescribed amoxicillin 500mg twice daily for ten days.',
                    words: [
                      { word: 'Patient', start: 0.1, end: 0.6, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'presents', start: 0.7, end: 1.2, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'with', start: 1.3, end: 1.5, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'acute', start: 1.6, end: 2.0, confidence: 0.98, speaker: 'SPEAKER_00' },
                      { word: 'pharyngitis', start: 2.1, end: 3.1, confidence: 0.96, speaker: 'SPEAKER_00' },
                      { word: 'and', start: 3.2, end: 3.4, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'mild', start: 3.5, end: 3.8, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'lymphadenopathy.', start: 3.9, end: 5.2, confidence: 0.95, speaker: 'SPEAKER_00' },
                      { word: 'Prescribed', start: 5.6, end: 6.3, confidence: 0.99, speaker: 'SPEAKER_00' },
                      { word: 'amoxicillin', start: 6.4, end: 7.2, confidence: 0.97, speaker: 'SPEAKER_00' },
                      { word: '500mg', start: 7.3, end: 8.0, confidence: 0.98, speaker: 'SPEAKER_00' }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  }
];

export const VOICE_LANDSCAPE_TOOLS: LandscapeTool[] = [
  // ASR Open Source
  {
    id: 'whisper-openai',
    name: 'Whisper (OpenAI)',
    category: 'ASR Open Source',
    type: 'Open Source',
    bestFor: 'Accuracy, 99+ languages baseline',
    notes: 'The baseline foundation model everyone compares against. Trained on 680,000 hours of multilingual speech.',
    latencyMs: 1200,
    wer: '3.8%',
    pricing: 'Free (MIT License)',
    stars: '68k⭐'
  },
  {
    id: 'faster-whisper',
    name: 'faster-whisper',
    category: 'ASR Open Source',
    type: 'Open Source',
    bestFor: 'Production speed & self-hosted GPU scaling',
    notes: 'Uses CTranslate2 backend, up to 4x faster than OpenAI Whisper with 50% less VRAM usage. The backbone of our Deepgram clone.',
    latencyMs: 180,
    wer: '3.8%',
    pricing: 'Free (MIT License)',
    stars: '14.2k⭐'
  },
  {
    id: 'whisperx',
    name: 'WhisperX',
    category: 'ASR Open Source',
    type: 'Open Source',
    bestFor: 'Precise phoneme word alignment + pyannote diarization',
    notes: 'Combines faster-whisper with wav2vec2 forced alignment and speaker diarization in a single optimized pass.',
    latencyMs: 320,
    wer: '3.6%',
    pricing: 'Free / BSD-2',
    stars: '11.8k⭐'
  },
  {
    id: 'whisper-cpp',
    name: 'whisper.cpp',
    category: 'ASR Open Source',
    type: 'Open Source',
    bestFor: 'Edge devices, CPU, Raspberry Pi, Mobile iOS/Android',
    notes: 'High-performance C/C++ implementation by Georgi Gerganov. Extremely low memory footprint.',
    latencyMs: 240,
    wer: '4.1%',
    pricing: 'Free (MIT)',
    stars: '34.5k⭐'
  },
  {
    id: 'distil-whisper',
    name: 'distil-whisper',
    category: 'ASR Open Source',
    type: 'Open Source',
    bestFor: 'Ultra-high speed execution (6x faster)',
    notes: 'Distilled 49% smaller model maintaining 99% of large-v3 accuracy on English datasets.',
    latencyMs: 95,
    wer: '4.2%',
    pricing: 'Free (MIT)',
    stars: '5.6k⭐'
  },
  {
    id: 'nvidia-nemo',
    name: 'NVIDIA NeMo (Parakeet/Canary)',
    category: 'ASR Open Source',
    type: 'Open Source',
    bestFor: 'Real-time streaming leaderboards (Parakeet-TDT)',
    notes: 'Tops OpenASR leaderboards. Parakeet-TDT uses Token-Duration Transducers for lightning-fast streaming decoding.',
    latencyMs: 85,
    wer: '2.9%',
    pricing: 'Free (Apache 2.0)',
    stars: '9.8k⭐'
  },
  {
    id: 'vosk',
    name: 'Vosk',
    category: 'ASR Open Source',
    type: 'Open Source',
    bestFor: 'Offline, lightweight embedded systems (20+ languages)',
    notes: 'Kaldi-based speech recognition toolkit with tiny 50MB models for offline hardware.',
    latencyMs: 150,
    wer: '8.5%',
    pricing: 'Free / Apache 2.0',
    stars: '7.3k⭐'
  },
  {
    id: 'moonshine',
    name: 'Moonshine',
    category: 'ASR Open Source',
    type: 'Open Source',
    bestFor: 'On-device tiny real-time transcription',
    notes: 'Optimized sequence-to-sequence model designed specifically for edge processing.',
    latencyMs: 110,
    wer: '5.4%',
    pricing: 'Free (MIT)',
    stars: '2.1k⭐'
  },

  // Commercial APIs
  {
    id: 'deepgram',
    name: 'Deepgram (Nova-3)',
    category: 'ASR Commercial',
    type: 'Commercial',
    bestFor: 'Fast streaming API & cost efficiency (~$0.0043/min)',
    notes: 'Proprietary Transformer architecture built specifically for speech. Industry benchmark for WebSocket real-time speed.',
    latencyMs: 130,
    wer: '3.5%',
    pricing: '$0.0043 / min'
  },
  {
    id: 'assemblyai',
    name: 'AssemblyAI (Universal-2)',
    category: 'ASR Commercial',
    type: 'Commercial',
    bestFor: 'Audio intelligence (Sentiment, PII redaction, Chapters)',
    notes: 'Strong accuracy and rich post-processing features including LLM-powered summarization and LeMUR.',
    latencyMs: 250,
    wer: '3.4%',
    pricing: '$0.0063 / min'
  },
  {
    id: 'openai-asr-api',
    name: 'OpenAI Whisper API / gpt-4o-transcribe',
    category: 'ASR Commercial',
    type: 'Commercial',
    bestFor: 'Ease of integration inside OpenAI ecosystem',
    notes: 'Standard hosted Whisper model. Reliable but higher latency than specialized streaming APIs.',
    latencyMs: 600,
    wer: '3.8%',
    pricing: '$0.0060 / min'
  },

  // TTS Open Source
  {
    id: 'coqui-xtts',
    name: 'Coqui TTS / XTTS-v2',
    category: 'TTS Open Source',
    type: 'Open Source',
    bestFor: 'Voice cloning from 6s sample across 17 languages',
    notes: 'The community darling for expressive zero-shot voice cloning. Amazing emotion retention.',
    latencyMs: 380,
    pricing: 'Free / CPML',
    stars: '31k⭐'
  },
  {
    id: 'piper-tts',
    name: 'Piper TTS',
    category: 'TTS Open Source',
    type: 'Open Source',
    bestFor: 'Ultra-fast lightweight edge execution (Raspberry Pi)',
    notes: 'VITS neural synthesizer optimized for real-time speech generation on low-end CPUs.',
    latencyMs: 65,
    pricing: 'Free (MIT)',
    stars: '8.4k⭐'
  },
  {
    id: 'kokoro',
    name: 'Kokoro (82M)',
    category: 'TTS Open Source',
    type: 'Open Source',
    bestFor: 'Tiny parameter footprint with surprisingly human quality',
    notes: 'Breakthrough 82M parameter model that rivals commercial TTS engines while running at 30x real-time.',
    latencyMs: 90,
    pricing: 'Free (Apache 2.0)',
    stars: '9.2k⭐'
  },
  {
    id: 'f5-tts',
    name: 'F5-TTS',
    category: 'TTS Open Source',
    type: 'Open Source',
    bestFor: 'Fast flow-matching zero-shot voice cloning',
    notes: 'Non-autoregressive flow matching model eliminating word repetition and skipping issues.',
    latencyMs: 140,
    pricing: 'Free (MIT)',
    stars: '11.5k⭐'
  },

  // TTS Commercial
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    category: 'TTS Commercial',
    type: 'Commercial',
    bestFor: 'Market leader in hyper-realistic cloning & emotional delivery',
    notes: 'Standard for content creation and high-end voice agents. Turbo v2.5 offers ~180ms latency.',
    latencyMs: 180,
    pricing: '$0.18 / 1k chars'
  },
  {
    id: 'cartesia',
    name: 'Cartesia (Sonic)',
    category: 'TTS Commercial',
    type: 'Commercial',
    bestFor: 'Ultra-low latency (~90ms) built specifically for voice agents',
    notes: 'State-space model (SSM) architecture delivering natural voice at conversational lightning speed.',
    latencyMs: 90,
    pricing: '$0.05 / 1k chars'
  },

  // VAD & Diarization
  {
    id: 'silero-vad',
    name: 'Silero VAD',
    category: 'VAD & Diarization',
    type: 'Open Source',
    bestFor: 'The industry gold standard for Voice Activity Detection',
    notes: 'Tiny (~1MB), executes in <1ms on CPU. Used in almost every production agent pipeline for endpointing.',
    latencyMs: 8,
    pricing: 'Free (MIT)',
    stars: '5.9k⭐'
  },
  {
    id: 'pyannote-audio',
    name: 'pyannote.audio',
    category: 'VAD & Diarization',
    type: 'Open Source',
    bestFor: 'Speaker diarization ("Who spoke when")',
    notes: 'Neural speaker segmentation and clustering pipeline. Integrates directly into our Deepgram backend.',
    latencyMs: 450,
    pricing: 'Free / MIT',
    stars: '7.1k⭐'
  },

  // Agent Frameworks
  {
    id: 'pipecat',
    name: 'Pipecat (by Daily)',
    category: 'Agent Frameworks',
    type: 'Open Source',
    bestFor: 'Leading Python framework for real-time voice agent pipelines',
    notes: 'Handles frame-by-frame audio buffers, barge-in interruptions, WebRTC/Twilio transport, and multi-model streaming.',
    latencyMs: 15,
    pricing: 'Free (Apache 2.0)',
    stars: '6.4k⭐'
  },
  {
    id: 'livekit-agents',
    name: 'LiveKit Agents',
    category: 'Agent Frameworks',
    type: 'Open Source',
    bestFor: 'WebRTC-native orchestration powering OpenAI Advanced Voice Mode',
    notes: 'Robust SFU audio routing with built-in agent plugins for STT, LLM, and TTS providers.',
    latencyMs: 20,
    pricing: 'Free / Cloud Tier',
    stars: '5.1k⭐'
  },
  {
    id: 'vapi-ai',
    name: 'Vapi AI',
    category: 'Agent Frameworks',
    type: 'Commercial',
    bestFor: 'Plug-and-play developer voice agent infrastructure',
    notes: 'Managed orchestration layer handling telephony connections, latency optimization, and function calling.',
    pricing: '$0.05 / min + vendor fees'
  },

  // Telephony & Transport
  {
    id: 'twilio-media',
    name: 'Twilio Media Streams',
    category: 'Telephony & Transport',
    type: 'Commercial',
    bestFor: 'Raw bi-directional audio streaming over WebSocket from phone calls',
    notes: 'Delivers 8kHz mulaw audio frames every 20ms to your FastAPI/Pipecat server.',
    pricing: '$0.0085 / min'
  }
];

export const VOICE_TTS_MODELS: VoiceModelTTS[] = [
  {
    id: 'cartesia-sonic-en',
    name: 'Sonic Conversational Fast (English)',
    provider: 'Cartesia',
    latency: '88ms',
    type: 'Ultra-Low Latency',
    sampleRate: 24000,
    description: 'State-space SSM model engineered specifically for zero-delay human barge-in voice agents.'
  },
  {
    id: 'elevenlabs-turbo-v2.5',
    name: 'Turbo v2.5 Natural Pro',
    provider: 'ElevenLabs',
    latency: '175ms',
    type: 'Expressive Neural',
    sampleRate: 44100,
    description: 'Rich inflection, realistic breath pauses, and lifelike emotional resonance.'
  },
  {
    id: 'kokoro-v0.19',
    name: 'Kokoro 82M Fast Neural',
    provider: 'Open Source (Self-Hosted)',
    latency: '95ms',
    type: 'Edge CPU',
    sampleRate: 24000,
    description: 'Incredible 82M open-source model running on our self-hosted GPU worker pool.'
  },
  {
    id: 'f5-tts-zero',
    name: 'F5 Flow-Matching Zero-Shot',
    provider: 'Open Source',
    latency: '140ms',
    type: 'Zero-Shot Cloning',
    sampleRate: 24000,
    description: 'Instant voice replication with zero acoustic degradation or word skipping.'
  }
];

export const VOICE_AGENTS_PRESETS: VoiceAgentConfig[] = [
  {
    id: 'agent-support',
    name: 'SaaS Technical Concierge (Elena)',
    persona: 'Helpful, concise senior engineer who answers voice API integration questions.',
    systemPrompt: 'You are Elena, a voice AI systems architect. You respond politely in 1 to 2 short sentences optimized for voice synthesis. You explain WebSockets, faster-whisper, and Silero VAD.',
    asrProvider: 'Self-Hosted faster-whisper (Large-v3)',
    llmProvider: 'GPT-4o Mini Stream',
    ttsProvider: 'Cartesia Sonic (90ms)',
    vadThreshold: 0.015,
    interruptionBargeIn: true
  },
  {
    id: 'agent-sdr',
    name: 'Inbound Sales Representative (Marcus)',
    persona: 'Energetic, consultative sales specialist who qualifies inbound enterprise leads.',
    systemPrompt: 'You are Marcus. Ask the caller about their current transcription volume and latency pain points. Offer to set up a live benchmark comparison.',
    asrProvider: 'Deepgram Nova-3 API',
    llmProvider: 'Claude 3.5 Sonnet',
    ttsProvider: 'ElevenLabs Turbo v2.5',
    vadThreshold: 0.02,
    interruptionBargeIn: true
  },
  {
    id: 'agent-medical',
    name: 'Clinical Patient Intake Specialist (Dr. Maya)',
    persona: 'Calm, empathetic clinical assistant gathering patient symptoms and allergy histories.',
    systemPrompt: 'You are Dr. Maya. Verify patient symptoms with high precision, confirm dosages, and summarize findings clearly.',
    asrProvider: 'NVIDIA NeMo Parakeet-TDT',
    llmProvider: 'GPT-4o Medical Fine-Tuned',
    ttsProvider: 'Kokoro 82M Self-Hosted',
    vadThreshold: 0.01,
    interruptionBargeIn: false
  }
];

export const MOCK_GPU_WORKERS: GPUWorker[] = [
  {
    id: 'worker-us-east-1a',
    name: 'gpu-node-faster-whisper-01',
    gpuType: 'NVIDIA A10G (24GB)',
    status: 'Processing',
    currentLoad: 78,
    activeJobs: 14,
    modelLoaded: 'faster-whisper-large-v3 (FP16)',
    memoryUsedGb: 14.2,
    memoryTotalGb: 24.0
  },
  {
    id: 'worker-us-east-1b',
    name: 'gpu-node-faster-whisper-02',
    gpuType: 'NVIDIA A10G (24GB)',
    status: 'Processing',
    currentLoad: 64,
    activeJobs: 11,
    modelLoaded: 'faster-whisper-large-v3 (FP16)',
    memoryUsedGb: 13.8,
    memoryTotalGb: 24.0
  },
  {
    id: 'worker-eu-west-01',
    name: 'gpu-node-diarize-pyannote',
    gpuType: 'NVIDIA L4 (24GB)',
    status: 'Idle',
    currentLoad: 12,
    activeJobs: 2,
    modelLoaded: 'pyannote/speaker-diarization-3.1',
    memoryUsedGb: 6.5,
    memoryTotalGb: 24.0
  },
  {
    id: 'worker-edge-tts-01',
    name: 'gpu-node-kokoro-tts',
    gpuType: 'NVIDIA T4 (16GB)',
    status: 'Processing',
    currentLoad: 45,
    activeJobs: 8,
    modelLoaded: 'Kokoro-82M + F5-TTS',
    memoryUsedGb: 8.1,
    memoryTotalGb: 16.0
  }
];

export const MOCK_API_KEYS: APIKeyRecord[] = [
  {
    id: 'key-1',
    name: 'Production Voice Agent Pipeline (Pipecat)',
    prefix: 'vk_live_9a8d7...41b',
    created: '2025-01-14',
    lastUsed: 'Just now',
    usageMinutes: 4281.5,
    active: true
  },
  {
    id: 'key-2',
    name: 'Staging Call Center Recorder WebSocket',
    prefix: 'vk_test_22f1c...89e',
    created: '2025-02-01',
    lastUsed: '12 minutes ago',
    usageMinutes: 894.2,
    active: true
  },
  {
    id: 'key-3',
    name: 'Legacy Mobile App Audio Collector',
    prefix: 'vk_live_33b8a...11a',
    created: '2024-11-20',
    lastUsed: '5 days ago',
    usageMinutes: 1240.0,
    active: false
  }
];
