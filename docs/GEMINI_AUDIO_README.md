# Gemini Audio Transcription Integration

This project now supports voice-to-text transcription using **Gemini 2.5 Flash** instead of the browser's Speech Recognition API.

## Features

- **AI-Powered Transcription**: Uses Google's Gemini 2.5 Flash for accurate audio transcription
- **Better Accuracy**: More accurate than browser-based speech recognition
- **Visual Indicator**: Shows "Gemini AI" badge when Gemini transcription is active
- **Fallback Support**: Automatically falls back to browser API if Gemini is not configured

## Current Implementation

The current implementation uses Gemini's standard API with audio file transcription. This approach:

1. Records audio using the browser's MediaRecorder API
2. Sends complete audio segments to Gemini for transcription
3. Updates the answer field with transcribed text

### Why Not Live API?

Gemini's **Live API** (for real-time streaming transcription) requires WebSocket connections and is designed for **server-to-server** communication. It cannot be used directly from the browser for security reasons.

## Setup

1. **Get Gemini API Key**:
   - Visit [Google AI Studio](https://aistudio.google.com/apikey)
   - Create a new API key

2. **Add to Environment**:
   - Add your API key to `.env` file:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

3. **Install Dependencies** (if not already installed):
   ```bash
   npm install @google/generative-ai
   ```

## Usage

The voice input button in the Practice Mode (Review Page) now automatically uses Gemini transcription when configured. Look for the "Gemini AI" badge next to the microphone button.

## Upgrading to Live API (Optional)

For real-time streaming transcription with sub-second latency, you need to implement a backend server:

### Architecture

```
Browser → WebSocket → Your Server → Gemini Live API
```

### Backend Setup (Node.js Example)

1. **Install dependencies**:
```bash
npm install @google/generative-ai ws
```

2. **Create WebSocket server** (`server.js`):
```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';
import { WebSocketServer } from 'ws';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', async (ws) => {
  // Connect to Gemini Live API
  const session = await genAI.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    config: {
      responseModalities: ['TEXT'],
      inputAudioTranscription: {}
    }
  });

  // Handle audio from browser
  ws.on('message', async (audioData) => {
    // Forward to Gemini
    await session.sendRealtimeInput({
      audio: {
        data: audioData.toString('base64'),
        mimeType: 'audio/pcm;rate=16000'
      }
    });
  });

  // Handle transcription from Gemini
  for await (const message of session.receive()) {
    if (message.serverContent?.inputTranscription) {
      // Send to browser
      ws.send(JSON.stringify({
        transcript: message.serverContent.inputTranscription.text
      }));
    }
  }
});
```

3. **Update frontend** to use WebSocket instead of MediaRecorder

### Alternative: Python Backend

```python
import asyncio
import websockets
from google import genai

client = genai.Client(api_key=os.environ['GEMINI_API_KEY'])

async def handle_audio(websocket):
    config = {
        'response_modalities': ['TEXT'],
        'input_audio_transcription': {}
    }
    
    async with client.aio.live.connect(
        model='gemini-2.5-flash-native-audio-preview-12-2025',
        config=config
    ) as session:
        async for message in websocket:
            # Forward audio to Gemini
            await session.send_realtime_input(
                audio=genai.types.Blob(
                    data=message,
                    mime_type='audio/pcm;rate=16000'
                )
            )
            
            # Get transcription
            async for response in session.receive():
                if response.server_content.input_transcription:
                    await websocket.send(
                        response.server_content.input_transcription.text
                    )

asyncio.run(websockets.serve(handle_audio, 'localhost', 8080))
```

## Audio Format Requirements

Gemini Live API expects:
- **Format**: Raw PCM, little-endian, 16-bit
- **Input Sample Rate**: 16kHz (natively), but can resample other rates
- **Output Sample Rate**: 24kHz
- **Channels**: Mono

## Model Details

- **Model**: `gemini-2.5-flash` (stable, supports audio/video/image)
- **Alternative**: `gemini-2.0-flash` or `gemini-flash-latest`
- **For Live Streaming**: `gemini-2.5-flash-native-audio-preview-12-2025` (requires backend)
- **Context Window**: 1M tokens for Gemini 2.5 Flash
- **Session Duration**: 15 minutes for audio-only sessions (Live API)

## Supported Languages

Gemini supports 24+ languages including:
- English (US, UK, Australia, India)
- Spanish, French, German, Italian
- Japanese, Korean, Chinese
- Hindi, Bengali, Tamil, Telugu
- Arabic, Turkish, Vietnamese
- And more...

## Resources

- [Gemini Live API Documentation](https://ai.google.dev/gemini-api/docs/live-guide)
- [Audio Transcription Guide](https://ai.google.dev/gemini-api/docs/live-guide#audio-transcriptions)
- [Google AI Studio](https://aistudio.google.com/)
- [Gemini API Cookbook](https://github.com/google-gemini/cookbook)

## Troubleshooting

**"API key not configured"**
- Make sure `VITE_GEMINI_API_KEY` is set in your `.env` file
- Restart the development server after adding the key

**"Transcription failed"**
- Check your API key is valid
- Ensure you have quota remaining in Google AI Studio
- Check browser console for detailed error messages

**No "Gemini AI" badge showing**
- The app falls back to browser API if Gemini key is not configured
- Check that `.env` file is in the project root

## Future Enhancements

- [ ] Implement WebSocket server for Live API
- [ ] Add real-time streaming transcription
- [ ] Support multiple languages
- [ ] Add voice activity detection (VAD)
- [ ] Enable emotion-aware dialogue
- [ ] Add audio playback with Gemini TTS
