import { Link } from 'react-router-dom'
import type { Note } from '../data/notes'
import { useProgress } from '../hooks/useProgress'

type NoteListItemProps = {
  note: Note
}

function ScoreBadge({ score }: { score: number | undefined }) {
  if (score == null) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 whitespace-nowrap">
        <span className="hidden sm:inline">Not started</span>
        <span className="sm:hidden">—</span>
      </span>
    )
  }

  const variant =
    score >= 70
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
      : score >= 40
        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'

  return (
    <span className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold tabular-nums ${variant}`}>
      {score}%
    </span>
  )
}

export function NoteListItem({ note }: NoteListItemProps) {
  const { getNoteProgress } = useProgress()
  const progress = getNoteProgress(note.id)
  const score = progress?.score

  return (
    <Link
      to={`/note/${note.id}`}
      className="group flex items-center justify-between gap-2 sm:gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 px-3 sm:px-5 py-3 sm:py-4 hover:bg-violet-50/50 dark:hover:bg-violet-900/10 hover:border-violet-300 dark:hover:border-violet-700 transition-all duration-200 active:scale-[0.99]"
    >
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
        <div className="hidden sm:flex shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 items-center justify-center group-hover:from-violet-100 group-hover:to-purple-100 dark:group-hover:from-violet-900/50 dark:group-hover:to-purple-900/50 transition-colors">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
          {note.title}
        </span>
      </div>
      
      <div className="flex items-center gap-1 sm:gap-3 shrink-0">
        <ScoreBadge score={score} />
        <svg className="w-4 h-4 text-gray-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 group-hover:translate-x-1 transition-all hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}
