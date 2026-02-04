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
import { ProgressBar, CircularProgress } from '../components/ProgressBar'
import { useProgress } from '../hooks/useProgress'

function PageHeader({
  title,
  description,
  progress,
  practiceIds,
  practiceLabel,
  backLink,
}: {
  title: string
  description?: string
  progress: number
  practiceIds: string[]
  practiceLabel: string
  backLink: { to: string; label: string }
}) {
  return (
    <div className="mb-5 sm:mb-8">
      {/* Back link */}
      <Link
        to={backLink.to}
        className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors mb-3 sm:mb-4"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="truncate">{backLink.label}</span>
      </Link>

      {/* Header content */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="shrink-0">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex flex-col items-center justify-center">
              <span className="text-lg sm:text-2xl font-bold text-violet-700 dark:text-violet-300">{progress}%</span>
            </div>
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white truncate">
              {title}
            </h1>
            {description && (
              <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{description}</p>
            )}
          </div>
        </div>

        {practiceIds.length > 0 && (
          <Link
            to="/review"
            state={{ noteIds: practiceIds }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-violet-500/25 shrink-0"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden sm:inline">{practiceLabel}</span>
            <span className="sm:hidden">Practice</span>
          </Link>
        )}
      </div>
    </div>
  )
}

function NotFoundMessage({ message, backLink }: { message: string; backLink: { to: string; label: string } }) {
  return (
    <div className="max-w-md mx-auto text-center py-16">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
      <Link to={backLink.to} className="btn-secondary inline-flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {backLink.label}
      </Link>
    </div>
  )
}

export function CategoryPage() {
  const { id, subId, subSubId } = useParams<{ id: string; subId?: string; subSubId?: string }>()
  const category = id ? getCategoryById(id) : undefined
  const hasSubs = id ? categoryHasSubcategories(id) : false
  const subcategory = id && subId ? getSubcategoryById(id, subId) : undefined
  const hasSubSubs = id && subId ? subcategoryHasSubSubcategories(id, subId) : false
  const subSubcategory =
    id && subId && subSubId ? getSubSubcategoryById(id, subId, subSubId) : undefined
  const notesInCategory = id ? getNotesByCategoryId(id, subId, subSubId) : []
  const { getCategoryProgress, getSubcategoryProgress, getSubSubcategoryProgress } = useProgress()
  const progress = id
    ? subSubId && subId
      ? getSubSubcategoryProgress(id, subId, subSubId)
      : subId
        ? getSubcategoryProgress(id, subId)
        : getCategoryProgress(id)
    : 0

  // Category not found
  if (!id || !category) {
    return (
      <NotFoundMessage
        message="Category not found."
        backLink={{ to: '/', label: 'Back to home' }}
      />
    )
  }

  // Show subcategories for a category
  if (hasSubs && !subId) {
    const subcategories = getSubcategoriesByCategoryId(id)
    const categoryNoteIds = getNotesByCategoryId(id).map((n) => n.id)
    const practiceIds = filterNoteIdsWithFlashcards(categoryNoteIds)

    return (
      <div>
        <PageHeader
          title={category.name}
          description={category.description}
          progress={progress}
          practiceIds={practiceIds}
          practiceLabel={`Practice ${category.name}`}
          backLink={{ to: '/', label: 'Back to categories' }}
        />

        <section>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Subcategories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {subcategories.map((sub) => (
              <SubcategoryCard key={sub.id} subcategory={sub} />
            ))}
          </div>
        </section>
      </div>
    )
  }

  // Subcategory not found
  if (hasSubs && subId && !subcategory) {
    return (
      <NotFoundMessage
        message="Subcategory not found."
        backLink={{ to: `/category/${id}`, label: `Back to ${category.name}` }}
      />
    )
  }

  // Show sub-subcategories for a subcategory
  if (hasSubs && subId && hasSubSubs && !subSubId) {
    const subSubcategoriesList = getSubSubcategoriesBySubcategory(id!, subId!)
    const practiceNoteIds = getNotesByCategoryId(id!, subId).map((n) => n.id)
    const practiceIds = filterNoteIdsWithFlashcards(practiceNoteIds)

    return (
      <div>
        <PageHeader
          title={subcategory!.name}
          description={subcategory!.description}
          progress={progress}
          practiceIds={practiceIds}
          practiceLabel={`Practice ${subcategory!.name}`}
          backLink={{ to: `/category/${id}`, label: `Back to ${category.name}` }}
        />

        <section>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Topics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {subSubcategoriesList.map((subSub) => (
              <SubSubcategoryCard key={subSub.id} subSubcategory={subSub} />
            ))}
          </div>
        </section>
      </div>
    )
  }

  // Topic not found
  if (hasSubs && subId && subSubId && !subSubcategory) {
    return (
      <NotFoundMessage
        message="Topic not found."
        backLink={{ to: `/category/${id}/${subId}`, label: `Back to ${subcategory!.name}` }}
      />
    )
  }

  // Show notes list
  const backLink =
    hasSubs && subSubId && subcategory
      ? { to: `/category/${id}/${subId}`, label: `Back to ${subcategory.name}` }
      : hasSubs && subcategory
        ? { to: `/category/${id}`, label: `Back to ${category.name}` }
        : { to: '/', label: 'Back to categories' }

  const practiceNoteIds = notesInCategory.map((n) => n.id)
  const practiceIds = filterNoteIdsWithFlashcards(practiceNoteIds)
  const title = subSubcategory?.name ?? subcategory?.name ?? category.name
  const description = subSubcategory?.description ?? subcategory?.description ?? category.description
  const practiceLabel = `Practice ${title}`

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        progress={progress}
        practiceIds={practiceIds}
        practiceLabel={practiceLabel}
        backLink={backLink}
      />

      <section>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Notes</h2>
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {notesInCategory.length} {notesInCategory.length === 1 ? 'note' : 'notes'}
          </span>
        </div>

        {notesInCategory.length > 0 ? (
          <div className="space-y-2 sm:space-y-3">
            {notesInCategory.map((note) => (
              <NoteListItem key={note.id} note={note} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-6 sm:p-8 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">No notes in this category yet.</p>
          </div>
        )}
      </section>
    </div>
  )
}
