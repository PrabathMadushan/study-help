import { CodeBlock } from '../../../components/CodeBlock'

export default function ContextVsRedux() {
  return (
    <div className="note-body space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Context
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Built-in way to pass data through the tree without prop drilling. Any
        consumer re-renders when the context value changes — so splitting by
        domain (Theme, Auth, API) and keeping value stable (memoize) matters.
      </p>
      <CodeBlock
        code={`const ThemeContext = createContext(null);
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}`}
        language="jsx"
      />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        When to Use Redux
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Complex global state, need for time-travel debugging, middleware
        (logging, async), or strict unidirectional flow. Context is fine for
        theme, locale, auth; Redux for large app state with many cross-cutting
        updates.
      </p>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        <strong>Senior answer:</strong> &quot;I use Context for simple
        cross-cutting concerns. For complex global state and predictable updates
        I use Redux (or Zustand). I avoid putting frequently changing data in a
        single context to prevent unnecessary re-renders.&quot;
      </p>
    </div>
  )
}
