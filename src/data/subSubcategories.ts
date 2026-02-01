export type SubSubcategory = {
  id: string
  categoryId: string
  subcategoryId: string
  name: string
  description?: string
  order: number
}

export const subSubcategories: SubSubcategory[] = [
  { categoryId: 'front-end', subcategoryId: 'react', id: 'hooks', name: 'Hooks', description: 'useState, useEffect, useMemo, useCallback, useRef, custom hooks', order: 1 },
  { categoryId: 'front-end', subcategoryId: 'react', id: 'performance', name: 'Performance', description: 'memo, virtualization, reconciliation, keys', order: 2 },
  { categoryId: 'front-end', subcategoryId: 'react', id: 'patterns', name: 'Patterns & architecture', description: 'Error boundaries, Context vs Redux, compound components, data fetching', order: 3 },
  { categoryId: 'front-end', subcategoryId: 'react', id: 'typescript', name: 'TypeScript', description: 'Typing React components and hooks', order: 4 },
]

export function getSubSubcategoriesBySubcategory(categoryId: string, subcategoryId: string): SubSubcategory[] {
  return subSubcategories
    .filter((s) => s.categoryId === categoryId && s.subcategoryId === subcategoryId)
    .sort((a, b) => a.order - b.order)
}

export function getSubSubcategoryById(
  categoryId: string,
  subcategoryId: string,
  subSubId: string
): SubSubcategory | undefined {
  return subSubcategories.find(
    (s) => s.categoryId === categoryId && s.subcategoryId === subcategoryId && s.id === subSubId
  )
}

export function subcategoryHasSubSubcategories(categoryId: string, subcategoryId: string): boolean {
  return getSubSubcategoriesBySubcategory(categoryId, subcategoryId).length > 0
}
