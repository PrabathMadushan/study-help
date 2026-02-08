import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAllExamQuestions, useExamQuestions } from '../hooks/useExamQuestions'
import type { ExamQuestion } from '../types/firestore'

type ExamLocationState = { categoryId?: string } | null

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function normalizeShortAnswer(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function ExamPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as ExamLocationState
  const categoryIdFromState = state?.categoryId ?? null

  const { questions: allQuestions } = useAllExamQuestions()
  const { questions: categoryQuestions } = useExamQuestions(categoryIdFromState)

  const [sessionQuestions, setSessionQuestions] = useState<ExamQuestion[] | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [results, setResults] = useState<{ correct: number; total: number } | null>(null)

  useEffect(() => {
    if (!state?.categoryId) return
    if (categoryQuestions.length === 0) return
    setSessionQuestions(shuffle([...categoryQuestions]))
    setCurrentIndex(0)
    setUserAnswer('')
    setSelectedOption(null)
    setSubmitted(false)
    setCorrect(false)
    setResults(null)
    navigate(location.pathname, { replace: true, state: {} })
  }, [state?.categoryId, categoryQuestions, navigate, location.pathname])

  function startExamAll() {
    if (allQuestions.length === 0) return
    setSessionQuestions(shuffle([...allQuestions]))
    setCurrentIndex(0)
    setUserAnswer('')
    setSelectedOption(null)
    setSubmitted(false)
    setCorrect(false)
    setResults(null)
  }

  function startExamCategory() {
    if (categoryQuestions.length === 0) return
    setSessionQuestions(shuffle([...categoryQuestions]))
    setCurrentIndex(0)
    setUserAnswer('')
    setSelectedOption(null)
    setSubmitted(false)
    setCorrect(false)
    setResults(null)
  }

  function checkAnswer(): boolean {
    const q = sessionQuestions?.[currentIndex]
    if (!q) return false
    const raw = q.type === 'mcq' ? selectedOption : userAnswer
    if (raw == null || raw === '') return false
    if (q.type === 'mcq') return raw.trim() === q.correctAnswer.trim()
    return normalizeShortAnswer(raw) === normalizeShortAnswer(q.correctAnswer)
  }

  function handleSubmit() {
    if (!sessionQuestions || submitted) return
    const isCorrect = checkAnswer()
    setCorrect(isCorrect)
    setSubmitted(true)
  }

  function handleNext() {
    if (!sessionQuestions) return
    const nextIndex = currentIndex + 1
    if (nextIndex >= sessionQuestions.length) {
      const soFar = results ? results.correct + (correct ? 1 : 0) : (correct ? 1 : 0)
      const total = results ? results.total + 1 : 1
      setResults({ correct: soFar, total })
      setSessionQuestions(null)
      setCurrentIndex(0)
      setSubmitted(false)
      setCorrect(false)
      return
    }
    const soFar = results ? results.correct + (correct ? 1 : 0) : (correct ? 1 : 0)
    setResults({ correct: soFar, total: (results?.total ?? 0) + 1 })
    setCurrentIndex(nextIndex)
    setUserAnswer('')
    setSelectedOption(null)
    setSubmitted(false)
    setCorrect(false)
  }

  if (results != null && sessionQuestions == null) {
    const pct = results.total > 0 ? Math.round((results.correct / results.total) * 100) : 0
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Exam Complete</h1>
          <p className="text-gray-500 dark:text-gray-400">Your score</p>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-8 text-center">
          <div className="text-5xl font-bold text-violet-600 dark:text-violet-400 mb-2">
            {results.correct} / {results.total}
          </div>
          <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300">{pct}%</p>
          <div className="mt-6 flex gap-3 justify-center">
            <Link to="/exam" className="btn-primary inline-flex items-center gap-2">
              Take another exam
            </Link>
            <Link to="/" className="btn-secondary inline-flex items-center gap-2">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (sessionQuestions == null || sessionQuestions.length === 0) {
    const hasAll = allQuestions.length > 0
    const hasCategory = categoryIdFromState && categoryQuestions.length > 0
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-xl mb-5">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Exam Mode</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto">
            Answer multiple choice or short answer questions. Your score is shown at the end.
          </p>
        </div>

        {!hasAll && !hasCategory ? (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">No exam questions available yet.</p>
            <Link to="/" className="mt-4 inline-block text-violet-600 dark:text-violet-400 hover:underline">
              Browse topics
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-8 space-y-4">
            {hasAll && (
              <button
                type="button"
                onClick={startExamAll}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2"
              >
                Start exam (all topics, {allQuestions.length} questions)
              </button>
            )}
            {hasCategory && (
              <button
                type="button"
                onClick={startExamCategory}
                className="w-full btn-secondary py-3 flex items-center justify-center gap-2"
              >
                Start exam (this topic, {categoryQuestions.length} questions)
              </button>
            )}
          </div>
        )}
      </div>
    )
  }

  const q = sessionQuestions[currentIndex]
  const isLast = currentIndex + 1 >= sessionQuestions.length
  const progress = ((currentIndex + 1) / sessionQuestions.length) * 100

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          Question {currentIndex + 1} of {sessionQuestions.length}
        </span>
        <button
          type="button"
          onClick={() => setSessionQuestions(null)}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700"
        >
          Exit
        </button>
      </div>
      <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 mb-8 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="rounded-2xl border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/20 dark:to-gray-900 p-6 mb-6">
        <p className="text-xl font-semibold text-gray-900 dark:text-white">{q.question}</p>
      </div>

      {!submitted ? (
        <div className="space-y-4">
          {q.type === 'mcq' && q.options?.length ? (
            <div className="space-y-2">
              {q.options.map((opt, i) => (
                <label
                  key={i}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    selectedOption === opt
                      ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="mcq"
                    checked={selectedOption === opt}
                    onChange={() => setSelectedOption(opt)}
                    className="w-4 h-4 text-violet-600"
                  />
                  <span className="text-gray-900 dark:text-white">{opt}</span>
                </label>
              ))}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your answer</label>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="input w-full"
                placeholder="Type your answer..."
              />
            </div>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={(q.type === 'mcq' ? selectedOption == null : !userAnswer.trim())}
            className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Answer
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div
            className={`rounded-2xl p-6 text-center ${
              correct
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}
          >
            <p className={`text-xl font-semibold ${correct ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
              {correct ? 'Correct!' : 'Incorrect'}
            </p>
            {!correct && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Correct answer: {q.correctAnswer}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleNext}
            className="w-full btn-primary py-3"
          >
            {isLast ? 'See results' : 'Next question'}
          </button>
        </div>
      )}
    </div>
  )
}
