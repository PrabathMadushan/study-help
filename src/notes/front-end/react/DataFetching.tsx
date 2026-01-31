import { CodeBlock } from '../../../components/CodeBlock'

export default function DataFetching() {
  return (
    <div className="note-body space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Lifecycle in Components
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Use a custom hook or{' '}
        <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">
          useEffect
        </code>{' '}
        with proper cleanup (abort controller, cancelled flag). Never forget
        loading and error state.
      </p>
      <CodeBlock
        code={`useEffect(() => {
  const ctrl = new AbortController();
  fetch(url, { signal: ctrl.signal })
    .then((r) => r.json())
    .then(setData)
    .catch(setError)
    .finally(() => setLoading(false));
  return () => ctrl.abort();
}, [url]);`}
      />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Libraries (Senior Level)
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        <strong>React Query / TanStack Query:</strong> Caching, deduplication,
        background refetch, stale-while-revalidate. Use for server state.
      </p>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        <strong>SWR:</strong> Similar idea, lighter API. Good for read-heavy
        UIs.
      </p>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        <strong>Interview tip:</strong> &quot;I use a custom hook or React
        Query. I always handle loading, error, and cleanup (abort on unmount).
        For complex server state I prefer React Query for caching and
        invalidation.&quot;
      </p>
    </div>
  )
}
