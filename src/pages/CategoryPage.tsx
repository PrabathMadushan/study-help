import { useParams, Link } from 'react-router-dom'
import { getCategoryById } from '../data/categories'
import { getNotesByCategoryId } from '../data/notes'
import {
  getSubcategoriesByCategoryId,
  getSubcategoryById,
  categoryHasSubcategories,
} from '../data/subcategories'
import {
  getSubSubcategoriesBySubcategory,
  getSubSubcategoryById,
  subcategoryHasSubSubcategories,
} from '../data/subSubcategories'
import { filterNoteIdsWithFlashcards } from '../data/flashcards'
import { NoteListItem } from '../components/NoteListItem'
import { SubcategoryCard } from '../components/SubcategoryCard'
import { SubSubcategoryCard } from '../components/SubSubcategoryCard'
import { ProgressBar } from '../components/ProgressBar'
import { useProgress } from '../hooks/useProgress'

export function CategoryPage() {
  const { id, subId, subSubId } = useParams<{ id: string; subId?: string; subSubId?: string }>()
  const category = id ? getCategoryById(id) : undefined
  const hasSubs = id ? categoryHasSubcategories(id) : false
  const subcategory = id && subId ? getSubcategoryById(id, subId) : undefined
  const hasSubSubs = id && subId ? subcategoryHasSubSubcategories(id, subId) : false
  const subSubcategory =
    id && subId && subSubId ? getSubSubcategoryById(id, subId, subSubId) : undefined
  const notesInCategory = id
    ? getNotesByCategoryId(id, subId, subSubId)
    : []
  const { getCategoryProgress, getSubcategoryProgress, getSubSubcategoryProgress } = useProgress()
  const progress = id
    ? subSubId && subId
      ? getSubSubcategoryProgress(id, subId, subSubId)
      : subId
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
    const categoryNoteIds = getNotesByCategoryId(id).map((n) => n.id)
    const practiceIds = filterNoteIdsWithFlashcards(categoryNoteIds)
    return (
      <div>
        <Link to="/" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-4 inline-block">
          Back to categories
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{category.name}</h1>
            {category.description && (
              <p className="mt-1 text-gray-600 dark:text-gray-400">{category.description}</p>
            )}
          </div>
          {practiceIds.length > 0 && (
            <Link
              to="/review"
              state={{ noteIds: categoryNoteIds }}
              className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors shrink-0"
            >
              Practice (random {category.name})
            </Link>
          )}
        </div>
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

  if (hasSubs && subId && hasSubSubs && !subSubId) {
    const subSubcategoriesList = getSubSubcategoriesBySubcategory(id!, subId!)
    const practiceIds = filterNoteIdsWithFlashcards(
      getNotesByCategoryId(id!, subId).map((n) => n.id)
    )
    return (
      <div>
        <Link
          to={`/category/${id}`}
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-4 inline-block"
        >
          Back to {category!.name}
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{subcategory!.name}</h1>
            {subcategory!.description && (
              <p className="mt-1 text-gray-600 dark:text-gray-400">{subcategory!.description}</p>
            )}
          </div>
          {practiceIds.length > 0 && (
            <Link
              to="/review"
              state={{ noteIds: getNotesByCategoryId(id!, subId).map((n) => n.id) }}
              className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors shrink-0"
            >
              Practice (random {subcategory!.name})
            </Link>
          )}
        </div>
        <div className="mt-4 mb-6">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall progress</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Topics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subSubcategoriesList.map((subSub) => (
            <SubSubcategoryCard key={subSub.id} subSubcategory={subSub} />
          ))}
        </div>
      </div>
    )
  }

  if (hasSubs && subId && subSubId && !subSubcategory) {
    return (
      <div>
        <p className="text-gray-600 dark:text-gray-400">Topic not found.</p>
        <Link
          to={`/category/${id}/${subId}`}
          className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Back to {subcategory!.name}
        </Link>
      </div>
    )
  }

  const backLink =
    hasSubs && subSubId && subcategory
      ? { to: `/category/${id}/${subId}`, label: `Back to ${subcategory.name}` }
      : hasSubs && subcategory
        ? { to: `/category/${id}`, label: `Back to ${category.name}` }
        : { to: '/', label: 'Back to categories' }

  const practiceNoteIds = notesInCategory.map((n) => n.id)
  const practiceIds = filterNoteIdsWithFlashcards(practiceNoteIds)
  const practiceLabel = subSubcategory
    ? `Practice (random ${subSubcategory.name})`
    : subcategory
      ? `Practice (random ${subcategory.name})`
      : `Practice (random ${category.name})`

  return (
    <div>
      <Link to={backLink.to} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-4 inline-block">
        {backLink.label}
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {subSubcategory ? subSubcategory.name : subcategory ? subcategory.name : category.name}
          </h1>
          {(subSubcategory?.description ?? subcategory?.description ?? category.description) && (
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              {subSubcategory?.description ?? subcategory?.description ?? category.description}
            </p>
          )}
        </div>
        {practiceIds.length > 0 && (
          <Link
            to="/review"
            state={{ noteIds: practiceNoteIds }}
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors shrink-0"
          >
            {practiceLabel}
          </Link>
        )}
      </div>
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
