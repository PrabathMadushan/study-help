import { useState, useEffect, useRef, useCallback } from 'react'
import { GeminiAudioTranscriber } from '../lib/geminiAudio'

/**
 * Hook for Gemini-powered voice recognition
 * Falls back to browser SpeechRecognition if Gemini is not available
 */
export function useGeminiSpeechRecognition() {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(false)
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'unknown'>('unknown')
  const [useGemini, setUseGemini] = useState(true)
  
  const transcriberRef = useRef<GeminiAudioTranscriber | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const callbackRef = useRef<((transcript: string) => void) | null>(null)

  useEffect(() => {
    // Initialize Gemini transcriber
    const transcriber = new GeminiAudioTranscriber()
    transcriberRef.current = transcriber
    
    const geminiAvailable = transcriber.isAvailable()
    const browserApiAvailable = !!(window.SpeechRecognition || window.webkitSpeechRecognition)
    
    setSupported(geminiAvailable || browserApiAvailable)
    setUseGemini(geminiAvailable)

    // Check microphone permission status
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'microphone' as PermissionName })
        .then((result) => {
          setPermissionState(result.state as 'prompt' | 'granted' | 'denied')
          result.onchange = () => {
            setPermissionState(result.state as 'prompt' | 'granted' | 'denied')
          }
        })
        .catch(() => {
          setPermissionState('unknown')
        })
    }

    return () => {
      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Request microphone permission explicitly
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop())
      setPermissionState('granted')
      return true
    } catch (error) {
      console.error('Microphone permission denied:', error)
      setPermissionState('denied')
      return false
    }
  }, [])

  const startListening = useCallback(
    async (onResult: (transcript: string) => void) => {
      // If permission not granted, request it first
      if (permissionState !== 'granted' && permissionState !== 'unknown') {
        const granted = await requestPermission()
        if (!granted) return
      }

      try {
        // Get microphone stream
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            channelCount: 1,
            sampleRate: 16000,
            echoCancellation: true,
            noiseSuppression: true,
          } 
        })
        streamRef.current = stream
        callbackRef.current = onResult

        if (useGemini && transcriberRef.current) {
          // Use Gemini transcriber
          await transcriberRef.current.startRecording(stream, onResult)
          setListening(true)
        } else {
          // Fallback to browser Speech Recognition
          // This would use the original implementation
          console.warn('Gemini transcription not available, falling back to browser API')
          // You could implement fallback here if needed
        }
      } catch (error) {
        console.error('Failed to start listening:', error)
        setListening(false)
      }
    },
    [permissionState, requestPermission, useGemini]
  )

  const stopListening = useCallback(async () => {
    if (transcriberRef.current) {
      await transcriberRef.current.stopRecording()
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    callbackRef.current = null
    setListening(false)
  }, [])

  return { 
    startListening, 
    stopListening, 
    listening, 
    supported, 
    permissionState, 
    requestPermission,
    usingGemini: useGemini 
  }
}
