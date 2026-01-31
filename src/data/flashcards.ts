export type FlashcardData = {
  interviewAnswer: string
  keyTerms?: { term: string; definition: string }[]
}

/**
 * Map noteId -> flashcard data (interview answer one-liner, optional key terms for Phase 3).
 * Empty interviewAnswer = excluded from "Practice all" deck.
 */
export const flashcardData: Record<string, FlashcardData> = {
  'react-hooks-basics': { interviewAnswer: '' },
  'react-usememo-usecallback-useref': { interviewAnswer: '' },
  'react-custom-hooks': { interviewAnswer: '' },
  'react-performance': { interviewAnswer: '' },
  'react-reconciliation-keys': { interviewAnswer: '' },
  'react-error-boundaries': { interviewAnswer: '' },
  'react-context-vs-redux': { interviewAnswer: '' },
  'react-compound-components': { interviewAnswer: '' },
  'react-data-fetching': { interviewAnswer: '' },
  'react-typescript': { interviewAnswer: '' },
  'js-closures': {
    interviewAnswer:
      'A closure is when an inner function keeps access to its outer scope after the outer function has returned. The inner function closes over the outer scope\'s variables. I use closures for private state (module pattern), callbacks that need to remember a value, and factories. In React, hooks like useState rely on closure to capture the latest state in callbacks.',
  },
  'ts-interfaces': {
    interviewAnswer:
      'I use interface for object shapes and when I need to extend; I use type for unions and primitives. I always type props, state, and API responses. I avoid any and use unknown with type guards when the shape isn\'t known upfront.',
  },
  'tailwind-utility': {
    interviewAnswer:
      'Tailwind is utility-first: I use small, single-purpose classes and compose them in the markup. It speeds up UI work, keeps styles co-located, and supports responsive and dark mode with prefixes. I configure the theme when we need design tokens; otherwise I stick to the default scale.',
  },
  'css-flexbox': {
    interviewAnswer:
      'Flexbox is for one-dimensional layout. I use display flex, then justify-content and align-items for alignment, and gap for spacing. For navbars, centering, and simple rows/columns I use Flexbox; for full page or card grids I use CSS Grid.',
  },
  'front-end-interview-tips': {
    interviewAnswer:
      'Virtual DOM: diff tree then minimal DOM updates. Optimize React with memo, useMemo, useCallback, code splitting, and virtualization. Handle API errors with loading/error state and user feedback.',
  },
  'rest-api-basics': {
    interviewAnswer:
      'REST uses HTTP methods: GET for read, POST for create, PUT/PATCH for update, DELETE for remove. I use proper status codes: 2xx for success, 4xx for client errors (400 validation, 401 auth, 404 not found), 5xx for server errors. I send Authorization for auth and Content-Type for JSON. From the frontend I always handle loading, error, and success states and show appropriate UI.',
  },
  'jwt-auth': {
    interviewAnswer:
      'JWT has header, payload, and signature. Payload is Base64, not encrypted. I prefer not storing JWT in localStorage due to XSS; I use memory or httpOnly cookie. I send it in the Authorization header as Bearer token. For refresh I use a separate refresh token and a dedicated endpoint.',
  },
  'cicd-pipeline': {
    interviewAnswer:
      'CI/CD automates build, test, and deployment so we release safely without manual steps. On push we run build and tests; if they pass we deploy. I\'ve used Netlify/Vercel for frontend — they build and publish the dist folder. I use env vars for config and never commit secrets.',
  },
  'docker-basics': {
    interviewAnswer:
      'Docker packages the app and dependencies into containers so they run the same everywhere. Images are built from a Dockerfile; containers are running instances. I\'ve used it for local parity and seen it used for deployment. I understand the concept even if I haven\'t written Dockerfiles daily.',
  },
  'singleton-pattern': {
    interviewAnswer:
      'Singleton ensures one instance of a class or object. I use it for config, API client, or logger. In JS I often use a module that exports one object; in TypeScript I might use a class with a private constructor and static getInstance(). I avoid it when we need multiple instances or when it hurts testability.',
  },
  'observer-pattern': {
    interviewAnswer:
      'Observer is one-to-many: when the subject changes, all observers are notified. I use it for decoupling — e.g. UI subscribes to data. React\'s setState and Redux subscribe are examples. Pub/Sub is similar but uses an event channel so publishers and subscribers don\'t reference each other.',
  },
  'arrays-and-objects': {
    interviewAnswer:
      'Arrays give O(1) access by index and O(n) search unless sorted. I use them when order matters or I need indices. Objects or Maps give O(1) average lookup by key, so I use them for fast lookups — like in Two Sum, counting frequency, or caching. For problems that need both order and fast lookup, I might use an array plus a Map, or a Map since it preserves insertion order.',
  },
  'linked-list': {
    interviewAnswer:
      'A linked list is a linear structure of nodes, each with a value and a pointer to the next — and optionally previous in a doubly linked list. There\'s no random access; traversal is O(n). The advantage is O(1) insertion and deletion at the head or at a known node, without shifting. I use it when the problem involves frequent head/tail updates or when merging, reversing, or detecting cycles — and in designs like LRU cache with a doubly linked list for O(1) eviction.',
  },
  'big-o-basics': {
    interviewAnswer:
      'Big O describes worst-case growth of time or space as input size n grows. I focus on the dominant term and drop constants: O(1) constant, O(log n) logarithmic like binary search, O(n) linear for one pass, O(n log n) for efficient sorts, O(n²) for nested loops. I always state both time and space when analyzing a solution.',
  },
  'binary-search': {
    interviewAnswer:
      'Binary search works on sorted data. I keep left and right pointers, compute mid, and compare with target; if target is smaller I search the left half by setting right = mid - 1, else left = mid + 1. I use left <= right so we check the single-element case. Time is O(log n), space O(1) for the iterative version. For first/last occurrence I adjust whether we go left or right when equal; for "minimum value that satisfies X" I binary search on the range of possible answers.',
  },
  'star-method': {
    interviewAnswer:
      'I structure my answers with STAR: I give a brief situation and my task, then walk through the specific actions I took — what I did, not the team — and end with the result, ideally with a metric or clear outcome. I prepare a few stories in advance so I can adapt them to questions about conflict, failure, learning, or ownership.',
  },
  'why-this-company': {
    interviewAnswer:
      'I research the company\'s mission, product, and recent news, and I look at their tech stack and engineering blog. I tie my skills and goals to something specific — a product, a project, or a value — so my answer isn\'t generic. I also prepare questions about the role and the team so I can show genuine interest and learn whether we\'re a good fit.',
  },
  'general-tips': {
    interviewAnswer:
      'I use spaced repetition to revisit material, take notes in my own words to deepen understanding, and practice explaining out loud so I can deliver clear answers in interviews. I track progress with this app and focus on the Interview Answer sections and STAR stories before each interview.',
  },
}

export function getNoteIdsWithFlashcards(): string[] {
  return Object.entries(flashcardData)
    .filter(([, data]) => data.interviewAnswer.trim() !== '')
    .map(([id]) => id)
}
