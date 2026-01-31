import { categories } from '../data/categories'
import { CategoryCard } from '../components/CategoryCard'

export function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Study Notes</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Choose a category to view and track your study progress.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  )
}
