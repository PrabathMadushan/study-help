import { useState } from 'react'
import { useSubjects } from '../../hooks/useSubjects'
import { createSubject, updateSubject, deleteSubject } from '../../lib/admin'
import { LoadingSpinner } from '../../components/LoadingScreen'

export function SubjectsManage() {
  const { subjects, loading } = useSubjects()
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    order: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateSubject(editingId, formData)
        setEditingId(null)
      } else {
        await createSubject(formData)
      }
      setFormData({ name: '', description: '', icon: '', order: 0 })
      setIsCreating(false)
    } catch (error: any) {
      console.error('Error saving subject:', error)
      const errorMessage = error?.message || error?.toString() || 'Unknown error'
      alert(`Failed to save subject: ${errorMessage}`)
    }
  }

  const handleEdit = (subject: typeof subjects[0]) => {
    setEditingId(subject.id)
    setFormData({
      name: subject.name,
      description: subject.description || '',
      icon: subject.icon || '',
      order: subject.order,
    })
    setIsCreating(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subject? This will also delete all related content.')) {
      return
    }
    try {
      await deleteSubject(id)
    } catch (error: any) {
      console.error('Error deleting subject:', error)
      const errorMessage = error?.message || error?.toString() || 'Unknown error'
      alert(`Failed to delete subject: ${errorMessage}`)
    }
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingId(null)
    setFormData({ name: '', description: '', icon: '', order: 0 })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Manage Subjects</h1>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + New Subject
          </button>
        )}
      </div>

      {isCreating && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {editingId ? 'Edit Subject' : 'Create New Subject'}
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
                placeholder="📚"
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

      <div className="space-y-4">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md flex justify-between items-start"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{subject.icon}</span>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{subject.name}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{subject.description}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Order: {subject.order}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(subject)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(subject.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {subjects.length === 0 && !isCreating && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">
            No subjects yet. Create your first subject to get started.
          </p>
        )}
      </div>
    </div>
  )
}
