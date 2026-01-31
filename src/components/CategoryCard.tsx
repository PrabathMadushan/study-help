import { Link } from 'react-router-dom'
import type { Category } from '../data/categories'
import { ProgressBar } from './ProgressBar'
import { useProgress } from '../hooks/useProgress'
import { notes } from '../data/notes'

type CategoryCardProps = {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  const { getCategoryProgress } = useProgress()
  const progress = getCategoryProgress(category.id)
  const noteCount = notes.filter((n) => n.categoryId === category.id).length

  return (
    <Link
      to={`/category/${category.id}`}
      className="block rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200"
    >
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{category.name}</h2>
      {category.description && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{category.description}</p>
      )}
      <div className="mt-4 flex items-center gap-3">
        <ProgressBar value={progress} className="flex-1" showLabel />
        <span className="text-xs text-gray-500 dark:text-gray-400">{noteCount} notes</span>
      </div>
    </Link>
  )
}
