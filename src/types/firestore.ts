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

/**
 * Flashcard for practice mode – one of many per leaf category
 */
export interface Flashcard {
  id: string
  categoryId: string  // leaf category id
  question: string
  answer: string
  order: number
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Exam question – one of many per leaf category
 */
export type ExamQuestionType = 'mcq' | 'short'

export interface ExamQuestion {
  id: string
  categoryId: string  // leaf category id
  question: string
  type: ExamQuestionType
  options?: string[]  // required for mcq
  correctAnswer: string
  order: number
  createdAt?: Date
  updatedAt?: Date
}
