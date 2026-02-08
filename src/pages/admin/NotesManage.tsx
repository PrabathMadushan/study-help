import { useState } from 'react'
import { useCategoryTree } from '../../hooks/useCategoryTree'
import { useNotes } from '../../hooks/useNotes'
import { createNote, updateNote, deleteNote } from '../../lib/admin'
import { RichTextEditor } from '../../components/RichTextEditor'
import { LoadingSpinner } from '../../components/LoadingScreen'
import { CategorySelector } from '../../components/CategorySelector'
import type { Note } from '../../types/firestore'

export function NotesManage() {
  const { tree: categoryTree, loading: treeLoading } = useCategoryTree()
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const { notes, loading: notesLoading } = useNotes(selectedCategoryId)
  
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    interviewAnswer: '',
    order: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedCategoryId) {
      alert('Please select a category first')
      return
    }

    try {
      if (editingId) {
        await updateNote(editingId, formData)
        setEditingId(null)
      } else {
        await createNote({
          ...formData,
          categoryId: selectedCategoryId,
        })
      }
      
      setFormData({ title: '', content: '', interviewAnswer: '', order: 0 })
      setIsCreating(false)
    } catch (error) {
      console.error('Error saving note:', error)
      alert('Error saving note: ' + (error as Error).message)
    }
  }

  const handleEdit = (note: Note) => {
    setFormData({
      title: note.title,
      content: note.content,
      interviewAnswer: note.interviewAnswer || '',
      order: note.order,
    })
    setEditingId(note.id)
    setIsCreating(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return
    
    try {
      await deleteNote(id)
    } catch (error) {
      console.error('Error deleting note:', error)
      alert('Error deleting note: ' + (error as Error).message)
    }
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingId(null)
    setFormData({ title: '', content: '', interviewAnswer: '', order: 0 })
  }

  if (treeLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Manage Learning Articles
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          One learning article (note) per leaf category is recommended. Add content for learners and optional interview answer for legacy practice.
        </p>
      </div>

      {/* Category Selector */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Leaf Category
        </label>
        <CategorySelector
          value={selectedCategoryId}
          onChange={setSelectedCategoryId}
          filterLeafOnly={true}
          placeholder="Choose a leaf category for the learning article"
        />
        {selectedCategoryId && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Use one note per leaf as the learning article. Add flashcards and exam questions in their admin sections.
          </p>
        )}
      </div>

      {selectedCategoryId && (
        <>
          {/* Notes List */}
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Learning Article (Notes in this category)
              </h2>
              {!isCreating && (
                <button
                  onClick={() => setIsCreating(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + Add Note
                </button>
              )}
            </div>

            {notesLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No learning article yet. Add one note for this leaf.
              </div>
            ) : (
              <div className="space-y-4">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          {note.title}
                        </h3>
                        <div 
                          className="text-sm text-gray-600 dark:text-gray-400 prose dark:prose-invert max-w-none line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: note.content }}
                        />
                        <div className="mt-2 text-xs text-gray-500">
                          Order: {note.order}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(note)}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(note.id)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Note Form */}
          {isCreating && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {editingId ? 'Edit Note' : 'Create New Note'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content *
                  </label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(value) => setFormData({ ...formData, content: value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Interview Answer (Optional)
                  </label>
                  <textarea
                    value={formData.interviewAnswer}
                    onChange={(e) => setFormData({ ...formData, interviewAnswer: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Concise answer for interview practice..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingId ? 'Update Note' : 'Create Note'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}

      {!selectedCategoryId && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            Select a leaf category to manage its learning article (one note per leaf recommended).
          </p>
        </div>
      )}
    </div>
  )
}
