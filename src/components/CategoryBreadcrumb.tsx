import { Link } from 'react-router-dom'
import { useCategoryPath } from '../hooks/useCategoryPath'

interface CategoryBreadcrumbProps {
  categoryId?: string | null
}

export function CategoryBreadcrumb({ categoryId }: CategoryBreadcrumbProps) {
  const { path, loading } = useCategoryPath(categoryId || null)

  if (loading) {
    return (
      <nav className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </nav>
    )
  }

  return (
    <nav className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
      {/* Home Link */}
      <Link
        to="/"
        className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        Home
      </Link>

      {/* Breadcrumb Trail */}
      {path.map((category, index) => (
        <div key={category.id} className="flex items-center gap-2">
          {/* Chevron */}
          <svg
            className="w-4 h-4 text-gray-400 dark:text-gray-600 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>

          {/* Category Link */}
          <Link
            to={`/graph/${category.id}`}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
              index === path.length - 1
                ? 'text-gray-900 dark:text-gray-100'
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            {category.icon && <span className="text-base">{category.icon}</span>}
            {category.name}
          </Link>
        </div>
      ))}
    </nav>
  )
}
