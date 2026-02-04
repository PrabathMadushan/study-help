import { Link } from 'react-router-dom'
import type { Subcategory } from '../data/subcategories'
import { ProgressBar } from './ProgressBar'
import { useProgress } from '../hooks/useProgress'
import { notes } from '../data/notes'
import { filterNoteIdsWithFlashcards } from '../data/flashcards'

type SubcategoryCardProps = {
  subcategory: Subcategory
}

export function SubcategoryCard({ subcategory }: SubcategoryCardProps) {
  const { getSubcategoryProgress } = useProgress()
  const progress = getSubcategoryProgress(subcategory.categoryId, subcategory.id)
  const noteIds = notes
    .filter(
      (n) => n.categoryId === subcategory.categoryId && n.subcategoryId === subcategory.id
    )
    .map((n) => n.id)
  const noteCount = noteIds.length
  const practiceIds = filterNoteIdsWithFlashcards(noteIds)
  const canPractice = practiceIds.length > 0

  return (
    <div className="group relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-violet-300 dark:hover:border-violet-700">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 dark:from-violet-500/10 dark:to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <Link
        to={`/category/${subcategory.categoryId}/${subcategory.id}`}
        className="relative block p-5"
      >
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/50 dark:to-purple-900/50 flex items-center justify-center">
            <svg className="w-5 h-5 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
              {subcategory.name}
            </h2>
            {subcategory.description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {subcategory.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1">
            <ProgressBar value={progress} size="sm" />
          </div>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 tabular-nums">
            {progress}%
          </span>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {noteCount} {noteCount === 1 ? 'note' : 'notes'}
          </span>
          <span className="text-xs font-medium text-violet-600 dark:text-violet-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            View topics
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </Link>
      
      {canPractice && (
        <div className="relative px-5 pb-5">
          <Link
            to="/review"
            state={{ noteIds }}
            onClick={(e) => e.stopPropagation()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Practice
          </Link>
        </div>
      )}
    </div>
  )
}
