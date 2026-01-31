export type Subcategory = {
  id: string
  categoryId: string
  name: string
  description?: string
}

export const FRONT_END_CATEGORY_ID = 'front-end'

export const subcategories: Subcategory[] = [
  { id: 'react', categoryId: FRONT_END_CATEGORY_ID, name: 'React', description: 'Components, hooks, state' },
  { id: 'javascript', categoryId: FRONT_END_CATEGORY_ID, name: 'JavaScript', description: 'ES6+, closures, event loop' },
  { id: 'typescript', categoryId: FRONT_END_CATEGORY_ID, name: 'TypeScript', description: 'Types, interfaces, generics' },
  { id: 'tailwind', categoryId: FRONT_END_CATEGORY_ID, name: 'Tailwind', description: 'Utility-first CSS' },
  { id: 'css', categoryId: FRONT_END_CATEGORY_ID, name: 'CSS', description: 'Layout, flexbox, grid' },
  { id: 'more', categoryId: FRONT_END_CATEGORY_ID, name: 'More', description: 'Imported topics for interviews' },
]

export function getSubcategoriesByCategoryId(categoryId: string): Subcategory[] {
  return subcategories.filter((s) => s.categoryId === categoryId)
}

export function getSubcategoryById(categoryId: string, subId: string): Subcategory | undefined {
  return subcategories.find((s) => s.categoryId === categoryId && s.id === subId)
}

export function categoryHasSubcategories(categoryId: string): boolean {
  return getSubcategoriesByCategoryId(categoryId).length > 0
}
