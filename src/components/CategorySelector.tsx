import React from 'react'
import { useCategoryTree, type CategoryTree } from '../hooks/useCategoryTree'

interface CategorySelectorProps {
  value: string | null
  onChange: (categoryId: string | null) => void
  excludeId?: string  // Exclude this category and its descendants
  allowNull?: boolean  // Allow selecting null (no parent)
  nullLabel?: string  // Label for null option
  filterLeafOnly?: boolean  // Only show leaf categories
  filterContainerOnly?: boolean  // Only show container categories
}

export function CategorySelector({
  value,
  onChange,
  excludeId,
  allowNull = false,
  nullLabel = '(None)',
  filterLeafOnly = false,
  filterContainerOnly = false,
}: CategorySelectorProps) {
  const { tree, loading, error } = useCategoryTree()

  const flattenTree = (nodes: CategoryTree[], level: number = 0): Array<{ category: CategoryTree; level: number }> => {
    const result: Array<{ category: CategoryTree; level: number }> = []
    
    for (const node of nodes) {
      // Skip excluded category and its descendants
      if (excludeId && (node.id === excludeId || node.path.includes(excludeId))) {
        continue
      }
      
      // Apply filters
      if (filterLeafOnly && !node.isLeaf) continue
      if (filterContainerOnly && node.isLeaf) continue
      
      result.push({ category: node, level })
      
      if (node.children.length > 0) {
        result.push(...flattenTree(node.children, level + 1))
      }
    }
    
    return result
  }

  const flatCategories = flattenTree(tree)

  if (loading) {
    return (
      <select
        disabled
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      >
        <option>Loading...</option>
      </select>
    )
  }

  if (error) {
    return (
      <div className="text-sm text-red-600 dark:text-red-400">
        Error loading categories: {error.message}
      </div>
    )
  }

  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value || null)}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      {allowNull && (
        <option value="">{nullLabel}</option>
      )}
      
      {flatCategories.map(({ category, level }) => (
        <option key={category.id} value={category.id}>
          {'  '.repeat(level)}
          {level > 0 && '└─ '}
          {category.icon && `${category.icon} `}
          {category.name}
          {category.isLeaf && ' (leaf)'}
        </option>
      ))}
      
      {flatCategories.length === 0 && !allowNull && (
        <option value="" disabled>
          No categories available
        </option>
      )}
    </select>
  )
}
