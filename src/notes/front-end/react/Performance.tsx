import { CodeBlock } from '../../../components/CodeBlock'

export default function Performance() {
  return (
    <div className="note-body space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        React.memo
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Skips re-render when props are referentially equal. Use for expensive
        list items or leaf components. Useless if parent always passes new
        objects/functions.
      </p>
      <CodeBlock
        code={`const Row = React.memo(function Row({ item, onSelect }: Props) {
  return <tr onClick={() => onSelect(item.id)}>...</tr>;
});`}
        language="tsx"
      />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Virtualization
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Render only visible rows (e.g.{' '}
        <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">
          react-window
        </code>
        ,{' '}
        <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">
          @tanstack/react-virtual
        </code>
        ). Critical for lists with hundreds of items.
      </p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Code Splitting
      </h3>
      <CodeBlock
        code={`const Dashboard = React.lazy(() => import('./Dashboard'));
<Suspense fallback={<Spinner />}>
  <Dashboard />
</Suspense>`}
        language="jsx"
      />
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        <strong>Senior answer:</strong> &quot;I optimize only after measuring. I
        use memo/useMemo/useCallback where re-renders or re-computation are
        proven costly; lazy loading for routes; virtualization for long lists;
        and correct dependency arrays to avoid unnecessary effects.&quot;
      </p>
    </div>
  )
}
