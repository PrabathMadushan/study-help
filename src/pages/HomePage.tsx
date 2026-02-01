import { Link } from 'react-router-dom'
import { categories } from '../data/categories'
import { CategoryCard } from '../components/CategoryCard'
import { getNoteIdsWithFlashcards } from '../data/flashcards'

export function HomePage() {
  const hasFlashcards = getNoteIdsWithFlashcards().length > 0

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Study Notes</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Choose a category to view and track your study progress.
          </p>
        </div>
        {hasFlashcards && (
          <Link
            to="/review"
            state={{ startDeck: 'all' as const }}
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors shrink-0"
          >
            Practice (random all)
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  )
}
