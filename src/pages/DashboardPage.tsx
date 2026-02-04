import { Link } from 'react-router-dom'
import { categories } from '../data/categories'
import {
  getSubcategoriesByCategoryId,
  categoryHasSubcategories,
} from '../data/subcategories'
import {
  getSubSubcategoriesBySubcategory,
  subcategoryHasSubSubcategories,
} from '../data/subSubcategories'
import { getNotesByCategoryId } from '../data/notes'
import { ProgressBar, CircularProgress } from '../components/ProgressBar'
import { useProgress } from '../hooks/useProgress'

function ScoreBadge({ score }: { score: number | undefined }) {
  if (score == null) {
    return (
      <span className="inline-flex items-center justify-end w-8 text-xs text-gray-400 dark:text-gray-500 leading-tight shrink-0">—</span>
    )
  }

  const variant =
    score >= 70
      ? 'text-emerald-600 dark:text-emerald-400'
      : score >= 40
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-red-500 dark:text-red-400'

  return (
    <span className={`inline-flex items-center justify-end w-8 text-xs font-semibold tabular-nums leading-tight shrink-0 ${variant}`}>
      {score}%
    </span>
  )
}

export function DashboardPage() {
  const {
    getOverallProgress,
    getCategoryProgress,
    getSubcategoryProgress,
    getSubSubcategoryProgress,
    getNoteProgress,
  } = useProgress()

  const overall = getOverallProgress()

  // Calculate stats
  const totalNotes = categories.reduce((acc, cat) => {
    return acc + getNotesByCategoryId(cat.id).length
  }, 0)

  const completedNotes = categories.reduce((acc, cat) => {
    const notes = getNotesByCategoryId(cat.id)
    return acc + notes.filter((n) => (getNoteProgress(n.id).score ?? 0) >= 70).length
  }, 0)

  const inProgressNotes = categories.reduce((acc, cat) => {
    const notes = getNotesByCategoryId(cat.id)
    return acc + notes.filter((n) => {
      const score = getNoteProgress(n.id).score
      return score != null && score > 0 && score < 70
    }).length
  }, 0)

  return (
    <div className="space-y-5 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400">
          Track your progress across all modules.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* Overall Progress Card */}
        <div className="col-span-2 lg:col-span-1 rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-4 sm:p-6 text-white shadow-xl shadow-violet-500/25">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-violet-100 text-xs sm:text-sm font-medium">Overall Score</p>
              <p className="mt-0.5 sm:mt-1 text-3xl sm:text-4xl font-bold tabular-nums">{overall}%</p>
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="mt-3 sm:mt-4 h-1.5 sm:h-2 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${overall}%` }}
            />
          </div>
        </div>

        {/* Mastered */}
        <div className="rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-3 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Mastered</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{completedNotes}</p>
            </div>
          </div>
          <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 hidden sm:block">Notes with 70%+ score</p>
        </div>

        {/* In Progress */}
        <div className="rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-3 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">In Progress</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{inProgressNotes}</p>
            </div>
          </div>
          <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 hidden sm:block">Notes under 70%</p>
        </div>

        {/* Not Started */}
        <div className="rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-3 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Not Started</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
                {totalNotes - completedNotes - inProgressNotes}
              </p>
            </div>
          </div>
          <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 hidden sm:block">Notes to begin</p>
        </div>
      </div>

      {/* Module Breakdown */}
      <section>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-5">Progress by Module</h2>
        
        <div className="space-y-3 sm:space-y-4">
          {categories.map((category) => {
            const categoryProgress = getCategoryProgress(category.id)
            const hasSubs = categoryHasSubcategories(category.id)
            const subcategories = hasSubs ? getSubcategoriesByCategoryId(category.id) : []

            return (
              <div
                key={category.id}
                className="rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 overflow-hidden shadow-sm"
              >
                {/* Category header */}
                <div className="px-3 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between gap-2 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                      <div className="shrink-0 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center">
                        <span className="inline-flex items-center justify-center text-sm sm:text-lg font-bold text-violet-700 dark:text-violet-300 leading-none">{categoryProgress}%</span>
                      </div>
                      <div className="min-w-0 flex flex-col justify-center">
                        <Link
                          to={`/category/${category.id}`}
                          className="inline-flex items-center text-sm sm:text-lg font-semibold text-gray-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 transition-colors truncate leading-tight"
                        >
                          {category.name}
                        </Link>
                        {category.description && (
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate hidden sm:block leading-tight">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <Link
                      to={`/category/${category.id}`}
                      className="shrink-0 inline-flex items-center justify-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors"
                    >
                      <span className="hidden sm:inline">View</span>
                      <svg className="w-4 h-4 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* Subcategories (and sub-subcategories) + note-level scores */}
                <div className="px-3 sm:px-6 py-3 sm:py-5">
                  {hasSubs ? (
                    <div className="space-y-4 sm:space-y-5">
                      {subcategories.map((sub) => {
                        const subProgress = getSubcategoryProgress(category.id, sub.id)
                        const hasSubSubs = subcategoryHasSubSubcategories(category.id, sub.id)
                        const subSubs = hasSubSubs
                          ? getSubSubcategoriesBySubcategory(category.id, sub.id)
                          : []
                        const notesInSub = getNotesByCategoryId(category.id, sub.id)

                        return (
                          <div key={sub.id} className="sm:border-l-2 sm:border-violet-200 dark:sm:border-violet-800 sm:pl-4">
                            <div className="flex items-center justify-between gap-2 sm:gap-4 mb-2 sm:mb-3">
                              <Link
                                to={`/category/${category.id}/${sub.id}`}
                                className="inline-flex items-center font-medium text-gray-800 dark:text-gray-200 hover:text-violet-600 dark:hover:text-violet-400 transition-colors leading-tight min-w-0 truncate"
                              >
                                {sub.name}
                              </Link>
                              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                                <div className="w-16 sm:w-24 flex items-center">
                                  <ProgressBar value={subProgress} size="sm" />
                                </div>
                                <span className="inline-flex items-center justify-end w-8 sm:w-10 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 tabular-nums leading-tight">
                                  {subProgress}%
                                </span>
                              </div>
                            </div>

                            {hasSubSubs ? (
                              <div className="ml-0 sm:ml-3 space-y-3">
                                {subSubs.map((subSub) => {
                                  const subSubProgress = getSubSubcategoryProgress(
                                    category.id,
                                    sub.id,
                                    subSub.id
                                  )
                                  const notesInSubSub = getNotesByCategoryId(
                                    category.id,
                                    sub.id,
                                    subSub.id
                                  )
                                  return (
                                    <div key={subSub.id}>
                                      <div className="flex items-center justify-between gap-2 sm:gap-3 mb-2">
                                        <Link
                                          to={`/category/${category.id}/${sub.id}/${subSub.id}`}
                                          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors leading-tight min-w-0 truncate"
                                        >
                                          {subSub.name}
                                        </Link>
                                        <div className="flex items-center gap-2 shrink-0">
                                          <div className="w-12 sm:w-20 flex items-center">
                                            <ProgressBar value={subSubProgress} size="sm" />
                                          </div>
                                          <span className="inline-flex items-center justify-end w-8 sm:w-10 text-xs text-gray-500 dark:text-gray-500 tabular-nums leading-tight">
                                            {subSubProgress}%
                                          </span>
                                        </div>
                                      </div>
                                      <div className="ml-0 sm:ml-2 space-y-1">
                                        {notesInSubSub.map((note) => {
                                          const { score } = getNoteProgress(note.id)
                                          return (
                                            <div key={note.id} className="flex items-center justify-between gap-2 py-0.5">
                                              <Link
                                                to={`/note/${note.id}`}
                                                className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 truncate transition-colors leading-tight min-w-0"
                                              >
                                                {note.title}
                                              </Link>
                                              <ScoreBadge score={score} />
                                            </div>
                                          )
                                        })}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            ) : (
                              <div className="ml-0 sm:ml-2 space-y-1">
                                {notesInSub.map((note) => {
                                  const { score } = getNoteProgress(note.id)
                                  return (
                                    <div key={note.id} className="flex items-center justify-between gap-2 py-0.5">
                                      <Link
                                        to={`/note/${note.id}`}
                                        className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 truncate transition-colors leading-tight min-w-0"
                                      >
                                        {note.title}
                                      </Link>
                                      <ScoreBadge score={score} />
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {getNotesByCategoryId(category.id).map((note) => {
                        const { score } = getNoteProgress(note.id)
                        return (
                          <div key={note.id} className="flex items-center justify-between gap-2 py-1 border-b border-gray-100 dark:border-gray-800 last:border-0">
                            <Link
                              to={`/note/${note.id}`}
                              className="inline-flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 truncate transition-colors leading-tight min-w-0"
                            >
                              {note.title}
                            </Link>
                            <ScoreBadge score={score} />
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
