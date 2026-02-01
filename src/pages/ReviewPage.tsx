import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  getNoteIdsWithFlashcards,
  filterNoteIdsWithFlashcards,
  shuffleNoteIds,
} from '../data/flashcards'
import { getNoteById } from '../data/notes'
import { flashcardData } from '../data/flashcards'
import { useProgress } from '../hooks/useProgress'
import { validateFlashcardAnswer } from '../lib/gemini'

type ReviewLocationState = { noteIds?: string[]; startDeck?: 'all' } | null

function useSpeechRecognition() {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition
    setSupported(!!SpeechRecognitionAPI)
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'
    }
    return () => {
      recognitionRef.current?.abort()
    }
  }, [])

  const startListening = useCallback(
    (onResult: (transcript: string) => void) => {
      const rec = recognitionRef.current
      if (!rec) return
      rec.onresult = (e: SpeechRecognitionEvent) => {
        const transcript = Array.from(e.results)
          .map((r: SpeechRecognitionResult) => r[0].transcript)
          .join(' ')
        onResult(transcript)
      }
      rec.onend = () => setListening(false)
      rec.onerror = () => setListening(false)
      rec.start()
      setListening(true)
    },
    []
  )

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setListening(false)
  }, [])

  return { startListening, stopListening, listening, supported }
}

function useSpeechSynthesis() {
  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.rate = 0.9
    u.lang = 'en-US'
    window.speechSynthesis.speak(u)
  }, [])
  return { speak, supported: 'speechSynthesis' in window }
}

export function ReviewPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [sessionNoteIds, setSessionNoteIds] = useState<string[] | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [scoreResult, setScoreResult] = useState<{ score: number; feedback?: string } | null>(null)
  const [validating, setValidating] = useState(false)
  const { setNoteScore } = useProgress()
  const { startListening, stopListening, listening, supported: speechRecognitionSupported } = useSpeechRecognition()
  const { speak, supported: ttsSupported } = useSpeechSynthesis()

  const allNoteIds = getNoteIdsWithFlashcards()

  useEffect(() => {
    const state = location.state as ReviewLocationState
    if (!state) return
    const ids =
      state.noteIds ?? (state.startDeck === 'all' ? getNoteIdsWithFlashcards() : [])
    const withFlashcards = filterNoteIdsWithFlashcards(ids)
    if (withFlashcards.length === 0) return
    setSessionNoteIds(shuffleNoteIds(withFlashcards))
    setCurrentIndex(0)
    setUserAnswer('')
    setSubmitted(false)
    setScoreResult(null)
    navigate(location.pathname, { replace: true, state: {} })
  }, [location.state, location.pathname, navigate])

  function startPracticeAll() {
    setSessionNoteIds(shuffleNoteIds([...allNoteIds]))
    setCurrentIndex(0)
    setUserAnswer('')
    setSubmitted(false)
    setScoreResult(null)
  }

  async function handleSubmit() {
    if (!sessionNoteIds || submitted) return
    const noteId = sessionNoteIds[currentIndex]
    const modelAnswer = flashcardData[noteId]?.interviewAnswer ?? ''
    setValidating(true)
    try {
      const result = await validateFlashcardAnswer(userAnswer, modelAnswer)
      setScoreResult(result)
      setSubmitted(true)
      setNoteScore(noteId, result.score)
    } finally {
      setValidating(false)
    }
  }

  function handleNext() {
    if (!sessionNoteIds) return
    if (currentIndex + 1 >= sessionNoteIds.length) {
      setSessionNoteIds(null)
      setCurrentIndex(0)
      setUserAnswer('')
      setSubmitted(false)
      setScoreResult(null)
      return
    }
    setCurrentIndex((i) => i + 1)
    setUserAnswer('')
    setSubmitted(false)
    setScoreResult(null)
  }

  const handleMicResult = useCallback((transcript: string) => {
    setUserAnswer(transcript)
  }, [])

  if (sessionNoteIds == null || sessionNoteIds.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Review</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Practice interview answers. Type or speak your answer, then submit for AI scoring (0–100).
        </p>
        {allNoteIds.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No flashcards available yet.</p>
        ) : (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {allNoteIds.length} note{allNoteIds.length !== 1 ? 's' : ''} with interview answers.
            </p>
            <button
              type="button"
              onClick={startPracticeAll}
              className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Practice all
            </button>
          </div>
        )}
        <Link
          to="/"
          className="mt-6 inline-block text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Back to home
        </Link>
      </div>
    )
  }

  const noteId = sessionNoteIds[currentIndex]
  const note = getNoteById(noteId)
  const data = flashcardData[noteId]
  const modelAnswer = data?.interviewAnswer ?? ''
  const isLast = currentIndex + 1 >= sessionNoteIds.length

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Card {currentIndex + 1} of {sessionNoteIds.length}
        </span>
        <Link
          to="/review"
          onClick={(e) => {
            e.preventDefault()
            setSessionNoteIds(null)
          }}
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Exit
        </Link>
      </div>

      {/* Question card */}
      <div className="rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 mb-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Question</p>
        <p className="text-xl font-semibold text-gray-900 dark:text-white">
          {note?.title ?? noteId}
        </p>
        {ttsSupported && (
          <button
            type="button"
            onClick={() => speak(note?.title ?? noteId)}
            className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Read question
          </button>
        )}
      </div>

      {/* Answer input */}
      {!submitted ? (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Your answer (type or use mic)
          </label>
          <div className="flex gap-2">
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type or speak your answer..."
              className="flex-1 min-h-[120px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={validating}
            />
            {speechRecognitionSupported && (
              <button
                type="button"
                onClick={() => (listening ? stopListening() : startListening(handleMicResult))}
                className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  listening
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                title={listening ? 'Stop listening' : 'Start voice input'}
              >
                {listening ? 'Stop' : 'Mic'}
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={validating || !userAnswer.trim()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {validating ? 'Checking...' : 'Submit for score'}
          </button>
        </div>
      ) : (
        <>
          {/* Show model answer and score */}
          <div className="rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 mb-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Model answer</p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {modelAnswer}
            </p>
            {ttsSupported && (
              <button
                type="button"
                onClick={() => speak(modelAnswer)}
                className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Read answer
              </button>
            )}
          </div>
          {scoreResult != null && (
            <div className="mb-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                Score: {scoreResult.score}/100
              </p>
              {scoreResult.feedback && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{scoreResult.feedback}</p>
              )}
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleNext}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              {isLast ? 'Finish' : 'Next'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
