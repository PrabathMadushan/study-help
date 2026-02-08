import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAllFlashcards, useFlashcards } from '../hooks/useFlashcards'
import { useProgress } from '../hooks/useProgress'
import { validateFlashcardAnswer } from '../lib/validateAnswer'
import { useGeminiSpeechRecognition } from '../hooks/useGeminiSpeechRecognition'
import type { Flashcard } from '../types/firestore'

type ReviewLocationState = { categoryId?: string; categoryIds?: string[]; startDeck?: 'all' } | null

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
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

function ScoreDisplay({ score, feedback }: { score: number; feedback?: string }) {
  const variant =
    score >= 70
      ? {
          bg: 'from-emerald-500 to-teal-500',
          text: 'text-emerald-600 dark:text-emerald-400',
          label: 'Great job!',
        }
      : score >= 40
        ? {
            bg: 'from-amber-500 to-orange-500',
            text: 'text-amber-600 dark:text-amber-400',
            label: 'Getting there!',
          }
        : {
            bg: 'from-red-500 to-rose-500',
            text: 'text-red-600 dark:text-red-400',
            label: 'Keep practicing!',
          }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 p-6 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br shadow-lg mb-4" style={{ background: `linear-gradient(135deg, ${score >= 70 ? '#10b981, #14b8a6' : score >= 40 ? '#f59e0b, #f97316' : '#ef4444, #f43f5e'})` }}>
        <span className="text-2xl font-bold text-white">{score}</span>
      </div>
      <p className={`text-lg font-semibold ${variant.text}`}>{variant.label}</p>
      {feedback && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{feedback}</p>
      )}
    </div>
  )
}

export function ReviewPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as ReviewLocationState
  const categoryIdFromState = state?.categoryId ?? null

  const { flashcards: allFlashcards } = useAllFlashcards()
  const { flashcards: categoryFlashcards } = useFlashcards(categoryIdFromState)

  const [sessionCards, setSessionCards] = useState<Flashcard[] | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [scoreResult, setScoreResult] = useState<{ score: number; feedback?: string } | null>(null)
  const [validating, setValidating] = useState(false)
  const { setNoteScore } = useProgress()
  const { startListening, stopListening, listening, supported: speechRecognitionSupported, permissionState: micPermission, usingGemini } = useGeminiSpeechRecognition()
  const { speak, supported: ttsSupported } = useSpeechSynthesis()

  useEffect(() => {
    if (!state || (!state.startDeck && !state.categoryId)) return
    const deck = state.startDeck === 'all'
      ? allFlashcards
      : state.categoryId
        ? categoryFlashcards
        : []
    if (deck.length === 0) return
    setSessionCards(shuffle(deck))
    setCurrentIndex(0)
    setUserAnswer('')
    setSubmitted(false)
    setScoreResult(null)
    navigate(location.pathname, { replace: true, state: {} })
  }, [state, allFlashcards, categoryFlashcards, navigate, location.pathname])

  function startPracticeAll() {
    if (allFlashcards.length === 0) return
    setSessionCards(shuffle([...allFlashcards]))
    setCurrentIndex(0)
    setUserAnswer('')
    setSubmitted(false)
    setScoreResult(null)
  }

  async function handleSubmit() {
    if (!sessionCards || submitted) return
    const card = sessionCards[currentIndex]
    setValidating(true)
    try {
      const result = await validateFlashcardAnswer(userAnswer, card.answer)
      setScoreResult(result)
      setSubmitted(true)
      setNoteScore(card.id, result.score)
    } finally {
      setValidating(false)
    }
  }

  function handleNext() {
    if (!sessionCards) return
    if (currentIndex + 1 >= sessionCards.length) {
      setSessionCards(null)
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
    // Update the answer with the transcript (includes accumulated + current)
    setUserAnswer(transcript)
  }, [])

  if (sessionCards == null || sessionCards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 shadow-xl shadow-violet-500/25 mb-5">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Practice Mode</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto">
            Test your knowledge with AI-powered answer scoring. Speak or type your answers.
          </p>
        </div>

        {allFlashcards.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-400">No practice questions available yet.</p>
            <Link to="/" className="mt-4 inline-block text-violet-600 dark:text-violet-400 hover:underline">
              Browse study notes
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Ready to practice?</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {allFlashcards.length} question{allFlashcards.length !== 1 ? 's' : ''} available
                </p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={startPracticeAll}
              className="w-full btn-primary text-base py-3 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Practice Session
            </button>
          </div>
        )}
      </div>
    )
  }

  const card = sessionCards[currentIndex]
  const modelAnswer = card.answer
  const isLast = currentIndex + 1 >= sessionCards.length
  const progress = ((currentIndex + 1) / sessionCards.length) * 100

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Question {currentIndex + 1} of {sessionCards.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setSessionCards(null)}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          Exit
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 mb-8 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question card */}
      <div className="rounded-2xl border-2 border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50 to-white dark:from-violet-900/20 dark:to-gray-900 p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
            <svg className="w-5 h-5 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-violet-600 dark:text-violet-400 mb-1">Question</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              {card.question}
            </p>
          </div>
        </div>
        {ttsSupported && (
          <button
            type="button"
            onClick={() => speak(card.question)}
            className="mt-4 inline-flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            Read aloud
          </button>
        )}
      </div>

      {/* Answer input */}
      {!submitted ? (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Your answer
          </label>
          <div className="relative">
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder={usingGemini ? "Type or speak your answer (powered by Gemini AI)..." : "Type or speak your answer..."}
              className={`input min-h-[150px] resize-none ${speechRecognitionSupported ? 'pr-32' : ''}`}
              disabled={validating}
            />
            {speechRecognitionSupported && (
              <div className="absolute right-3 top-3 flex items-center gap-2">
                {usingGemini && (
                  <span className="text-xs px-2 py-1 rounded-md bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 font-medium">
                    Gemini AI
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => (listening ? stopListening() : startListening(handleMicResult))}
                  disabled={micPermission === 'denied'}
                  className={`p-2 rounded-lg transition-all ${
                    micPermission === 'denied'
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      : listening
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  title={
                    micPermission === 'denied'
                      ? 'Microphone access denied. Please enable it in browser settings.'
                      : listening
                        ? 'Stop listening'
                        : usingGemini 
                          ? 'Start voice input (Gemini AI)'
                          : 'Start voice input'
                  }
                >
                  {micPermission === 'denied' ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={validating || !userAnswer.trim()}
            className="w-full btn-primary py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {validating ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Checking...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Submit Answer
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Score */}
          {scoreResult != null && (
            <ScoreDisplay score={scoreResult.score} feedback={scoreResult.feedback} />
          )}

          {/* Model answer */}
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-gray-900 p-6">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-2">Model Answer</p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {modelAnswer}
                </p>
              </div>
            </div>
            {ttsSupported && (
              <button
                type="button"
                onClick={() => speak(modelAnswer)}
                className="mt-4 inline-flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                Read answer
              </button>
            )}
          </div>

          {/* Next button */}
          <button
            type="button"
            onClick={handleNext}
            className="w-full btn-primary py-3 text-base flex items-center justify-center gap-2"
          >
            {isLast ? (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Complete Session
              </>
            ) : (
              <>
                Next Question
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
