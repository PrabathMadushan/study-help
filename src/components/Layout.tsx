import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

export function Layout() {
  const { user, loading, signOut } = useAuth()
  const { resolvedTheme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950 overflow-x-hidden">
      {/* Decorative background elements - hidden on mobile for performance */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none hidden sm:block">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-200/30 dark:bg-violet-900/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo & Nav */}
            <nav className="flex items-center gap-0.5 sm:gap-2 min-w-0">
              <Link
                to="/"
                className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-colors shrink-0"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white hidden md:block">
                  StudyPro
                </span>
              </Link>

              <div className="flex items-center gap-0.5 sm:gap-1">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `inline-flex items-center justify-center px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                      isActive
                        ? 'text-violet-700 dark:text-violet-300 bg-violet-100/80 dark:bg-violet-900/30'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/80'
                    }`
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `inline-flex items-center justify-center px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                      isActive
                        ? 'text-violet-700 dark:text-violet-300 bg-violet-100/80 dark:bg-violet-900/30'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/80'
                    }`
                  }
                >
                  <span className="sm:hidden">Stats</span>
                  <span className="hidden sm:inline">Dashboard</span>
                </NavLink>
                <NavLink
                  to="/review"
                  className={({ isActive }) =>
                    `inline-flex items-center justify-center px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                      isActive
                        ? 'text-violet-700 dark:text-violet-300 bg-violet-100/80 dark:bg-violet-900/30'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/80'
                    }`
                  }
                >
                  Practice
                </NavLink>
              </div>
            </nav>

            {/* Theme toggle & Auth section */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Theme toggle button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-colors"
                title={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {resolvedTheme === 'dark' ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {!loading && (
                <>
                  {user ? (
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="hidden sm:flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium shadow-lg shadow-violet-500/25">
                          {user.email?.[0].toUpperCase() ?? 'U'}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[100px] lg:max-w-[140px] hidden md:block" title={user.email ?? undefined}>
                          {user.email}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-colors whitespace-nowrap"
                      >
                        <span className="hidden sm:inline">Sign out</span>
                        <span className="sm:hidden">Exit</span>
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      className="px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25"
                    >
                      Sign in
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative border-t border-gray-200/50 dark:border-gray-800/50 mt-auto">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
          <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Study smarter, not harder.
          </p>
        </div>
      </footer>
    </div>
  )
}
