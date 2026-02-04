export type NoteMeta = {
  id: string
  categoryId: string
  subcategoryId?: string
  subSubcategoryId?: string
  title: string
  order: number
}

export const notesMeta: NoteMeta[] = [
  // REACT
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

  // JAVASCRIPT - Core Concepts
  { id: 'js-closures', categoryId: 'front-end', subcategoryId: 'javascript', subSubcategoryId: 'core-concepts', title: '1. Closures & Scope', order: 11 },
  { id: 'js-this-keyword', categoryId: 'front-end', subcategoryId: 'javascript', subSubcategoryId: 'core-concepts', title: '2. The "this" Keyword', order: 12 },
  { id: 'js-prototypes', categoryId: 'front-end', subcategoryId: 'javascript', subSubcategoryId: 'core-concepts', title: '3. Prototypes & Inheritance', order: 13 },
  { id: 'js-hoisting', categoryId: 'front-end', subcategoryId: 'javascript', subSubcategoryId: 'core-concepts', title: '4. Hoisting & Temporal Dead Zone', order: 14 },

  // JAVASCRIPT - Async
  { id: 'js-event-loop', categoryId: 'front-end', subcategoryId: 'javascript', subSubcategoryId: 'async', title: '5. Event Loop & Concurrency Model', order: 15 },
  { id: 'js-promises', categoryId: 'front-end', subcategoryId: 'javascript', subSubcategoryId: 'async', title: '6. Promises & Promise Chain', order: 16 },
  { id: 'js-async-await', categoryId: 'front-end', subcategoryId: 'javascript', subSubcategoryId: 'async', title: '7. Async/Await & Error Handling', order: 17 },
  { id: 'js-callbacks', categoryId: 'front-end', subcategoryId: 'javascript', subSubcategoryId: 'async', title: '8. Callbacks & Callback Hell', order: 18 },

  // JAVASCRIPT - ES6+
  { id: 'js-destructuring', categoryId: 'front-end', subcategoryId: 'javascript', subSubcategoryId: 'es6-plus', title: '9. Destructuring & Spread/Rest', order: 19 },
  { id: 'js-arrow-functions', categoryId: 'front-end', subcategoryId: 'javascript', subSubcategoryId: 'es6-plus', title: '10. Arrow Functions & Lexical This', order: 20 },
  { id: 'js-modules', categoryId: 'front-end', subcategoryId: 'javascript', subSubcategoryId: 'es6-plus', title: '11. ES6 Modules (Import/Export)', order: 21 },
  { id: 'js-classes', categoryId: 'front-end', subcategoryId: 'javascript', subSubcategoryId: 'es6-plus', title: '12. Classes & Getters/Setters', order: 22 },

  // JAVASCRIPT - Advanced
  { id: 'js-currying', categoryId: 'front-end', subcategoryId: 'javascript', subSubcategoryId: 'advanced', title: '13. Currying & Partial Application', order: 23 },
  { id: 'js-debounce-throttle', categoryId: 'front-end', subcategoryId: 'javascript', subSubcategoryId: 'advanced', title: '14. Debounce & Throttle', order: 24 },
  { id: 'js-generators', categoryId: 'front-end', subcategoryId: 'javascript', subSubcategoryId: 'advanced', title: '15. Generators & Iterators', order: 25 },
  { id: 'js-proxy-reflect', categoryId: 'front-end', subcategoryId: 'javascript', subSubcategoryId: 'advanced', title: '16. Proxy & Reflect API', order: 26 },

  // TYPESCRIPT - Basics
  { id: 'ts-types-interfaces', categoryId: 'front-end', subcategoryId: 'typescript', subSubcategoryId: 'basics', title: '1. Types vs Interfaces', order: 27 },
  { id: 'ts-type-inference', categoryId: 'front-end', subcategoryId: 'typescript', subSubcategoryId: 'basics', title: '2. Type Inference & Assertions', order: 28 },
  { id: 'ts-union-intersection', categoryId: 'front-end', subcategoryId: 'typescript', subSubcategoryId: 'basics', title: '3. Union & Intersection Types', order: 29 },
  { id: 'ts-enums-literals', categoryId: 'front-end', subcategoryId: 'typescript', subSubcategoryId: 'basics', title: '4. Enums & Literal Types', order: 30 },

  // TYPESCRIPT - Generics
  { id: 'ts-generic-functions', categoryId: 'front-end', subcategoryId: 'typescript', subSubcategoryId: 'generics', title: '5. Generic Functions & Constraints', order: 31 },
  { id: 'ts-utility-types', categoryId: 'front-end', subcategoryId: 'typescript', subSubcategoryId: 'generics', title: '6. Utility Types (Partial, Pick, Omit)', order: 32 },
  { id: 'ts-generic-classes', categoryId: 'front-end', subcategoryId: 'typescript', subSubcategoryId: 'generics', title: '7. Generic Classes & Interfaces', order: 33 },

  // TYPESCRIPT - Advanced
  { id: 'ts-conditional-types', categoryId: 'front-end', subcategoryId: 'typescript', subSubcategoryId: 'advanced', title: '8. Conditional Types', order: 34 },
  { id: 'ts-mapped-types', categoryId: 'front-end', subcategoryId: 'typescript', subSubcategoryId: 'advanced', title: '9. Mapped Types', order: 35 },
  { id: 'ts-template-literals', categoryId: 'front-end', subcategoryId: 'typescript', subSubcategoryId: 'advanced', title: '10. Template Literal Types', order: 36 },

  // CSS - Layout
  { id: 'css-flexbox', categoryId: 'front-end', subcategoryId: 'css', subSubcategoryId: 'layout', title: '1. Flexbox Layout', order: 37 },
  { id: 'css-grid', categoryId: 'front-end', subcategoryId: 'css', subSubcategoryId: 'layout', title: '2. CSS Grid Layout', order: 38 },
  { id: 'css-positioning', categoryId: 'front-end', subcategoryId: 'css', subSubcategoryId: 'layout', title: '3. Positioning (Static, Relative, Absolute, Fixed, Sticky)', order: 39 },
  { id: 'css-box-model', categoryId: 'front-end', subcategoryId: 'css', subSubcategoryId: 'layout', title: '4. Box Model & Box Sizing', order: 40 },

  // CSS - Responsive
  { id: 'css-media-queries', categoryId: 'front-end', subcategoryId: 'css', subSubcategoryId: 'responsive', title: '5. Media Queries & Breakpoints', order: 41 },
  { id: 'css-mobile-first', categoryId: 'front-end', subcategoryId: 'css', subSubcategoryId: 'responsive', title: '6. Mobile-First Design', order: 42 },
  { id: 'css-responsive-units', categoryId: 'front-end', subcategoryId: 'css', subSubcategoryId: 'responsive', title: '7. Responsive Units (rem, em, vw, vh)', order: 43 },

  // CSS - Advanced
  { id: 'css-animations', categoryId: 'front-end', subcategoryId: 'css', subSubcategoryId: 'advanced', title: '8. Animations & Keyframes', order: 44 },
  { id: 'css-transitions', categoryId: 'front-end', subcategoryId: 'css', subSubcategoryId: 'advanced', title: '9. Transitions & Transform', order: 45 },
  { id: 'css-pseudo-elements', categoryId: 'front-end', subcategoryId: 'css', subSubcategoryId: 'advanced', title: '10. Pseudo-elements & Pseudo-classes', order: 46 },
  { id: 'css-variables', categoryId: 'front-end', subcategoryId: 'css', subSubcategoryId: 'advanced', title: '11. CSS Variables (Custom Properties)', order: 47 },

  // TAILWIND
  { id: 'tailwind-utility', categoryId: 'front-end', subcategoryId: 'tailwind', title: 'Tailwind Utility Classes', order: 48 },
  { id: 'tailwind-customization', categoryId: 'front-end', subcategoryId: 'tailwind', title: 'Tailwind Configuration & Customization', order: 49 },

  // MORE
  { id: 'front-end-interview-tips', categoryId: 'front-end', subcategoryId: 'more', title: 'Front End Interview Tips', order: 50 },
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
