import { useState } from 'react'
import { useSubjects } from '../../hooks/useSubjects'
import { useCategories } from '../../hooks/useCategories'
import { createCategory, updateCategory, deleteCategory } from '../../lib/admin'
import { LoadingSpinner } from '../../components/LoadingScreen'

export function CategoriesManage() {
  const { subjects, loading: subjectsLoading } = useSubjects()
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null)
  const { categories, loading: categoriesLoading } = useCategories(selectedSubjectId)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    subjectId: '',
    name: '',
    description: '',
    icon: '',
    order: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateCategory(editingId, formData)
        setEditingId(null)
      } else {
        await createCategory({ ...formData, subjectId: selectedSubjectId! })
      }
      setFormData({ subjectId: '', name: '', description: '', icon: '', order: 0 })
      setIsCreating(false)
    } catch (error: any) {
      console.error('Error saving category:', error)
      const errorMessage = error?.message || error?.toString() || 'Unknown error'
      alert(`Failed to save category: ${errorMessage}`)
    }
  }

  const handleEdit = (category: typeof categories[0]) => {
    setEditingId(category.id)
    setFormData({
      subjectId: category.subjectId || '',
      name: category.name,
      description: category.description || '',
      icon: category.icon || '',
      order: category.order,
    })
    setIsCreating(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return
    }
    try {
      await deleteCategory(id)
    } catch (error: any) {
      console.error('Error deleting category:', error)
      const errorMessage = error?.message || error?.toString() || 'Unknown error'
      alert(`Failed to delete category: ${errorMessage}`)
    }
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingId(null)
    setFormData({ subjectId: '', name: '', description: '', icon: '', order: 0 })
  }

  if (subjectsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Manage Categories</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Select Subject</label>
        <select
          value={selectedSubjectId || ''}
          onChange={(e) => setSelectedSubjectId(e.target.value || null)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="">-- Select a Subject --</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.icon} {subject.name}
            </option>
          ))}
        </select>
      </div>

      {selectedSubjectId && (
        <>
          <div className="flex justify-end mb-6">
            {!isCreating && (
              <button
                onClick={() => setIsCreating(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                + New Category
              </button>
            )}
          </div>

          {isCreating && (
            <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                {editingId ? 'Edit Category' : 'Create New Category'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Icon (emoji)</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="💻"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {categoriesLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="md" />
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md flex justify-between items-start"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{category.icon}</span>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{category.name}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{category.description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Order: {category.order}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {categories.length === 0 && !isCreating && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-12">
                  No categories yet. Create your first category to get started.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
