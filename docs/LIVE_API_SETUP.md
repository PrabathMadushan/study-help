# Gemini Live API Integration - Installation & Setup

## 🚀 Quick Start

### 1. Install Required Package

The Gemini Live API requires the **`@google/genai`** SDK (not `@google/generative-ai`):

```bash
npm install @google/genai
```

**Important**: This is a different package from `@google/generative-ai`. The Live API is only available in `@google/genai`.

### 2. Verify Your API Key

Make sure your `.env` file has:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

Get your key at: https://aistudio.google.com/apikey

### 3. Restart Dev Server

```bash
npm run dev
```

## ✅ What Changed

The `geminiAudio.ts` file has been completely rewritten to use:

### Old Implementation (HTTP/REST)
- ❌ Used `generateContent()` with HTTP fetch
- ❌ Uploaded complete audio files
- ❌ High latency (seconds)
- ❌ No real-time feedback

### New Implementation (WebSocket/Live API)
- ✅ Uses `live.connect()` with WebSocket
- ✅ Streams audio in real-time (16-bit PCM, 16kHz)
- ✅ Sub-second latency
- ✅ Real-time transcription
- ✅ Barge-in support (interruptions)
- ✅ Voice Activity Detection (VAD)

## 🎯 Key Features

### 1. Bi-Directional Streaming
```typescript
// Sends audio to Gemini in real-time
session.sendRealtimeInput({
  audio: {
    data: base64Audio,
    mimeType: 'audio/pcm;rate=16000'
  }
})

// Receives responses in real-time
for await (const message of session.receive()) {
  // Process transcriptions, audio, interruptions
}
```

### 2. Audio Format Handling
- **Input**: 16-bit PCM, 16kHz (mono)
- **Output**: 24kHz PCM (if using audio responses)
- Automatic conversion from browser's Float32 to Int16 PCM

### 3. Barge-in Support
```typescript
if (message.serverContent?.interrupted) {
  // User interrupted - stop playback
  console.log('User is speaking, stopping AI response')
}
```

### 4. Input Transcription
```typescript
if (message.serverContent?.inputTranscription) {
  const transcript = message.serverContent.inputTranscription.text
  // Real-time text as user speaks
}
```

## 📋 API Reference

### GeminiLiveAudioTranscriber

The new main class for Live API streaming.

#### Methods

```typescript
// Check if Live API is available
isAvailable(): boolean

// Start real-time streaming session
async startStreaming(
  stream: MediaStream, 
  onTranscript: (transcript: string) => void
): Promise<void>

// Stop streaming and get final transcript
async stopStreaming(): Promise<string>

// Get current streaming state
getStreamingState(): boolean

// Get accumulated transcript
getTranscript(): string
```

### GeminiAudioTranscriber (Legacy)

Wrapper for backward compatibility with existing code.

```typescript
// Works with existing code
const transcriber = new GeminiAudioTranscriber()
await transcriber.startRecording(stream, onTranscript)
await transcriber.stopRecording()
```

## 🔧 Configuration

### Model Configuration

```typescript
const config = {
  model: 'gemini-2.5-flash-native-audio-preview-12-2025',
  config: {
    responseModalities: [Modality.AUDIO],
    inputAudioTranscription: {},  // Enable transcription
    outputAudioTranscription: {}, // Enable AI response transcription
  },
}
```

### Audio Processing

The implementation handles:
- ✅ Sample rate conversion (browser → 16kHz)
- ✅ Format conversion (Float32 → Int16 PCM)
- ✅ Base64 encoding for transmission
- ✅ Chunked streaming (4096 samples per chunk)

## 🐛 Troubleshooting

### Error: "Cannot find module '@google/genai'"

**Solution**: Install the correct package
```bash
npm install @google/genai
```

### Error: "404 Not Found" or "Method not supported"

**Cause**: Trying to use `generateContent()` with native audio model

**Solution**: The new implementation uses `live.connect()` - this is already fixed in the rewritten code.

### Error: "AudioContext is not defined"

**Cause**: Running in non-browser environment

**Solution**: This implementation requires a browser. For Node.js, use server-side implementation.

### Distorted or Garbled Audio

**Cause**: Wrong sample rate

**Solution**: Ensure:
- Input: 16kHz (automatically handled by `AudioContext({ sampleRate: 16000 })`)
- Output: 24kHz (if processing audio responses)

### No Transcription Appearing

**Check**:
1. API key is valid
2. Microphone permissions granted
3. Browser console for errors
4. Network tab for WebSocket connection

## 🎓 Usage Example

```typescript
import { GeminiLiveAudioTranscriber } from './lib/geminiAudio'

// Create transcriber
const transcriber = new GeminiLiveAudioTranscriber()

// Get microphone
const stream = await navigator.mediaDevices.getUserMedia({ 
  audio: {
    channelCount: 1,
    sampleRate: 16000,
    echoCancellation: true,
    noiseSuppression: true,
  } 
})

// Start streaming
await transcriber.startStreaming(stream, (transcript) => {
  console.log('Transcript:', transcript)
  // Update UI with transcript
})

// Later... stop streaming
const finalTranscript = await transcriber.stopStreaming()
console.log('Final:', finalTranscript)
```

## 📊 Performance

### Latency Comparison

| Method | Latency | Real-time |
|--------|---------|-----------|
| Old (HTTP) | 2-5 seconds | ❌ No |
| New (WebSocket) | < 1 second | ✅ Yes |

### Network Usage

- **Old**: Uploads entire audio file at once
- **New**: Streams ~64 KB/sec (16kHz, 16-bit PCM)

## 🔐 Security Notes

**Browser-Side Live API**:
- ⚠️ Exposes API key in client code
- ✅ Acceptable for demos/prototypes
- ⚠️ Not recommended for production

**Production Recommendation**:
- Implement WebSocket proxy server
- Keep API key on server
- Use server-to-server Live API connection
- See `GEMINI_AUDIO_README.md` for server implementation

## 📚 Additional Resources

- [Gemini Live API Docs](https://ai.google.dev/gemini-api/docs/live-guide)
- [Audio Transcription Guide](https://ai.google.dev/gemini-api/docs/live-guide#audio-transcriptions)
- [@google/genai SDK Reference](https://googleapis.github.io/js-genai/)
- [Native Audio Capabilities](https://ai.google.dev/gemini-api/docs/live-guide#native-audio-capabilities)

## 🎉 Benefits

1. **Real-time Feedback**: See transcription as you speak
2. **Better UX**: No waiting for upload/processing
3. **Natural Conversations**: Barge-in support for dialog
4. **Scalable**: WebSocket more efficient than repeated HTTP
5. **Future-Ready**: Access to emotion-aware dialogue, proactive audio, etc.

---

**Next Steps**: After installing `@google/genai`, restart your dev server and test the voice input in Practice Mode!
