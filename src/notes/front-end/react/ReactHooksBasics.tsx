import { CodeBlock } from '../../../components/CodeBlock'

export default function ReactHooksBasics() {
  return (
    <div className="note-body space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Rules of Hooks
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Call hooks only at the top level (not inside loops, conditions, or
        nested functions). Call them from function components or custom hooks.
        This ensures hooks run in the same order every render.
      </p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        useState
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Returns{' '}
        <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">
          [value, setValue]
        </code>
        . The setter can accept a new value or an updater function{' '}
        <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">
          (prev) =&gt; next
        </code>
        . Use the updater when the new state depends on the previous state to
        avoid stale closures.
      </p>
      <CodeBlock
        code={`const [count, setCount] = useState(0);
// Prefer updater for derived updates
setCount((prev) => prev + 1);
// Lazy initial state (runs once)
const [state, setState] = useState(() => computeExpensive());`}
      />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        useEffect
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Runs after paint. Dependency array controls when:{' '}
        <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">
          []
        </code>{' '}
        = mount only,{' '}
        <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">
          [a, b]
        </code>{' '}
        = when a or b change. Return a cleanup function to cancel subscriptions
        or timers.
      </p>
      <CodeBlock
        code={`useEffect(() => {
  const sub = subscribe(id);
  return () => sub.unsubscribe();
}, [id]);`}
      />
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        <strong>Interview tip:</strong> Missing deps cause stale closures;
        object/array in deps recreated every render can cause infinite loops —
        use primitives or{' '}
        <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">
          useMemo
        </code>
        .
      </p>
    </div>
  )
}
