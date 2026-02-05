export interface Subject {
  id: string
  name: string
  description?: string
  icon?: string // Emoji or SVG
  color?: string // For UI theming (hex color)
  order: number
  createdAt?: Date
  updatedAt?: Date
}

export interface Category {
  id: string
  subjectId: string
  name: string
  description?: string
  icon?: string
  order: number
  createdAt?: Date
  updatedAt?: Date
}

export interface Subcategory {
  id: string
  subjectId: string
  categoryId: string
  name: string
  description?: string
  order: number
  createdAt?: Date
  updatedAt?: Date
}

export interface SubSubcategory {
  id: string
  subjectId: string
  categoryId: string
  subcategoryId: string
  name: string
  description?: string
  order: number
  createdAt?: Date
  updatedAt?: Date
}

export interface Note {
  id: string
  subjectId: string
  categoryId: string
  subcategoryId?: string
  subSubcategoryId?: string
  title: string
  content: string // Rich HTML content
  interviewAnswer?: string
  order: number
  createdAt?: Date
  updatedAt?: Date
}
