export type NoteMeta = {
  id: string
  categoryId: string
  subcategoryId?: string
  subSubcategoryId?: string
  title: string
  order: number
}

export const notesMeta: NoteMeta[] = [
  { id: 'react-hooks-basics', categoryId: 'front-end', subcategoryId: 'react', subSubcategoryId: 'hooks', title: '1. useState & useEffect — Core Hooks', order: 1 },
  { id: 'react-usememo-usecallback-useref', categoryId: 'front-end', subcategoryId: 'react', subSubcategoryId: 'hooks', title: '2. useMemo, useCallback & useRef', order: 2 },
  { id: 'react-custom-hooks', categoryId: 'front-end', subcategoryId: 'react', subSubcategoryId: 'hooks', title: '3. Custom Hooks & Logic Reuse', order: 3 },
  { id: 'react-performance', categoryId: 'front-end', subcategoryId: 'react', subSubcategoryId: 'performance', title: '4. Performance: memo, Virtualization, Code Splitting', order: 4 },
  { id: 'react-reconciliation-keys', categoryId: 'front-end', subcategoryId: 'react', subSubcategoryId: 'performance', title: '5. Reconciliation & Keys', order: 5 },
  { id: 'react-error-boundaries', categoryId: 'front-end', subcategoryId: 'react', subSubcategoryId: 'patterns', title: '6. Error Boundaries', order: 6 },
  { id: 'react-context-vs-redux', categoryId: 'front-end', subcategoryId: 'react', subSubcategoryId: 'patterns', title: '7. Context vs Redux — State Architecture', order: 7 },
  { id: 'react-compound-components', categoryId: 'front-end', subcategoryId: 'react', subSubcategoryId: 'patterns', title: '8. Compound Components & Composition', order: 8 },
  { id: 'react-data-fetching', categoryId: 'front-end', subcategoryId: 'react', subSubcategoryId: 'patterns', title: '9. Data Fetching Patterns', order: 9 },
  { id: 'react-typescript', categoryId: 'front-end', subcategoryId: 'react', subSubcategoryId: 'typescript', title: '10. TypeScript with React', order: 10 },
  { id: 'js-closures', categoryId: 'front-end', subcategoryId: 'javascript', title: 'JavaScript Closures', order: 2 },
  { id: 'ts-interfaces', categoryId: 'front-end', subcategoryId: 'typescript', title: 'TypeScript Interfaces', order: 1 },
  { id: 'tailwind-utility', categoryId: 'front-end', subcategoryId: 'tailwind', title: 'Tailwind Utility Classes', order: 1 },
  { id: 'css-flexbox', categoryId: 'front-end', subcategoryId: 'css', title: 'CSS Flexbox', order: 1 },
  { id: 'front-end-interview-tips', categoryId: 'front-end', subcategoryId: 'more', title: 'Front End Interview Tips', order: 1 },
  { id: 'rest-api-basics', categoryId: 'back-end', title: 'REST API Basics', order: 1 },
  { id: 'jwt-auth', categoryId: 'back-end', title: 'JWT Authentication', order: 2 },
  { id: 'cicd-pipeline', categoryId: 'devops', title: 'CI/CD Pipeline', order: 1 },
  { id: 'docker-basics', categoryId: 'devops', title: 'Docker Basics', order: 2 },
  { id: 'singleton-pattern', categoryId: 'design-patterns', title: 'Singleton Pattern', order: 1 },
  { id: 'observer-pattern', categoryId: 'design-patterns', title: 'Observer Pattern', order: 2 },
  { id: 'arrays-and-objects', categoryId: 'data-structures', title: 'Arrays and Objects', order: 1 },
  { id: 'linked-list', categoryId: 'data-structures', title: 'Linked List', order: 2 },
  { id: 'big-o-basics', categoryId: 'algorithms', title: 'Big O Basics', order: 1 },
  { id: 'binary-search', categoryId: 'algorithms', title: 'Binary Search', order: 2 },
  { id: 'star-method', categoryId: 'behavior-questions', title: 'STAR Method', order: 1 },
  { id: 'why-this-company', categoryId: 'behavior-questions', title: 'Why This Company?', order: 2 },
  { id: 'general-tips', categoryId: 'more', title: 'Study Tips', order: 1 },
]
