import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getNoteById } from '../data/notes'
import { getCategoryById } from '../data/categories'
import { getSubcategoryById } from '../data/subcategories'
import { getSubSubcategoryById } from '../data/subSubcategories'
import { noteContents } from '../notes'
import { useProgress } from '../hooks/useProgress'

export function NotePage() {
  const { id } = useParams<{ id: string }>()
  const note = id ? getNoteById(id) : undefined
  const category = note ? getCategoryById(note.categoryId) : undefined
  const subcategory = note?.subcategoryId && note.categoryId
    ? getSubcategoryById(note.categoryId, note.subcategoryId)
    : undefined
  const subSubcategory =
    note?.subcategoryId && note.subSubcategoryId && note.categoryId
      ? getSubSubcategoryById(note.categoryId, note.subcategoryId, note.subSubcategoryId)
      : undefined
  const { getNoteProgress, setNoteViewed } = useProgress()
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

  const backTo =
    note.subSubcategoryId && note.subcategoryId
      ? `/category/${note.categoryId}/${note.subcategoryId}/${note.subSubcategoryId}`
      : note.subcategoryId
        ? `/category/${note.categoryId}/${note.subcategoryId}`
        : `/category/${note.categoryId}`
  const backLabel = subSubcategory?.name ?? subcategory?.name ?? category?.name ?? note.categoryId

  return (
    <article className="max-w-3xl">
      <Link
        to={backTo}
        className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-4 inline-block"
      >
        Back to {backLabel}
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{note.title}</h1>
      {getContent ? getContent() : (
        <p className="text-gray-500 dark:text-gray-400">Content for this note is not yet available.</p>
      )}
      {progress?.score != null && (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Practice score: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{progress.score}/100</span>
          </p>
          <Link
            to="/review"
            state={{ noteIds: [note.id] }}
            className="mt-2 inline-block text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Practice again
          </Link>
        </div>
      )}
    </article>
  )
}
