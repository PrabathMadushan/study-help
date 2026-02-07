import React, { useEffect } from 'react'
import { CategoryTreeNode } from './CategoryTreeNode'
import { useCategoryTree, type CategoryTree } from '../hooks/useCategoryTree'
import { LoadingSpinner } from './LoadingScreen'
import type { Category } from '../types/firestore'

interface CategoryTreeViewProps {
  rootId?: string | null
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
  onAddChild: (parentCategory: Category) => void
  onAddRoot: () => void
}

export function CategoryTreeView({
  rootId = null,
  onEdit,
  onDelete,
  onAddChild,
  onAddRoot,
}: CategoryTreeViewProps) {
  const { tree, loading, error } = useCategoryTree(rootId)

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="md" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">
          Error loading categories: {error.message}
        </p>
      </div>
    )
  }

  if (tree.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          No categories yet. Create your first category to get started.
        </p>
        <button
          onClick={onAddRoot}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Create Root Category
        </button>
      </div>
    )
  }

  return (
    <div className="category-tree-view">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Category Tree
        </h3>
        <button
          onClick={onAddRoot}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          + Add Root Category
        </button>
      </div>

      <div className="space-y-1">
        {tree.map((node) => (
          <TreeNodeRecursive
            key={node.id}
            node={node}
            level={0}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddChild={onAddChild}
          />
        ))}
      </div>
    </div>
  )
}

interface TreeNodeRecursiveProps {
  node: CategoryTree
  level: number
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
  onAddChild: (parentCategory: Category) => void
}

function TreeNodeRecursive({
  node,
  level,
  onEdit,
  onDelete,
  onAddChild,
}: TreeNodeRecursiveProps) {
  return (
    <CategoryTreeNode
      category={node}
      level={level}
      onEdit={onEdit}
      onDelete={onDelete}
      onAddChild={onAddChild}
    >
      {node.children.map((child) => (
        <TreeNodeRecursive
          key={child.id}
          node={child}
          level={level + 1}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddChild={onAddChild}
        />
      ))}
    </CategoryTreeNode>
  )
}
