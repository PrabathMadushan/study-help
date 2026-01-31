import { Outlet, Link } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'
import { ProgressBar } from './ProgressBar'

export function Layout() {
  const { getOverallProgress } = useProgress()
  const overallProgress = getOverallProgress()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="text-xl font-semibold text-gray-900 dark:text-white shrink-0">
            Study Notes
          </Link>
          <div className="flex items-center gap-3 min-w-0 max-w-xs sm:max-w-sm">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
              Overall
            </span>
            <ProgressBar value={overallProgress} className="flex-1 min-w-0" showLabel />
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
