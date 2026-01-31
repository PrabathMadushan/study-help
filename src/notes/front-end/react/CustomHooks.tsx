import { CodeBlock } from '../../../components/CodeBlock'

export default function CustomHooks() {
  return (
    <div className="note-body space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Why Custom Hooks
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Extract stateful logic into reusable functions. Prefer over HOCs or
        render props for sharing behavior. Name must start with{' '}
        <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">
          use
        </code>
        .
      </p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Data Fetching Hook
      </h3>
      <CodeBlock
        code={`function useFetch<T>(url: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    fetch(url)
      .then((r) => r.json())
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setError(e))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [url]);
  return { data, loading, error };
}`}
        language="typescript"
      />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Local Storage Hook
      </h3>
      <CodeBlock
        code={`function useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      return JSON.parse(localStorage.getItem(key) ?? '') ?? initial;
    } catch { return initial; }
  });
  const setValue = useCallback((value: T) => {
    setState(value);
    localStorage.setItem(key, JSON.stringify(value));
  }, [key]);
  return [state, setValue];
}`}
        language="typescript"
      />
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        <strong>Interview tip:</strong> Custom hooks compose; they can call
        other hooks. Keep them focused and testable.
      </p>
    </div>
  )
}
