export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-200/30 dark:bg-violet-900/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Loading content */}
      <div className="relative flex flex-col items-center gap-8">
        {/* Animated logo */}
        <div className="relative">
          {/* Outer ring */}
          <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-violet-200 dark:border-violet-800" />
          
          {/* Spinning ring */}
          <div className="w-24 h-24 rounded-full border-4 border-transparent border-t-violet-600 dark:border-t-violet-400 animate-spin" />
          
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-xl shadow-violet-500/30 animate-pulse">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>

        {/* Brand name */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            StudyPro
          </h1>
          
          {/* Loading dots animation */}
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-gray-500 dark:text-gray-400">Loading</span>
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>

        {/* Shimmer bar */}
        <div className="w-48 h-1.5 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
          <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 animate-shimmer" />
        </div>
      </div>
    </div>
  )
}

// Mini loading spinner for inline use
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full border-violet-200 dark:border-violet-800 border-t-violet-600 dark:border-t-violet-400 animate-spin`} />
  )
}
