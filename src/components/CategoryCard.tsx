import { Link } from 'react-router-dom'
import type { Category } from '../data/categories'
import { ProgressBar } from './ProgressBar'
import { useProgress } from '../hooks/useProgress'
import { notes } from '../data/notes'
import { filterNoteIdsWithFlashcards } from '../data/flashcards'

type CategoryCardProps = {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  const { getCategoryProgress } = useProgress()
  const progress = getCategoryProgress(category.id)
  const noteIds = notes.filter((n) => n.categoryId === category.id).map((n) => n.id)
  const noteCount = noteIds.length
  const practiceIds = filterNoteIdsWithFlashcards(noteIds)
  const canPractice = practiceIds.length > 0

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200">
      <Link to={`/category/${category.id}`} className="block focus:outline-none focus:ring-0">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{category.name}</h2>
        {category.description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{category.description}</p>
        )}
        <div className="mt-4 flex items-center gap-3">
          <ProgressBar value={progress} className="flex-1" showLabel />
          <span className="text-xs text-gray-500 dark:text-gray-400">{noteCount} notes</span>
        </div>
      </Link>
      {canPractice && (
        <Link
          to="/review"
          state={{ noteIds }}
          onClick={(e) => e.stopPropagation()}
          className="mt-4 flex w-full items-center justify-center rounded-lg border border-indigo-600 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 dark:border-indigo-500 dark:bg-indigo-900/20 dark:text-indigo-300 dark:hover:bg-indigo-900/40"
          aria-label={`Practice ${practiceIds.length} interview questions from ${category.name} (random order)`}
        >
          Practice
        </Link>
      )}
    </div>
  )
}
