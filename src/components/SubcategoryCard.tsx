import { Link } from 'react-router-dom'
import type { Subcategory } from '../data/subcategories'
import { ProgressBar } from './ProgressBar'
import { useProgress } from '../hooks/useProgress'
import { notes } from '../data/notes'

type SubcategoryCardProps = {
  subcategory: Subcategory
}

export function SubcategoryCard({ subcategory }: SubcategoryCardProps) {
  const { getSubcategoryProgress } = useProgress()
  const progress = getSubcategoryProgress(subcategory.categoryId, subcategory.id)
  const noteCount = notes.filter(
    (n) => n.categoryId === subcategory.categoryId && n.subcategoryId === subcategory.id
  ).length

  return (
    <Link
      to={`/category/${subcategory.categoryId}/${subcategory.id}`}
      className="block rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200"
    >
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{subcategory.name}</h2>
      {subcategory.description && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subcategory.description}</p>
      )}
      <div className="mt-3 flex items-center gap-3">
        <ProgressBar value={progress} className="flex-1" showLabel />
        <span className="text-xs text-gray-500 dark:text-gray-400">{noteCount} notes</span>
      </div>
    </Link>
  )
}
