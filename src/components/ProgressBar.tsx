type ProgressBarProps = {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning'
}

export function ProgressBar({
  value,
  max = 100,
  className = '',
  showLabel = false,
  size = 'md',
  variant = 'default',
}: ProgressBarProps) {
  const pct = Math.min(max, Math.max(0, value))

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  const gradients = {
    default: 'bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500',
    success: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    warning: 'bg-gradient-to-r from-amber-500 to-orange-500',
  }

  // Determine variant based on score if default
  const effectiveVariant =
    variant === 'default'
      ? pct >= 70
        ? 'success'
        : pct >= 40
          ? 'warning'
          : 'default'
      : variant

  return (
    <div className={className}>
      <div
        className={`${heights[size]} w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-inner`}
      >
        <div
          className={`${heights[size]} rounded-full ${gradients[effectiveVariant]} transition-all duration-500 ease-out shadow-sm`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1.5 block tabular-nums">
          {pct}%
        </span>
      )}
    </div>
  )
}

type CircularProgressProps = {
  value: number
  size?: number
  strokeWidth?: number
  className?: string
}

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 8,
  className = '',
}: CircularProgressProps) {
  const pct = Math.min(100, Math.max(0, value))
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (pct / 100) * circumference

  const getColor = () => {
    if (pct >= 70) return { start: '#10b981', end: '#14b8a6' }
    if (pct >= 40) return { start: '#f59e0b', end: '#f97316' }
    return { start: '#6366f1', end: '#a855f7' }
  }

  const color = getColor()
  const gradientId = `progress-gradient-${Math.random().toString(36).slice(2)}`

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color.start} />
            <stop offset="100%" stopColor={color.end} />
          </linearGradient>
        </defs>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-100 dark:text-gray-800"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
          {pct}%
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">Complete</span>
      </div>
    </div>
  )
}
