import React, { useEffect, useState } from 'react'
import type { Category } from '../types/firestore'
import { CategorySelector } from './CategorySelector'


interface CategoryFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CategoryFormData) => Promise<void>
  editingCategory?: Category | null
  parentCategory?: Category | null
}

export interface CategoryFormData {
  parentId: string | null
  name: string
  description?: string
  icon?: string
  color?: string
  isLeaf: boolean
  order: number
}

export function CategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingCategory,
  parentCategory,
}: CategoryFormModalProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    parentId: null,
    name: '',
    description: '',
    icon: '',
    color: '',
    isLeaf: false,
    order: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      if (editingCategory) {
        // Editing existing category
        setFormData({
          parentId: editingCategory.parentId,
          name: editingCategory.name,
          description: editingCategory.description || '',
          icon: editingCategory.icon || '',
          color: editingCategory.color || '',
          isLeaf: editingCategory.isLeaf,
          order: editingCategory.order,
        })
      } else if (parentCategory) {
        // Creating child of parent
        setFormData({
          parentId: parentCategory.id,
          name: '',
          description: '',
          icon: '',
          color: '',
          isLeaf: false,
          order: 0,
        })
      } else {
        // Creating root category
        setFormData({
          parentId: null,
          name: '',
          description: '',
          icon: '',
          color: '',
          isLeaf: false,
          order: 0,
        })
      }
      setError(null)
    }
  }, [isOpen, editingCategory, parentCategory])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      // Clean formData - remove empty strings for optional fields
      const cleanedData: CategoryFormData = {
        parentId: formData.parentId,
        name: formData.name,
        isLeaf: formData.isLeaf,
        order: formData.order,
      }
      
      // Only add optional fields if they have non-empty values
      if (formData.description && formData.description.trim()) {
        cleanedData.description = formData.description.trim()
      }
      if (formData.icon && formData.icon.trim()) {
        cleanedData.icon = formData.icon.trim()
      }
      if (formData.color && formData.color.trim()) {
        cleanedData.color = formData.color.trim()
      }
     console.log(cleanedData)
      await onSubmit(cleanedData)
      onClose()
    } catch (err) {
      console.error('Error submitting category form:', err)
      setError(err instanceof Error ? err.message : 'Failed to save category')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              disabled={isSubmitting}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Parent Selector */}
            {!parentCategory && (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Parent Category
                </label>
                <CategorySelector
                  value={formData.parentId}
                  onChange={(parentId) => setFormData({ ...formData, parentId })}
                  excludeId={editingCategory?.id}
                  allowNull
                  nullLabel="(Root Category)"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Leave empty to create a root category
                </p>
              </div>
            )}

            {parentCategory && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  Creating child of: <strong>{parentCategory.name}</strong>
                </p>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            {/* Icon & Color */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Icon (emoji)
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="📚"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Color (hex)
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="#3B82F6"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Is Leaf */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="isLeaf"
                checked={formData.isLeaf}
                onChange={(e) => setFormData({ ...formData, isLeaf: e.target.checked })}
                className="mt-1 mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isSubmitting}
              />
              <label htmlFor="isLeaf" className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Leaf Category</span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  If checked, this category can contain notes but not child categories.
                  If unchecked, it can contain child categories but not notes.
                </p>
              </label>
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Lower numbers appear first
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
