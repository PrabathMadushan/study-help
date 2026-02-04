export type SubSubcategory = {
  id: string
  categoryId: string
  subcategoryId: string
  name: string
  description?: string
  order: number
}

export const subSubcategories: SubSubcategory[] = [
  // React
  { categoryId: 'front-end', subcategoryId: 'react', id: 'hooks', name: 'Hooks', description: 'useState, useEffect, useMemo, useCallback, useRef, custom hooks', order: 1 },
  { categoryId: 'front-end', subcategoryId: 'react', id: 'performance', name: 'Performance', description: 'memo, virtualization, reconciliation, keys', order: 2 },
  { categoryId: 'front-end', subcategoryId: 'react', id: 'patterns', name: 'Patterns & architecture', description: 'Error boundaries, Context vs Redux, compound components, data fetching', order: 3 },
  { categoryId: 'front-end', subcategoryId: 'react', id: 'typescript', name: 'TypeScript', description: 'Typing React components and hooks', order: 4 },
  
  // JavaScript
  { categoryId: 'front-end', subcategoryId: 'javascript', id: 'core-concepts', name: 'Core Concepts', description: 'Closures, this, prototypes, scope, hoisting', order: 1 },
  { categoryId: 'front-end', subcategoryId: 'javascript', id: 'async', name: 'Asynchronous JS', description: 'Promises, async/await, event loop, callbacks', order: 2 },
  { categoryId: 'front-end', subcategoryId: 'javascript', id: 'es6-plus', name: 'ES6+ Features', description: 'Destructuring, spread, modules, classes, arrow functions', order: 3 },
  { categoryId: 'front-end', subcategoryId: 'javascript', id: 'advanced', name: 'Advanced Topics', description: 'Currying, debounce/throttle, generators, proxies', order: 4 },
  
  // TypeScript
  { categoryId: 'front-end', subcategoryId: 'typescript', id: 'basics', name: 'TypeScript Basics', description: 'Types, interfaces, type inference, unions', order: 1 },
  { categoryId: 'front-end', subcategoryId: 'typescript', id: 'generics', name: 'Generics', description: 'Generic functions, constraints, utility types', order: 2 },
  { categoryId: 'front-end', subcategoryId: 'typescript', id: 'advanced', name: 'Advanced Types', description: 'Conditional types, mapped types, template literals', order: 3 },
  
  // CSS
  { categoryId: 'front-end', subcategoryId: 'css', id: 'layout', name: 'Layout', description: 'Flexbox, Grid, positioning, box model', order: 1 },
  { categoryId: 'front-end', subcategoryId: 'css', id: 'responsive', name: 'Responsive Design', description: 'Media queries, mobile-first, responsive units', order: 2 },
  { categoryId: 'front-end', subcategoryId: 'css', id: 'advanced', name: 'Advanced CSS', description: 'Animations, transitions, pseudo-elements, CSS variables', order: 3 },
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
