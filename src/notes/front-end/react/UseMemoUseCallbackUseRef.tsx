import { CodeBlock } from '../../../components/CodeBlock'

export default function UseMemoUseCallbackUseRef() {
  return (
    <div className="note-body space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        useMemo
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Memoizes a computed value. Recomputes only when dependencies change. Use
        for expensive derivations to avoid recalculating every render.
      </p>
      <CodeBlock
        code={`const sorted = useMemo(
  () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
  [items]
);`}
      />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        useCallback
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Returns a stable function reference. Use when passing callbacks to
        memoized children — otherwise a new function each render defeats{' '}
        <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">
          React.memo
        </code>
        .
      </p>
      <CodeBlock
        code={`const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
return <MemoizedChild onClick={handleClick} />;`}
        language="jsx"
      />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        useRef
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Mutable ref object that persists across renders. Does not trigger
        re-render when updated. Use for: DOM nodes, storing previous value,
        timers/subscriptions.
      </p>
      <CodeBlock
        code={`const inputRef = useRef(null);
const prevCountRef = useRef(count);
useEffect(() => { prevCountRef.current = count; }, [count]);`}
      />
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        <strong>Senior tip:</strong> Don&apos;t over-memoize. Measure first; use
        for list items, heavy computations, or when passing callbacks to
        memoized components.
      </p>
    </div>
  )
}
