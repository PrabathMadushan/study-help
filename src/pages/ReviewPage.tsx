import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getNoteIdsWithFlashcards } from '../data/flashcards'
import { getNoteById } from '../data/notes'
import { flashcardData } from '../data/flashcards'
import { useProgress } from '../hooks/useProgress'

export function ReviewPage() {
  const [sessionNoteIds, setSessionNoteIds] = useState<string[] | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const { getNotesDueForReview, recordReview } = useProgress()

  const allNoteIds = getNoteIdsWithFlashcards()
  const dueNoteIds = getNotesDueForReview(allNoteIds)

  function startPracticeAll() {
    setSessionNoteIds([...allNoteIds])
    setCurrentIndex(0)
    setRevealed(false)
  }

  function startDueFlashcards() {
    setSessionNoteIds([...dueNoteIds])
    setCurrentIndex(0)
    setRevealed(false)
  }

  function handleNext() {
    if (sessionNoteIds == null) return
    const noteId = sessionNoteIds[currentIndex]
    recordReview(noteId)
    if (currentIndex + 1 >= sessionNoteIds.length) {
      setSessionNoteIds(null)
      setCurrentIndex(0)
      setRevealed(false)
      return
    }
    setCurrentIndex((i) => i + 1)
    setRevealed(false)
  }

  if (sessionNoteIds == null || sessionNoteIds.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Review</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Practice interview answers with flashcards. Tap a card to reveal the answer.
        </p>
        {allNoteIds.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No flashcards available yet.</p>
        ) : (
          <div className="space-y-4">
            {dueNoteIds.length > 0 && (
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {dueNoteIds.length} note{dueNoteIds.length !== 1 ? 's' : ''} due for review
                </p>
                <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-3">
                  {dueNoteIds.slice(0, 5).map((id) => {
                    const n = getNoteById(id)
                    return (
                      <li key={id}>
                        <Link to={`/note/${id}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">
                          {n?.title ?? id}
                        </Link>
                      </li>
                    )
                  })}
                  {dueNoteIds.length > 5 && (
                    <li className="text-gray-500 dark:text-gray-500">… and {dueNoteIds.length - 5} more</li>
                  )}
                </ul>
                <button
                  type="button"
                  onClick={startDueFlashcards}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                >
                  Start flashcards (due)
                </button>
              </div>
            )}
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
      <div
        role="button"
        tabIndex={0}
        onClick={() => setRevealed((r) => !r)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setRevealed((r) => !r)
          }
        }}
        className="rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 min-h-[200px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          {revealed ? 'Answer' : 'Question'}
        </p>
        {revealed ? (
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {data?.interviewAnswer ?? ''}
          </p>
        ) : (
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            {note?.title ?? noteId}
          </p>
        )}
        <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
          {revealed ? 'Tap to hide' : 'Tap to reveal'}
        </p>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleNext}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          {isLast ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  )
}
