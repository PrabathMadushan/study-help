import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getNoteById } from '../data/notes'
import { getCategoryById } from '../data/categories'
import { getSubcategoryById } from '../data/subcategories'
import { getSubSubcategoryById } from '../data/subSubcategories'
import { noteContents } from '../notes'
import { useProgress } from '../hooks/useProgress'

function ScoreBadge({ score }: { score: number }) {
  const variant =
    score >= 70
      ? 'from-emerald-500 to-teal-500 text-white'
      : score >= 40
        ? 'from-amber-500 to-orange-500 text-white'
        : 'from-red-500 to-rose-500 text-white'

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r ${variant} shadow-lg`}>
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {score}%
    </span>
  )
}

export function NotePage() {
  const { id } = useParams<{ id: string }>()
  const note = id ? getNoteById(id) : undefined
  const category = note ? getCategoryById(note.categoryId) : undefined
  const subcategory = note?.subcategoryId && note.categoryId
    ? getSubcategoryById(note.categoryId, note.subcategoryId)
    : undefined
  const subSubcategory =
    note?.subcategoryId && note.subSubcategoryId && note.categoryId
      ? getSubSubcategoryById(note.categoryId, note.subcategoryId, note.subSubcategoryId)
      : undefined
  const { getNoteProgress, setNoteViewed } = useProgress()
  const progress = note ? getNoteProgress(note.id) : undefined
  const getContent = note ? noteContents[note.id] : null

  useEffect(() => {
    if (note) {
      setNoteViewed(note.id)
    }
  }, [note?.id, setNoteViewed])

  if (!id || !note) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Note not found.</p>
        <Link to="/" className="btn-secondary inline-flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to home
        </Link>
      </div>
    )
  }

  const backTo =
    note.subSubcategoryId && note.subcategoryId
      ? `/category/${note.categoryId}/${note.subcategoryId}/${note.subSubcategoryId}`
      : note.subcategoryId
        ? `/category/${note.categoryId}/${note.subcategoryId}`
        : `/category/${note.categoryId}`
  const backLabel = subSubcategory?.name ?? subcategory?.name ?? category?.name ?? note.categoryId

  // Breadcrumb items
  const breadcrumbs = [
    { label: 'Home', to: '/' },
    category && { label: category.name, to: `/category/${category.id}` },
    subcategory && { label: subcategory.name, to: `/category/${category?.id}/${subcategory.id}` },
    subSubcategory && { label: subSubcategory.name, to: `/category/${category?.id}/${subcategory?.id}/${subSubcategory.id}` },
  ].filter(Boolean) as { label: string; to: string }[]

  return (
    <article className="max-w-6xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex flex-wrap items-center gap-x-1 gap-y-1 text-xs sm:text-sm mb-4 sm:mb-6 leading-none">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.to} className="inline-flex items-center gap-1">
            {i > 0 && (
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 shrink-0 self-center" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}
            <Link
              to={crumb.to}
              className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors truncate max-w-[100px] sm:max-w-none leading-tight"
            >
              {crumb.label}
            </Link>
          </span>
        ))}
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
            {note.title}
          </h1>
          {progress?.score != null && <ScoreBadge score={progress.score} />}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            to={backTo}
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to {backLabel}
          </Link>

          <Link
            to="/review"
            state={{ noteIds: [note.id] }}
            className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Practice this note
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-6 sm:p-8 shadow-sm">
        {getContent ? (
          <div className="note-body">
            {getContent()}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400">Content for this note is not yet available.</p>
          </div>
        )}
      </div>

      {/* Practice CTA */}
      {progress?.score == null && (
        <div className="mt-8 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200 dark:border-violet-800 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Ready to test yourself?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Practice this topic and get AI-powered feedback on your answers.
              </p>
            </div>
            <Link
              to="/review"
              state={{ noteIds: [note.id] }}
              className="btn-primary shrink-0 inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Practice
            </Link>
          </div>
        </div>
      )}

      {/* Score section (if practiced) */}
      {progress?.score != null && (
        <div className="mt-8 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg ${progress.score >= 70
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
                  : progress.score >= 40
                    ? 'bg-gradient-to-br from-amber-500 to-orange-500'
                    : 'bg-gradient-to-br from-red-500 to-rose-500'
                }`}>
                {progress.score}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Your Practice Score</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {progress.score >= 70 ? 'Great work!' : progress.score >= 40 ? 'Keep practicing!' : 'Room for improvement'}
                </p>
              </div>
            </div>
            <Link
              to="/review"
              state={{ noteIds: [note.id] }}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Practice again
            </Link>
          </div>
        </div>
      )}
    </article>
  )
}
