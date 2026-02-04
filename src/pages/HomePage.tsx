import { Link } from 'react-router-dom'
import { categories } from '../data/categories'
import { CategoryCard } from '../components/CategoryCard'
import { getNoteIdsWithFlashcards } from '../data/flashcards'
import { useProgress } from '../hooks/useProgress'

export function HomePage() {
  const hasFlashcards = getNoteIdsWithFlashcards().length > 0
  const flashcardCount = getNoteIdsWithFlashcards().length
  const { getOverallProgress } = useProgress()
  const overallProgress = getOverallProgress()

  return (
    <div className="space-y-6 sm:space-y-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-5 sm:p-8 lg:p-10 text-white shadow-xl sm:shadow-2xl shadow-violet-500/25">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        
        <div className="relative">
          {/* Progress and Title Row */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                Welcome back!
              </h1>
              <p className="text-violet-100 text-sm sm:text-base lg:text-lg max-w-xl">
                Master your interview skills with structured study notes and AI-powered practice.
              </p>
            </div>
            
            {/* Progress circle - smaller on mobile */}
            <div className="shrink-0 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2 sm:p-4 border border-white/20">
              <div className="w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-white/20 flex flex-col items-center justify-center">
                <span className="text-lg sm:text-2xl lg:text-3xl font-bold">{overallProgress}%</span>
                <span className="text-[10px] sm:text-xs text-violet-200 hidden sm:block">Complete</span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
            {hasFlashcards && (
              <Link
                to="/review"
                state={{ startDeck: 'all' as const }}
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-white text-violet-700 font-semibold hover:bg-violet-50 transition-all shadow-lg text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start Practice
              </Link>
            )}
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
          
          {/* Stats - horizontal scroll on mobile */}
          <div className="flex gap-4 sm:gap-6 mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-white/20 overflow-x-auto">
            <div className="shrink-0">
              <p className="text-xl sm:text-2xl font-bold">{categories.length}</p>
              <p className="text-xs sm:text-sm text-violet-200">Categories</p>
            </div>
            <div className="shrink-0">
              <p className="text-xl sm:text-2xl font-bold">{flashcardCount}</p>
              <p className="text-xs sm:text-sm text-violet-200">Questions</p>
            </div>
            <div className="shrink-0">
              <p className="text-xl sm:text-2xl font-bold">{overallProgress}%</p>
              <p className="text-xs sm:text-sm text-violet-200">Mastery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Study Categories</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm sm:text-base">
            Choose a topic to explore and practice
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>
    </div>
  )
}
