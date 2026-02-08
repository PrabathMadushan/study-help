# Gemini Models Reference - Audio Transcription

## ✅ Recommended Models (as of Feb 2026)

### For Audio Transcription (Current Implementation)

**Best Choice: `gemini-2.5-flash`**
- ✅ Stable version (June 2025 release)
- ✅ 1M token context window
- ✅ Supports audio, video, images
- ✅ Cost-effective
- ✅ Fast response time

**Alternative: `gemini-2.0-flash`**
- ✅ Also stable
- ✅ 1M token context
- ✅ Good for audio transcription
- Slightly older than 2.5

**Premium: `gemini-2.5-pro`**
- ✅ Higher quality
- ✅ More accurate transcription
- ⚠️ Higher cost
- ✅ 1M token context

### For Real-Time Streaming (Requires Backend)

**`gemini-2.5-flash-native-audio-preview-12-2025`**
- ✅ Sub-second latency
- ✅ Voice Activity Detection
- ✅ Emotion-aware dialogue
- ⚠️ Only available via Live API (WebSocket)
- ⚠️ Requires server-side implementation

## 📊 Model Comparison

| Model | Input Tokens | Output Tokens | Best For | Availability |
|-------|--------------|---------------|----------|--------------|
| `gemini-2.5-flash` | 1,048,576 | 65,536 | Audio transcription | ✅ Stable |
| `gemini-2.5-pro` | 1,048,576 | 65,536 | High accuracy | ✅ Stable |
| `gemini-2.0-flash` | 1,048,576 | 8,192 | General use | ✅ Stable |
| `gemini-flash-latest` | 1,048,576 | 65,536 | Always latest | ✅ Auto-updated |
| Native Audio | 131,072 | 8,192 | Real-time streaming | ⚠️ Preview only |

## 💡 Usage Examples

### Current Implementation (Audio File Upload)

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(apiKey)
const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.5-flash'  // ← Best choice
})

// Transcribe audio
const result = await model.generateContent([
  {
    inlineData: {
      mimeType: 'audio/webm',
      data: base64AudioData
    }
  },
  { text: 'Please transcribe this audio accurately.' }
])

const transcript = result.response.text()
```

### For Better Accuracy

```typescript
const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.5-pro'  // ← Higher quality
})
```

### Always Use Latest

```typescript
const model = genAI.getGenerativeModel({ 
  model: 'gemini-flash-latest'  // ← Auto-updates to newest
})
```

## 🚫 Models NOT Available

These models DON'T exist or don't support audio:
- ❌ `gemini-1.5-flash` - Not in current API
- ❌ `gemini-2.0-flash-exp` - Not available
- ❌ `gemini-1.5-pro` - Not in current API

## 🔧 List Available Models

Run this script to see all current models:

```bash
node list-models-rest.js
```

Or in your code:

```typescript
import { listGeminiModels } from './src/lib/listModels'
await listGeminiModels()
```

## 📝 Notes

1. **Model names change**: Google regularly updates models. Use the list script to check current availability.

2. **`-latest` models**: Auto-update to newest versions, good for always having latest features.

3. **Preview models**: May change or be removed. Use stable versions for production.

4. **Context windows**: Larger context = more audio can be processed at once.

5. **Native Audio models**: Only work with Live API (bidiGenerateContent), not generateContent.

## 🔄 Migration Guide

If you're using an old model name:

```typescript
// OLD (doesn't work)
model: 'gemini-1.5-flash'
model: 'gemini-2.0-flash-exp'

// NEW (works)
model: 'gemini-2.5-flash'      // Best choice
model: 'gemini-2.0-flash'       // Also good
model: 'gemini-flash-latest'    // Always current
```

## 📚 Resources

- [List all models via REST API](https://generativelanguage.googleapis.com/v1beta/models)
- [Gemini API Docs](https://ai.google.dev/gemini-api/docs)
- [Model capabilities](https://ai.google.dev/api/models)
- Script: `list-models-rest.js` in project root
