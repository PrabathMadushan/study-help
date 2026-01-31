import { CodeBlock } from '../../../components/CodeBlock'

export default function CompoundComponents() {
  return (
    <div className="note-body space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Compound Components
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A set of components that work together and share implicit state (e.g.{' '}
        <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">
          Tabs
        </code>
        ,{' '}
        <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">
          Tabs.List
        </code>
        ,{' '}
        <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">
          Tabs.Trigger
        </code>
        ,{' '}
        <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">
          Tabs.Content
        </code>
        ). State lives in the parent; children use context or cloneElement.
      </p>
      <CodeBlock
        code={`const TabsContext = createContext(null);
function Tabs({ defaultValue, children }) {
  const [active, setActive] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      {children}
    </TabsContext.Provider>
  );
}
Tabs.List = function TabsList({ children }) { ... };
Tabs.Trigger = function TabsTrigger({ value, children }) { ... };`}
        language="jsx"
      />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Composition over Configuration
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Prefer slots (children, render props) over a giant props object. Makes
        APIs flexible and readable.
      </p>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        <strong>Interview tip:</strong> &quot;I use compound components when the
        UI has multiple coordinated parts with a clear parent-child
        relationship. Composition keeps components small and reusable.&quot;
      </p>
    </div>
  )
}
