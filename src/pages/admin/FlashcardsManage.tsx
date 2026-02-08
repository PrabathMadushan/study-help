import { useState } from 'react'
import { useFlashcards } from '../../hooks/useFlashcards'
import { createFlashcard, updateFlashcard, deleteFlashcard } from '../../lib/admin'
import { LoadingSpinner } from '../../components/LoadingScreen'
import { CategorySelector } from '../../components/CategorySelector'
import type { Flashcard } from '../../types/firestore'

export function FlashcardsManage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const { flashcards, loading: flashcardsLoading } = useFlashcards(selectedCategoryId)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ question: '', answer: '', order: 0 })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategoryId) {
      alert('Please select a category first')
      return
    }
    try {
      if (editingId) {
        await updateFlashcard(editingId, formData)
        setEditingId(null)
      } else {
        await createFlashcard({
          ...formData,
          categoryId: selectedCategoryId,
        })
      }
      setFormData({ question: '', answer: '', order: 0 })
      setIsCreating(false)
    } catch (error) {
      console.error('Error saving flashcard:', error)
      alert('Error saving flashcard: ' + (error as Error).message)
    }
  }

  const handleEdit = (fc: Flashcard) => {
    setFormData({ question: fc.question, answer: fc.answer, order: fc.order })
    setEditingId(fc.id)
    setIsCreating(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this flashcard?')) return
    try {
      await deleteFlashcard(id)
    } catch (error) {
      console.error('Error deleting flashcard:', error)
      alert('Error: ' + (error as Error).message)
    }
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingId(null)
    setFormData({ question: '', answer: '', order: 0 })
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Manage Flashcards
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Add practice Q&A per leaf category.
        </p>
      </div>

      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Leaf Category
        </label>
        <CategorySelector
          value={selectedCategoryId}
          onChange={setSelectedCategoryId}
          filterLeafOnly={true}
        />
      </div>

      {selectedCategoryId && (
        <>
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Flashcards in Category
              </h2>
              {!isCreating && (
                <button
                  onClick={() => setIsCreating(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + Add Flashcard
                </button>
              )}
            </div>

            {flashcardsLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : flashcards.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No flashcards yet. Add one for practice.
              </div>
            ) : (
              <div className="space-y-4">
                {flashcards.map((fc) => (
                  <div
                    key={fc.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">Q: {fc.question}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">A: {fc.answer}</p>
                        <p className="text-xs text-gray-500 mt-2">Order: {fc.order}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleEdit(fc)}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded hover:bg-blue-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(fc.id)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded hover:bg-red-200"
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

          {isCreating && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {editingId ? 'Edit Flashcard' : 'New Flashcard'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Question *</label>
                  <input
                    type="text"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Answer *</label>
                  <textarea
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    {editingId ? 'Update' : 'Create'}
                  </button>
                  <button type="button" onClick={handleCancel} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
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
          <p className="text-gray-600 dark:text-gray-400">Select a leaf category to manage flashcards.</p>
        </div>
      )}
    </div>
  )
}
