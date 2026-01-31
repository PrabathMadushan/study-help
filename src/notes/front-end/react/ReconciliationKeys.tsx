import { CodeBlock } from '../../../components/CodeBlock'

export default function ReconciliationKeys() {
  return (
    <div className="note-body space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Virtual DOM &amp; Diffing
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        React builds a tree of elements, diffs it with the previous tree, and
        applies minimal DOM updates. Diffing is O(n) via heuristics: same type
        and key = same component instance.
      </p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Keys
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Keys help React identify which items changed, were added, or removed.
        Use a stable unique ID from data — never array index (causes bugs when
        list order changes).
      </p>
      <CodeBlock
        code={`{items.map((item) => (
  <ListItem key={item.id} item={item} />
))}`}
        language="jsx"
      />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Why Keys Matter
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Wrong key (e.g. index) can reuse the wrong component instance, leading
        to stale state or wrong UI. Correct key preserves component identity
        across reorders.
      </p>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        <strong>Interview tip:</strong> &quot;Keys should be unique among
        siblings and stable across renders. I use IDs from the backend or a
        deterministic slug.&quot;
      </p>
    </div>
  )
}
