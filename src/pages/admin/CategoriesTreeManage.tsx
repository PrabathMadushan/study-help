import { useState } from 'react'
import { CategoryTreeView } from '../../components/CategoryTreeView'
import { CategoryFormModal, type CategoryFormData } from '../../components/CategoryFormModal'
import type { Category } from '../../types/firestore'
import {
  createCategory,
  updateCategory,
  deleteCategory,
  canDeleteCategory,
} from '../../lib/admin'

export function CategoriesTreeManage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [parentCategory, setParentCategory] = useState<Category | null>(null)

  const handleAddRoot = () => {
    setEditingCategory(null)
    setParentCategory(null)
    setIsModalOpen(true)
  }

  const handleAddChild = (parent: Category) => {
    setEditingCategory(null)
    setParentCategory(parent)
    setIsModalOpen(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setParentCategory(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (category: Category) => {
    try {
      // Check if can delete
      const { canDelete, reason } = await canDeleteCategory(category.id)

      if (!canDelete) {
        const confirmCascade = confirm(
          `${reason}\n\nDo you want to delete this category and all its descendants? This action cannot be undone.`
        )
        if (!confirmCascade) {
          return
        }
        // Cascade delete
        await deleteCategory(category.id, true)
        alert('Category and all descendants deleted successfully')
      } else {
        const confirmDelete = confirm(
          `Are you sure you want to delete "${category.name}"? This action cannot be undone.`
        )
        if (!confirmDelete) {
          return
        }
        await deleteCategory(category.id, false)
        alert('Category deleted successfully')
      }
    } catch (error: any) {
      console.error('Error deleting category:', error)
      const errorMessage = error?.message || error?.toString() || 'Unknown error'
      alert(`Failed to delete category: ${errorMessage}`)
    }
  }

  const handleSubmit = async (data: CategoryFormData) => {
    try {
      if (editingCategory) {
        // Update existing category
        await updateCategory(editingCategory.id, data)
        alert('Category updated successfully')
      } else {
        // Create new category
        await createCategory(data)
        alert('Category created successfully')
      }
    } catch (error: any) {
      console.error('Error saving category:', error)
      const errorMessage = error?.message || error?.toString() || 'Unknown error'
      throw new Error(errorMessage)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
    setParentCategory(null)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Manage Categories
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create and organize categories in a tree structure with unlimited nesting.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Category Types:
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>
              <strong>Container Categories</strong> (isLeaf=false): Can contain child categories but not notes
            </li>
            <li>
              <strong>Leaf Categories</strong> (isLeaf=true): Can contain notes but not child categories
            </li>
          </ul>
        </div>

        <CategoryTreeView
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddChild={handleAddChild}
          onAddRoot={handleAddRoot}
        />
      </div>

      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editingCategory={editingCategory}
        parentCategory={parentCategory}
      />
    </div>
  )
}
