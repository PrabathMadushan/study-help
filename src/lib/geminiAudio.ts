import { GoogleGenAI, Modality } from '@google/genai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY

export interface AudioTranscriptionResult {
  transcript: string
  error?: string
}

/**
 * Real-time audio transcription using Gemini 2.5 Flash Native Audio Live API
 * 
 * This implementation uses WebSocket-based bi-directional streaming for:
 * - Sub-second latency transcription
 * - Native audio input/output (16kHz input, 24kHz output)
 * - Voice Activity Detection (VAD)
 * - Barge-in support (interruption handling)
 * 
 * Protocol: Uses live.connect() with WebSockets, NOT generateContent()
 */
export class GeminiLiveAudioTranscriber {
  private session: any = null
  private audioContext: AudioContext | null = null
  private isStreaming = false
  private onTranscriptCallback: ((transcript: string) => void) | null = null
  private accumulatedTranscript = ''
  private mediaStream: MediaStream | null = null

  /**
   * Check if Live API is available
   */
  isAvailable(): boolean {
    return !!apiKey?.trim() && typeof AudioContext !== 'undefined'
  }

  /**
   * Start real-time audio streaming session
   * @param stream - MediaStream from getUserMedia
   * @param onTranscript - Callback for transcription updates
   */
  async startStreaming(stream: MediaStream, onTranscript: (transcript: string) => void): Promise<void> {
    if (!apiKey?.trim()) {
      throw new Error('Gemini API not configured. Set VITE_GEMINI_API_KEY in .env')
    }

    if (this.isStreaming) {
      console.warn('Streaming already in progress')
      return
    }

    this.onTranscriptCallback = onTranscript
    this.accumulatedTranscript = ''
    this.isStreaming = true
    this.mediaStream = stream

    try {
      // Initialize Gemini Live API client
      const ai = new GoogleGenAI({ apiKey: apiKey! })

      // Configure session for native audio with transcription
      const self = this
      const connectConfig = {
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {}, // Enable input transcription
          outputAudioTranscription: {}, // Enable output transcription
        },
        callbacks: {
          onopen: () => console.log('✅ WebSocket opened'),
          onclose: (event: any) => console.log('🔌 WebSocket closed:', event.reason),
          onerror: (error: any) => console.error('❌ WebSocket error:', error),
          onmessage: (message: any) => {
            // Handle incoming messages here
            self.handleServerMessage(message)
          },
        },
      }

      console.log('🔌 Connecting to Gemini Live API...')

      // Establish WebSocket connection
      this.session = await ai.live.connect(connectConfig)

      console.log('✅ Connected to Gemini Live API')

      // Start streaming microphone audio
      await this.startAudioStreaming(stream)

    } catch (error) {
      this.isStreaming = false
      console.error('Failed to start Gemini Live API:', error)
      throw error
    }
  }

  /**
   * Set up audio streaming from microphone to Gemini
   * Converts audio to 16-bit PCM at 16kHz as required by Gemini
   */
  private async startAudioStreaming(stream: MediaStream): Promise<void> {
    try {
      // Create AudioContext for processing
      this.audioContext = new AudioContext({ sampleRate: 16000 })
      
      // Create media stream source
      const source = this.audioContext.createMediaStreamSource(stream)

      // Create ScriptProcessor for audio processing
      // Note: AudioWorklet would be better but ScriptProcessor is simpler for this demo
      const processor = this.audioContext.createScriptProcessor(4096, 1, 1)

      processor.onaudioprocess = (event) => {
        if (!this.isStreaming || !this.session) return

        const inputData = event.inputBuffer.getChannelData(0)
        
        // Convert Float32Array to 16-bit PCM
        const pcmData = this.float32To16BitPCM(inputData)
        
        // Convert to base64 for transmission
        const base64Audio = this.arrayBufferToBase64(pcmData.buffer as ArrayBuffer)

        // Send audio chunk to Gemini
        try {
          this.session.sendRealtimeInput({
            audio: {
              data: base64Audio,
              mimeType: 'audio/pcm;rate=16000'
            }
          })
        } catch (err) {
          console.error('Error sending audio:', err)
        }
      }

      // Connect nodes
      source.connect(processor)
      processor.connect(this.audioContext.destination)

      console.log('🎤 Microphone streaming started (16kHz PCM)')

    } catch (error) {
      console.error('Error setting up audio streaming:', error)
      throw error
    }
  }

  /**
   * Handle incoming messages from Gemini server
   */
  private handleServerMessage(message: any): void {
    try {
      // Handle input transcription (what user said)
      if (message.serverContent?.inputTranscription) {
        const transcript = message.serverContent.inputTranscription.text
        console.log('📝 User said:', transcript)
        
        this.accumulatedTranscript += transcript + ' '
        
        if (this.onTranscriptCallback) {
          this.onTranscriptCallback(this.accumulatedTranscript.trim())
        }
      }

      // Handle output transcription (what Gemini responded)
      if (message.serverContent?.outputTranscription) {
        const response = message.serverContent.outputTranscription.text
        console.log('🤖 Gemini responded:', response)
      }

      // Handle audio output (24kHz PCM)
      if (message.serverContent?.modelTurn?.parts) {
        for (const part of message.serverContent.modelTurn.parts) {
          if (part.inlineData?.mimeType?.includes('audio')) {
            console.log('🔊 Received audio response from Gemini')
            // Here you would decode and play the audio if needed
            // For transcription-only, we can ignore the audio output
          }
        }
      }

      // Handle interruption (barge-in)
      if (message.serverContent?.interrupted) {
        console.log('⚠️ Interrupted by user (barge-in)')
        // Stop any audio playback if implemented
        // This allows seamless conversation flow
      }

      // Handle turn completion
      if (message.serverContent?.turnComplete) {
        console.log('✓ Turn complete')
      }
    } catch (error) {
      console.error('Error handling server message:', error)
    }
  }

  /**
   * Stop streaming session
   */
  async stopStreaming(): Promise<string> {
    if (!this.isStreaming) {
      return this.accumulatedTranscript
    }

    console.log('🛑 Stopping Gemini Live API session...')

    this.isStreaming = false

    try {
      // Signal end of audio stream
      if (this.session) {
        try {
          this.session.sendRealtimeInput({ audioStreamEnd: true })
        } catch (err) {
          console.error('Error sending audio stream end:', err)
        }
        this.session.close()
        this.session = null
      }

      // Clean up audio context
      if (this.audioContext) {
        await this.audioContext.close()
        this.audioContext = null
      }

      // Stop media tracks
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(track => track.stop())
        this.mediaStream = null
      }

    } catch (error) {
      console.error('Error stopping session:', error)
    }

    const finalTranscript = this.accumulatedTranscript
    this.accumulatedTranscript = ''
    this.onTranscriptCallback = null

    console.log('✅ Session stopped')
    return finalTranscript
  }

  /**
   * Convert Float32Array audio to 16-bit PCM
   */
  private float32To16BitPCM(float32Array: Float32Array): Int16Array {
    const int16Array = new Int16Array(float32Array.length)
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]))
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff
    }
    return int16Array
  }

  /**
   * Convert ArrayBuffer to base64 string
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  /**
   * Get current streaming state
   */
  getStreamingState(): boolean {
    return this.isStreaming
  }

  /**
   * Get accumulated transcript
   */
  getTranscript(): string {
    return this.accumulatedTranscript
  }
}

/**
 * Legacy class for backward compatibility
 * Wraps the new Live API implementation
 */
export class GeminiAudioTranscriber {
  private liveTranscriber: GeminiLiveAudioTranscriber

  constructor() {
    this.liveTranscriber = new GeminiLiveAudioTranscriber()
  }

  isAvailable(): boolean {
    return this.liveTranscriber.isAvailable()
  }

  async startRecording(stream: MediaStream, onTranscript: (transcript: string) => void): Promise<void> {
    return this.liveTranscriber.startStreaming(stream, onTranscript)
  }

  async stopRecording(): Promise<void> {
    await this.liveTranscriber.stopStreaming()
  }

  getRecordingState(): boolean {
    return this.liveTranscriber.getStreamingState()
  }
}

/**
 * Create a new Gemini Live API audio transcriber
 */
export function createGeminiTranscriber() {
  return new GeminiLiveAudioTranscriber()
}

