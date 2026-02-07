import { Link } from 'react-router-dom'
import { useCategories } from '../hooks/useCategories'
import { LoadingScreen } from '../components/LoadingScreen'

export function HomePage() {
  const { categories: rootCategories, loading } = useCategories(null)

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="space-y-6 sm:space-y-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-5 sm:p-8 lg:p-10 text-white shadow-xl sm:shadow-2xl shadow-violet-500/25">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        
        <div className="relative">
          {/* Title Row */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                Welcome to Study Help
              </h1>
              <p className="text-violet-100 text-sm sm:text-base lg:text-lg max-w-xl">
                Explore categories and organize your learning journey with interactive graph navigation.
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
            <Link
              to="/graph"
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-white text-violet-700 font-semibold hover:bg-violet-50 transition-all shadow-lg text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Explore Graph View
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-white/20 backdrop-blur-sm text-white font-semibold hover:bg-white/30 transition-all border border-white/25 text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Progress
            </Link>
          </div>
          
          {/* Stats */}
          <div className="flex gap-4 sm:gap-6 mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-white/20 overflow-x-auto">
            <div className="shrink-0">
              <p className="text-xl sm:text-2xl font-bold">{rootCategories.length}</p>
              <p className="text-xs sm:text-sm text-violet-200">Root Categories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Root Categories</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm sm:text-base">
            Choose a category to explore in graph view
          </p>
        </div>
        
        {rootCategories.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No categories yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Get started by creating your first category in the admin panel.
            </p>
            <Link
              to="/admin/categories"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create First Category
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
            {rootCategories.map((category) => (
              <Link
                key={category.id}
                to={`/graph/${category.id}`}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="relative z-10">
                  {category.icon && (
                    <div className="text-4xl mb-3">{category.icon}</div>
                  )}
                  <h3 className="text-lg font-bold mb-2">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-white/80 line-clamp-2">{category.description}</p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-white/60">
                      {category.isLeaf ? 'Leaf Category' : 'Container Category'}
                    </span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
