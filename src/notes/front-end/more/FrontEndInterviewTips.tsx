import { CodeBlock } from '../../../components/CodeBlock'

export default function FrontEndInterviewTips() {
  return (
    <div className="note-body space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Topics to Have Ready (Interview Checklist)
      </h3>
      <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
        <li><strong>Virtual DOM &amp; reconciliation:</strong> React builds a tree, diffs with previous tree, applies minimal DOM updates. Keys help identify which items changed.</li>
        <li><strong>Performance:</strong> memo, useMemo, useCallback, lazy loading, virtualization, correct dependency arrays.</li>
        <li><strong>State:</strong> Props vs state, lifting state up, Context vs Redux (when to use which).</li>
        <li><strong>REST from frontend:</strong> GET/POST/PUT/DELETE, status codes, Authorization header, error handling and loading states.</li>
        <li><strong>Accessibility:</strong> Semantic HTML, ARIA when needed, keyboard navigation, focus management.</li>
      </ul>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        How to Answer &quot;How do you optimize React?&quot;
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        &quot;I measure first with React DevTools or profiling. Then I consider: memoization (React.memo, useMemo, useCallback) for expensive list items or when passing callbacks to memoized children; lazy loading and code splitting for routes; virtualization for long lists; and fixing dependency arrays in useEffect to avoid unnecessary runs. I don&apos;t over-optimize without data.&quot;
      </p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        How to Answer &quot;How do you handle API errors?&quot;
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        &quot;I use try/catch in async handlers or inside useEffect. I keep loading and error state and show a fallback UI or toast. For consistency I use a global error handler or Axios interceptors. I also consider error boundaries for component tree failures.&quot;
      </p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        One-Liner Recap
      </h3>
      <CodeBlock
        code={`// Virtual DOM: diff tree → minimal DOM updates
// Keys: stable ID per item, never index
// Performance: memo / useMemo / useCallback + lazy + virtual list
// API: loading + error state + try/catch + user feedback`}
      />
    </div>
  )
}
