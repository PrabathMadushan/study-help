import React, { useState } from 'react'
import type { Category } from '../types/firestore'

interface CategoryTreeNodeProps {
  category: Category
  level: number
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
  onAddChild: (parentCategory: Category) => void
  children?: React.ReactNode
}

export function CategoryTreeNode({
  category,
  level,
  onEdit,
  onDelete,
  onAddChild,
  children,
}: CategoryTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const hasChildren = React.Children.count(children) > 0

  const indentStyle = {
    paddingLeft: `${level * 24}px`,
  }

  return (
    <div className="category-tree-node">
      <div
        className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg group"
        style={indentStyle}
      >
        {/* Expand/Collapse Button */}
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        )}
        
        {!hasChildren && <div className="w-5" />}

        {/* Icon */}
        {category.icon && (
          <span className="text-xl flex-shrink-0">{category.icon}</span>
        )}

        {/* Category Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
              {category.name}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                category.isLeaf
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              }`}
            >
              {category.isLeaf ? 'Leaf' : 'Container'}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Depth: {category.depth}
            </span>
          </div>
          {category.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {category.description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!category.isLeaf && (
            <button
              onClick={() => onAddChild(category)}
              className="p-1.5 text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
              title="Add Child"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
          
          <button
            onClick={() => onEdit(category)}
            className="p-1.5 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={() => onDelete(category)}
            className="p-1.5 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="category-tree-children">
          {children}
        </div>
      )}
    </div>
  )
}
