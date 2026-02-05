import { useState } from 'react'
import { useSubjects } from '../../hooks/useSubjects'
import { useCategories } from '../../hooks/useCategories'
import { useSubcategories } from '../../hooks/useSubcategories'
import { useSubSubcategories } from '../../hooks/useSubSubcategories'
import { useNotes } from '../../hooks/useNotes'
import { createNote, updateNote, deleteNote } from '../../lib/admin'
import { RichTextEditor } from '../../components/RichTextEditor'
import { LoadingSpinner } from '../../components/LoadingScreen'

export function NotesManage() {
  const { subjects, loading: subjectsLoading } = useSubjects()
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null)
  const { categories } = useCategories(selectedSubjectId)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const { subcategories } = useSubcategories(selectedCategoryId)
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null)
  const { subSubcategories } = useSubSubcategories(selectedSubcategoryId)
  const [selectedSubSubcategoryId, setSelectedSubSubcategoryId] = useState<string | null>(null)

  // Determine parent type and ID for fetching notes
  const parentType = selectedSubSubcategoryId ? 'subSubcategory' 
    : selectedSubcategoryId ? 'subcategory' 
    : 'category'
  const parentId = selectedSubSubcategoryId || selectedSubcategoryId || selectedCategoryId

  const { notes, loading: notesLoading } = useNotes(parentId, parentType as any)
  
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    order: 0,
    categoryId: '',
    subcategoryId: '',
    subSubcategoryId: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const noteData = {
        title: formData.title,
        content: formData.content,
        order: formData.order,
        subjectId: selectedSubjectId!,
        categoryId: selectedCategoryId!,
        subcategoryId: selectedSubcategoryId || undefined,
        subSubcategoryId: selectedSubSubcategoryId || undefined,
      }

      if (editingId) {
        await updateNote(editingId, noteData)
        setEditingId(null)
      } else {
        await createNote(noteData)
      }
      setFormData({ title: '', content: '', order: 0, categoryId: '', subcategoryId: '', subSubcategoryId: '' })
      setIsCreating(false)
    } catch (error: any) {
      console.error('Error saving note:', error)
      const errorMessage = error?.message || error?.toString() || 'Unknown error'
      alert(`Failed to save note: ${errorMessage}`)
    }
  }

  const handleEdit = (note: typeof notes[0]) => {
    setEditingId(note.id)
    setFormData({
      title: note.title,
      content: note.content,
      order: note.order,
      categoryId: note.categoryId,
      subcategoryId: note.subcategoryId || '',
      subSubcategoryId: note.subSubcategoryId || '',
    })
    setIsCreating(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return
    }
    try {
      await deleteNote(id)
    } catch (error: any) {
      console.error('Error deleting note:', error)
      const errorMessage = error?.message || error?.toString() || 'Unknown error'
      alert(`Failed to delete note: ${errorMessage}`)
    }
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingId(null)
    setFormData({ title: '', content: '', order: 0, categoryId: '', subcategoryId: '', subSubcategoryId: '' })
  }

  if (subjectsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Manage Notes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Subject</label>
          <select
            value={selectedSubjectId || ''}
            onChange={(e) => {
              setSelectedSubjectId(e.target.value || null)
              setSelectedCategoryId(null)
              setSelectedSubcategoryId(null)
              setSelectedSubSubcategoryId(null)
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">-- Select Subject --</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.icon} {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Category</label>
          <select
            value={selectedCategoryId || ''}
            onChange={(e) => {
              setSelectedCategoryId(e.target.value || null)
              setSelectedSubcategoryId(null)
              setSelectedSubSubcategoryId(null)
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            disabled={!selectedSubjectId}
          >
            <option value="">-- Select Category --</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Subcategory (Optional)</label>
          <select
            value={selectedSubcategoryId || ''}
            onChange={(e) => {
              setSelectedSubcategoryId(e.target.value || null)
              setSelectedSubSubcategoryId(null)
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            disabled={!selectedCategoryId}
          >
            <option value="">-- Select Subcategory --</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Sub-Subcategory (Optional)</label>
          <select
            value={selectedSubSubcategoryId || ''}
            onChange={(e) => setSelectedSubSubcategoryId(e.target.value || null)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            disabled={!selectedSubcategoryId}
          >
            <option value="">-- Select Sub-Subcategory --</option>
            {subSubcategories.map((subSubcategory) => (
              <option key={subSubcategory.id} value={subSubcategory.id}>
                {subSubcategory.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedCategoryId && (
        <>
          <div className="flex justify-end mb-6">
            {!isCreating && (
              <button
                onClick={() => setIsCreating(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                + New Note
              </button>
            )}
          </div>

          {isCreating && (
            <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                {editingId ? 'Edit Note' : 'Create New Note'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Content</label>
                  <RichTextEditor
                    content={formData.content}
                    onChange={(html) => setFormData({ ...formData, content: html })}
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

          {notesLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="md" />
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{note.title}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(note)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div 
                    className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400"
                    dangerouslySetInnerHTML={{ __html: note.content }}
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-3">Order: {note.order}</p>
                </div>
              ))}
              {notes.length === 0 && !isCreating && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-12">
                  No notes yet. Create your first note to get started.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
