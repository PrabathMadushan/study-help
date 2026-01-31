import { useParams, Link } from 'react-router-dom'
import { getCategoryById } from '../data/categories'
import { getNotesByCategoryId } from '../data/notes'
import {
  getSubcategoriesByCategoryId,
  getSubcategoryById,
  categoryHasSubcategories,
} from '../data/subcategories'
import { NoteListItem } from '../components/NoteListItem'
import { SubcategoryCard } from '../components/SubcategoryCard'
import { ProgressBar } from '../components/ProgressBar'
import { useProgress } from '../hooks/useProgress'

export function CategoryPage() {
  const { id, subId } = useParams<{ id: string; subId?: string }>()
  const category = id ? getCategoryById(id) : undefined
  const hasSubs = id ? categoryHasSubcategories(id) : false
  const subcategory = id && subId ? getSubcategoryById(id, subId) : undefined
  const notesInCategory = id
    ? getNotesByCategoryId(id, subId)
    : []
  const { getCategoryProgress, getSubcategoryProgress } = useProgress()
  const progress = id
    ? subId
      ? getSubcategoryProgress(id, subId)
      : getCategoryProgress(id)
    : 0

  if (!id || !category) {
    return (
      <div>
        <p className="text-gray-600 dark:text-gray-400">Category not found.</p>
        <Link to="/" className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:underline">
          Back to home
        </Link>
      </div>
    )
  }

  if (hasSubs && !subId) {
    const subcategories = getSubcategoriesByCategoryId(id)
    return (
      <div>
        <Link to="/" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-4 inline-block">
          Back to categories
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{category.name}</h1>
        {category.description && (
          <p className="mt-1 text-gray-600 dark:text-gray-400">{category.description}</p>
        )}
        <div className="mt-4 mb-6">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall progress</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Subcategories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subcategories.map((sub) => (
            <SubcategoryCard key={sub.id} subcategory={sub} />
          ))}
        </div>
      </div>
    )
  }

  if (hasSubs && subId && !subcategory) {
    return (
      <div>
        <p className="text-gray-600 dark:text-gray-400">Subcategory not found.</p>
        <Link to={`/category/${id}`} className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:underline">
          Back to {category.name}
        </Link>
      </div>
    )
  }

  const backLink = hasSubs && subcategory
    ? { to: `/category/${id}`, label: `Back to ${category.name}` }
    : { to: '/', label: 'Back to categories' }

  return (
    <div>
      <Link to={backLink.to} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-4 inline-block">
        {backLink.label}
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        {subcategory ? subcategory.name : category.name}
      </h1>
      {(subcategory?.description ?? category.description) && (
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          {subcategory?.description ?? category.description}
        </p>
      )}
      <div className="mt-4 mb-6">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{progress}%</span>
        </div>
        <ProgressBar value={progress} />
      </div>
      <ul className="space-y-2">
        {notesInCategory.map((note) => (
          <li key={note.id}>
            <NoteListItem note={note} />
          </li>
        ))}
      </ul>
      {notesInCategory.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">No notes in this category yet.</p>
      )}
    </div>
  )
}
