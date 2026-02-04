import { Link } from 'react-router-dom'
import type { Category } from '../data/categories'
import { ProgressBar } from './ProgressBar'
import { useProgress } from '../hooks/useProgress'
import { notes } from '../data/notes'
import { filterNoteIdsWithFlashcards } from '../data/flashcards'

type CategoryCardProps = {
  category: Category
}

const categoryIcons: Record<string, JSX.Element> = {
  'front-end': (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  'back-end': (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
    </svg>
  ),
  devops: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  'design-patterns': (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  ),
  'data-structures': (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  algorithms: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  'behavior-questions': (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  more: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
    </svg>
  ),
}

const categoryColors: Record<string, { bg: string; icon: string; border: string }> = {
  'front-end': {
    bg: 'from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20',
    icon: 'text-blue-600 dark:text-blue-400',
    border: 'group-hover:border-blue-300 dark:group-hover:border-blue-700',
  },
  'back-end': {
    bg: 'from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20',
    icon: 'text-green-600 dark:text-green-400',
    border: 'group-hover:border-green-300 dark:group-hover:border-green-700',
  },
  devops: {
    bg: 'from-orange-500/10 to-amber-500/10 dark:from-orange-500/20 dark:to-amber-500/20',
    icon: 'text-orange-600 dark:text-orange-400',
    border: 'group-hover:border-orange-300 dark:group-hover:border-orange-700',
  },
  'design-patterns': {
    bg: 'from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20',
    icon: 'text-purple-600 dark:text-purple-400',
    border: 'group-hover:border-purple-300 dark:group-hover:border-purple-700',
  },
  'data-structures': {
    bg: 'from-indigo-500/10 to-violet-500/10 dark:from-indigo-500/20 dark:to-violet-500/20',
    icon: 'text-indigo-600 dark:text-indigo-400',
    border: 'group-hover:border-indigo-300 dark:group-hover:border-indigo-700',
  },
  algorithms: {
    bg: 'from-rose-500/10 to-red-500/10 dark:from-rose-500/20 dark:to-red-500/20',
    icon: 'text-rose-600 dark:text-rose-400',
    border: 'group-hover:border-rose-300 dark:group-hover:border-rose-700',
  },
  'behavior-questions': {
    bg: 'from-teal-500/10 to-cyan-500/10 dark:from-teal-500/20 dark:to-cyan-500/20',
    icon: 'text-teal-600 dark:text-teal-400',
    border: 'group-hover:border-teal-300 dark:group-hover:border-teal-700',
  },
  more: {
    bg: 'from-gray-500/10 to-slate-500/10 dark:from-gray-500/20 dark:to-slate-500/20',
    icon: 'text-gray-600 dark:text-gray-400',
    border: 'group-hover:border-gray-300 dark:group-hover:border-gray-600',
  },
}

export function CategoryCard({ category }: CategoryCardProps) {
  const { getCategoryProgress } = useProgress()
  const progress = getCategoryProgress(category.id)
  const noteIds = notes.filter((n) => n.categoryId === category.id).map((n) => n.id)
  const noteCount = noteIds.length
  const practiceIds = filterNoteIdsWithFlashcards(noteIds)
  const canPractice = practiceIds.length > 0

  const colors = categoryColors[category.id] ?? categoryColors.more
  const icon = categoryIcons[category.id] ?? categoryIcons.more

  return (
    <div className={`group relative rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 overflow-hidden transition-all duration-300 hover:shadow-xl active:scale-[0.99] sm:hover:-translate-y-1 ${colors.border}`}>
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      <Link to={`/category/${category.id}`} className="relative block p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center ${colors.icon}`}>
            <div className="w-5 h-5 sm:w-6 sm:h-6">{icon}</div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
              {category.name}
            </h2>
            {category.description && (
              <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {category.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-3">
          <div className="flex-1">
            <ProgressBar value={progress} size="sm" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 tabular-nums">
            {progress}%
          </span>
        </div>
        
        <div className="mt-2 sm:mt-3 flex items-center justify-between">
          <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">
            {noteCount} {noteCount === 1 ? 'note' : 'notes'}
          </span>
          <span className="text-[10px] sm:text-xs font-medium text-violet-600 dark:text-violet-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            Explore
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </Link>
      
      {canPractice && (
        <div className="relative px-4 pb-4 sm:px-5 sm:pb-5">
          <Link
            to="/review"
            state={{ noteIds }}
            onClick={(e) => e.stopPropagation()}
            className="flex w-full items-center justify-center gap-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
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
