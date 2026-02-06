# Quick Start: Gemini Voice-to-Text

## Setup (30 seconds)

1. **Get API Key**: Visit https://aistudio.google.com/apikey
2. **Add to .env**:
   ```bash
   echo "VITE_GEMINI_API_KEY=your_key_here" >> .env
   ```
3. **Restart dev server**: `npm run dev`

## Usage

1. Go to **Practice Mode** (Review Page)
2. Click the **microphone button** 🎤
3. Speak your answer
4. Click **stop** when done
5. Transcription appears automatically

## Visual Indicators

- **"Gemini AI" badge** = Using Gemini transcription ✅
- **No badge** = Using browser API (fallback)
- **Pulsing red button** = Currently recording

## Files to Check

- `src/lib/geminiAudio.ts` - Transcription logic
- `src/hooks/useGeminiSpeechRecognition.ts` - React hook
- `src/pages/ReviewPage.tsx` - UI integration
- `GEMINI_AUDIO_README.md` - Full documentation

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No "Gemini AI" badge | Check `.env` has `VITE_GEMINI_API_KEY` |
| "API key not configured" | Restart dev server after adding key |
| Transcription fails | Verify API key at https://aistudio.google.com/ |

## What's Different from Browser API?

✅ **Better**: More accurate, works everywhere, 24+ languages  
✅ **Same UX**: No user-facing changes  
✅ **Smart fallback**: Uses browser API if Gemini unavailable  

## Advanced: Real-Time Streaming

For sub-second latency (like ChatGPT Voice):
- Requires backend server (WebSocket)
- See `GEMINI_AUDIO_README.md` for implementation guide
- Uses `gemini-2.5-flash-native-audio-preview-12-2025`

---

**Note**: Current implementation sends complete recordings. For production, consider implementing the Live API backend for real-time streaming.
