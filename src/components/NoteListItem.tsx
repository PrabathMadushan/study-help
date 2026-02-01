import { Link } from 'react-router-dom'
import type { Note } from '../data/notes'
import { useProgress } from '../hooks/useProgress'

type NoteListItemProps = {
  note: Note
}

export function NoteListItem({ note }: NoteListItemProps) {
  const { getNoteProgress } = useProgress()
  const progress = getNoteProgress(note.id)
  const score = progress?.score

  return (
    <Link
      to={`/note/${note.id}`}
      className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
    >
      <span className="font-medium text-gray-900 dark:text-white truncate">{note.title}</span>
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 shrink-0">
        {score != null ? `${score}/100` : '—'}
      </span>
    </Link>
  )
}
