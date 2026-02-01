import { Link } from 'react-router-dom'
import type { SubSubcategory } from '../data/subSubcategories'
import { ProgressBar } from './ProgressBar'
import { useProgress } from '../hooks/useProgress'
import { notes } from '../data/notes'
import { filterNoteIdsWithFlashcards } from '../data/flashcards'

type SubSubcategoryCardProps = {
  subSubcategory: SubSubcategory
}

export function SubSubcategoryCard({ subSubcategory }: SubSubcategoryCardProps) {
  const { getSubSubcategoryProgress } = useProgress()
  const progress = getSubSubcategoryProgress(
    subSubcategory.categoryId,
    subSubcategory.subcategoryId,
    subSubcategory.id
  )
  const noteIds = notes
    .filter(
      (n) =>
        n.categoryId === subSubcategory.categoryId &&
        n.subcategoryId === subSubcategory.subcategoryId &&
        n.subSubcategoryId === subSubcategory.id
    )
    .map((n) => n.id)
  const noteCount = noteIds.length
  const practiceIds = filterNoteIdsWithFlashcards(noteIds)
  const canPractice = practiceIds.length > 0

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200">
      <Link
        to={`/category/${subSubcategory.categoryId}/${subSubcategory.subcategoryId}/${subSubcategory.id}`}
        className="block focus:outline-none focus:ring-0"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{subSubcategory.name}</h2>
        {subSubcategory.description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subSubcategory.description}</p>
        )}
        <div className="mt-3 flex items-center gap-3">
          <ProgressBar value={progress} className="flex-1" showLabel />
          <span className="text-xs text-gray-500 dark:text-gray-400">{noteCount} notes</span>
        </div>
      </Link>
      {canPractice && (
        <Link
          to="/review"
          state={{ noteIds }}
          onClick={(e) => e.stopPropagation()}
          className="mt-3 flex w-full items-center justify-center rounded-lg border border-indigo-600 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 dark:border-indigo-500 dark:bg-indigo-900/20 dark:text-indigo-300 dark:hover:bg-indigo-900/40"
          aria-label={`Practice ${practiceIds.length} interview questions from ${subSubcategory.name} (random order)`}
        >
          Practice
        </Link>
      )}
    </div>
  )
}
