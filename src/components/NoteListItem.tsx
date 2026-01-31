import { Link } from 'react-router-dom'
import type { Note } from '../data/notes'
import { useProgress } from '../hooks/useProgress'
import type { ProgressStatus } from '../lib/progress'

type NoteListItemProps = {
  note: Note
}

function StatusBadge({ status }: { status: ProgressStatus }) {
  const styles = {
    not_started: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
    in_progress: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  }
  const labels = {
    not_started: 'Not started',
    in_progress: 'In progress',
    completed: 'Done',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

export function NoteListItem({ note }: NoteListItemProps) {
  const { getNoteProgress } = useProgress()
  const progress = getNoteProgress(note.id)

  return (
    <Link
      to={`/note/${note.id}`}
      className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
    >
      <span className="font-medium text-gray-900 dark:text-white truncate">{note.title}</span>
      <StatusBadge status={progress.status} />
    </Link>
  )
}
