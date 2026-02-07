/**
 * Unified Category with unlimited nesting support
 */
export interface Category {
  id: string
  parentId: string | null  // null = root category
  name: string
  description?: string
  icon?: string  // Emoji or SVG
  color?: string  // For UI theming (hex color)
  isLeaf: boolean  // true = can contain Notes, false = can contain child Categories
  order: number
  depth: number  // computed field: 0 = root, 1 = first level, etc.
  path: string[]  // ancestor IDs for efficient queries [grandparentId, parentId]
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Note with single categoryId reference
 */
export interface Note {
  id: string
  categoryId: string  // direct parent category (must be isLeaf=true)
  path: string[]  // full category path for breadcrumbs/queries
  title: string
  content: string // Rich HTML content
  interviewAnswer?: string
  order: number
  createdAt?: Date
  updatedAt?: Date
}
