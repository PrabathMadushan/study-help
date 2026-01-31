import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'
import { useAuth } from '../contexts/AuthContext'
import { ProgressBar } from './ProgressBar'

export function Layout() {
  const { getOverallProgress, getDueCount } = useProgress()
  const overallProgress = getOverallProgress()
  const dueCount = getDueCount()
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="text-xl font-semibold text-gray-900 dark:text-white">
              Study Notes
            </Link>
            <Link
              to="/review"
              className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Review
              {dueCount > 0 && (
                <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 text-xs font-medium">
                  {dueCount}
                </span>
              )}
            </Link>
          </div>
          <div className="flex items-center gap-3 min-w-0 flex-1 justify-end">
            <div className="flex items-center gap-3 min-w-0 max-w-xs sm:max-w-sm">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                Overall
              </span>
              <ProgressBar value={overallProgress} className="flex-1 min-w-0" showLabel />
            </div>
            {!loading && (
              <div className="flex items-center gap-2 shrink-0">
                {user ? (
                  <>
                    <span className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[120px] sm:max-w-[180px]" title={user.email ?? undefined}>
                      {user.email}
                    </span>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                    Log in
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
