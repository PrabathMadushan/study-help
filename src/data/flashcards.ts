export type FlashcardData = {
  interviewAnswer: string
  keyTerms?: { term: string; definition: string }[]
}

/**
 * Map noteId -> flashcard data (interview answer one-liner, optional key terms for Phase 3).
 * Empty interviewAnswer = excluded from "Practice all" deck.
 */
export const flashcardData: Record<string, FlashcardData> = {
  'react-hooks-basics': {
    interviewAnswer:
      'useState holds local state and triggers re-renders on update. useEffect runs after render: I use it for subscriptions, fetch, or DOM side effects. I pass a dependency array so it only runs when those values change; empty array runs once on mount. I avoid stale closures by listing dependencies correctly.',
  },
  'react-usememo-usecallback-useref': {
    interviewAnswer:
      'useMemo memoizes a computed value so we don\'t recalculate every render; useCallback memoizes a function so child components receiving it don\'t re-render unnecessarily. useRef gives a mutable ref object that persists across renders without causing re-renders — I use it for DOM refs, previous value, or timers.',
  },
  'react-custom-hooks': {
    interviewAnswer:
      'Custom hooks are functions that use other hooks. I extract shared logic (e.g. form state, API fetch, subscription) into a hook so it\'s reusable and testable. Rules: only call hooks at the top level and from React code. I name them with use- so the linter enforces the rules.',
  },
  'react-performance': {
    interviewAnswer:
      'I use React.memo for pure components to skip re-renders when props are referentially equal. useMemo and useCallback avoid unnecessary recalculations and stable callbacks. For large lists I use virtualization (e.g. react-window). Code splitting with lazy and Suspense loads chunks on demand. I profile with React DevTools to find real bottlenecks.',
  },
  'react-reconciliation-keys': {
    interviewAnswer:
      'Reconciliation is React\'s diff of the virtual DOM to update the real DOM. Keys help React match list items across renders so it can reuse and reorder instead of recreating. I use a stable unique id from data, never array index when the list can reorder or change — wrong keys cause bugs and wasted updates.',
  },
  'react-error-boundaries': {
    interviewAnswer:
      'Error boundaries are class components that catch JS errors in their tree and show a fallback UI instead of crashing. I use componentDidCatch and getDerivedStateFromError. They don\'t catch errors in event handlers, async code, or SSR — I handle those with try/catch. I place them at segment boundaries to isolate failures.',
  },
  'react-context-vs-redux': {
    interviewAnswer:
      'Context is built-in: I use it for theme, auth, or locale that many components need. Redux gives a single store, predictable updates with reducers, and DevTools. I pick Context when the tree is small and updates are infrequent; Redux when I need time-travel, middleware, or complex shared state. I often combine both.',
  },
  'react-compound-components': {
    interviewAnswer:
      'Compound components are a set of components that work together and share implicit state (e.g. Tabs and TabPanel). I implement them with React Context: a parent provides state and callbacks, children consume via useContext. The API is flexible — users compose the markup — and I keep the state logic in one place.',
  },
  'react-data-fetching': {
    interviewAnswer:
      'I fetch in useEffect with a cleanup to avoid setting state after unmount. I track loading and error state and show appropriate UI. For server state I use a library like React Query or SWR for caching, deduping, and revalidation. For forms I use controlled components and validate on submit or on blur depending on UX.',
  },
  'react-typescript': {
    interviewAnswer:
      'I type props with an interface, use React.FC sparingly and prefer explicit return types. I type useState and useRef generically. For event handlers I use React.ChangeEvent<HTMLInputElement> and similar. I avoid any; for refs to DOM elements I use useRef<HTMLDivElement>(null). I type children when needed with React.ReactNode.',
  },
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

/** Filter note IDs to only those that have flashcard content (non-empty interviewAnswer). */
export function filterNoteIdsWithFlashcards(noteIds: string[]): string[] {
  return noteIds.filter((id) => flashcardData[id]?.interviewAnswer?.trim())
}

/** Fisher–Yates shuffle. Returns a new shuffled array. */
export function shuffleNoteIds(noteIds: string[]): string[] {
  const a = [...noteIds]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
