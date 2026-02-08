# 🐛 Debugging Live API - Fixed Issues

## Issues Fixed

### 1. ❌ `session.receive()` is not a function
**Problem**: The `@google/genai` SDK doesn't use `session.receive()` as an async iterable.

**Solution**: Messages are handled through the `onmessage` callback instead:

```typescript
callbacks: {
  onmessage: (message: any) => {
    self.handleServerMessage(message)
  }
}
```

### 2. ❌ `Cannot read properties of undefined (reading 'catch')`
**Problem**: `sendRealtimeInput()` doesn't return a Promise.

**Solution**: Wrapped in try-catch instead of using `.catch()`:

```typescript
try {
  this.session.sendRealtimeInput({ audio: { data, mimeType } })
} catch (err) {
  console.error('Error sending audio:', err)
}
```

## Testing the Fix

### 1. Restart Dev Server
```bash
npm run dev
```

### 2. Test Voice Input
Go to Practice Mode and click the microphone button.

### 3. Check Console Logs

You should see:
```
✅ WebSocket opened
🔌 Connecting to Gemini Live API...
✅ Connected to Gemini Live API
🎤 Microphone streaming started (16kHz PCM)
```

Then as you speak:
```
📝 User said: [your words]
```

### 4. Expected Message Flow

```javascript
// When you start speaking
{
  serverContent: {
    inputTranscription: {
      text: "hello world"
    }
  }
}

// When turn is complete
{
  serverContent: {
    turnComplete: true
  }
}
```

## Debug Messages

If you want to see ALL messages from Gemini, add this to `handleServerMessage`:

```typescript
private handleServerMessage(message: any): void {
  // Debug: log all messages
  console.log('📨 Received message:', JSON.stringify(message, null, 2))
  
  // ... rest of the code
}
```

## Common Issues

### No Transcription Appearing

**Check 1**: Are messages being received?
- Add `console.log('📨 Message:', message)` in `handleServerMessage`

**Check 2**: Is the message structure correct?
- Log `message.serverContent` to see what's inside

**Check 3**: Is audio being sent?
- Check network tab for WebSocket frames
- Look for continuous data being sent

### WebSocket Closes Immediately

**Possible causes**:
1. Invalid API key
2. Model not available
3. Network blocking WebSocket

**Debug**:
```typescript
onclose: (event: any) => {
  console.log('🔌 Closed:', event.code, event.reason, event.wasClean)
}
```

### Audio Format Errors

**Verify**:
- Input: 16kHz, 16-bit PCM
- MIME type: `audio/pcm;rate=16000`
- Base64 encoded correctly

## Message Structure Reference

Based on Gemini Live API docs:

```typescript
interface ServerMessage {
  serverContent?: {
    // User speech transcription
    inputTranscription?: {
      text: string
    }
    
    // AI response transcription
    outputTranscription?: {
      text: string
    }
    
    // AI audio/text response
    modelTurn?: {
      parts: Array<{
        text?: string
        inlineData?: {
          mimeType: string
          data: string
        }
      }>
    }
    
    // Interruption flag
    interrupted?: boolean
    
    // Turn completion
    turnComplete?: boolean
  }
  
  // Usage statistics
  usageMetadata?: {
    totalTokenCount: number
    responseTokensDetails: Array<{
      modality: string
      tokenCount: number
    }>
  }
}
```

## SDK Method Reference

```typescript
// Connection
const session = await ai.live.connect({
  model: string,
  config: object,
  callbacks: {
    onopen: () => void,
    onclose: (event) => void,
    onerror: (error) => void,
    onmessage: (message) => void
  }
})

// Send audio (synchronous, not Promise)
session.sendRealtimeInput({
  audio: {
    data: string,        // base64
    mimeType: string     // 'audio/pcm;rate=16000'
  }
})

// Signal end of stream
session.sendRealtimeInput({ audioStreamEnd: true })

// Close connection
session.close()
```

## Next Steps

1. Test the voice input
2. Check console for the expected logs
3. If transcription still doesn't appear, add debug logging to see what messages are received
4. Share the message structure if different from expected

## Enhanced Debug Version

If you need more debugging, replace `handleServerMessage` with this:

```typescript
private handleServerMessage(message: any): void {
  console.log('📨 RAW MESSAGE:', message)
  
  if (message.serverContent) {
    console.log('📦 Server Content:', message.serverContent)
    
    if (message.serverContent.inputTranscription) {
      console.log('📝 INPUT TRANSCRIPTION:', message.serverContent.inputTranscription)
    }
    
    if (message.serverContent.outputTranscription) {
      console.log('🤖 OUTPUT TRANSCRIPTION:', message.serverContent.outputTranscription)
    }
    
    if (message.serverContent.modelTurn) {
      console.log('💬 MODEL TURN:', message.serverContent.modelTurn)
    }
  }
  
  // Original handling code...
}
```

This will help identify the exact structure of messages being received.
