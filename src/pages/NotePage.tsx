import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getNoteById } from '../data/notes'
import { getCategoryById } from '../data/categories'
import { getSubcategoryById } from '../data/subcategories'
import { noteContents } from '../notes'
import { useProgress } from '../hooks/useProgress'

export function NotePage() {
  const { id } = useParams<{ id: string }>()
  const note = id ? getNoteById(id) : undefined
  const category = note ? getCategoryById(note.categoryId) : undefined
  const subcategory = note?.subcategoryId && note.categoryId
    ? getSubcategoryById(note.categoryId, note.subcategoryId)
    : undefined
  const { getNoteProgress, setNoteViewed, setNoteCompleted } = useProgress()
  const progress = note ? getNoteProgress(note.id) : undefined
  const getContent = note ? noteContents[note.id] : null

  useEffect(() => {
    if (note) {
      setNoteViewed(note.id)
    }
  }, [note?.id, setNoteViewed])

  if (!id || !note) {
    return (
      <div>
        <p className="text-gray-600 dark:text-gray-400">Note not found.</p>
        <Link to="/" className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:underline">
          Back to home
        </Link>
      </div>
    )
  }

  const isCompleted = progress?.status === 'completed'

  return (
    <article className="max-w-3xl">
      <Link
        to={note.subcategoryId ? `/category/${note.categoryId}/${note.subcategoryId}` : `/category/${note.categoryId}`}
        className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-4 inline-block"
      >
        Back to {subcategory?.name ?? category?.name ?? note.categoryId}
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{note.title}</h1>
      {getContent ? getContent() : (
        <p className="text-gray-500 dark:text-gray-400">Content for this note is not yet available.</p>
      )}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        {!isCompleted ? (
          <button
            type="button"
            onClick={() => setNoteCompleted(note.id)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            Mark as complete
          </button>
        ) : (
          <p className="text-sm text-green-600 dark:text-green-400 font-medium">Completed</p>
        )}
      </div>
    </article>
  )
}
