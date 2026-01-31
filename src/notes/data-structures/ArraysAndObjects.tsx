import { CodeBlock } from '../../components/CodeBlock'

export default function ArraysAndObjects() {
  return (
    <div className="note-body space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Why Arrays and Objects Matter in Interviews
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Interviewers ask about time/space complexity of everyday operations. Arrays (ordered, index-based) and objects/hash maps (key-value, unordered) are the two structures you use most in JS/TS — and their tradeoffs come up in coding and system design.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Arrays — Ordered Lists
      </h3>
      <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
        <li><strong>Access by index:</strong> O(1) — direct memory offset.</li>
        <li><strong>Search (linear scan):</strong> O(n) — must check each element unless sorted (then binary search O(log n)).</li>
        <li><strong>Insert at end (push):</strong> O(1) amortized; may trigger resize.</li>
        <li><strong>Insert at start (unshift):</strong> O(n) — all elements shift.</li>
        <li><strong>Delete by index (splice):</strong> O(n) if not at end — shifting.</li>
      </ul>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Use arrays when order matters: lists, queues (with shift/push), stacks (push/pop), or when you need index-based access.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Objects / Hash Maps — Key-Value Lookup
      </h3>
      <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
        <li><strong>Lookup by key:</strong> O(1) average — hash + bucket lookup.</li>
        <li><strong>Insert / delete by key:</strong> O(1) average.</li>
        <li><strong>Iteration (keys, values, entries):</strong> O(n).</li>
        <li><strong>No guaranteed order</strong> (in practice insertion order for string keys in modern JS).</li>
      </ul>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Use objects (or <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">Map</code>) when you need fast lookup by a key: caches, counting occurrences, deduplication, or mapping IDs to entities.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Quick Reference Table
      </h3>
      <CodeBlock
        code={`// Array
arr[i]           // O(1) access
arr.push(x)      // O(1) amortized
arr.includes(x)  // O(n) search
arr.indexOf(x)   // O(n)

// Object / Map
obj[key]         // O(1) lookup
obj[key] = v     // O(1) insert
delete obj[key]  // O(1) delete
Object.keys(obj) // O(n) iteration`}
      />

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        When to Use Which (Interview Scenarios)
      </h3>
      <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
        <li><strong>Two Sum / need fast lookup:</strong> Use a Map to store &quot;value → index&quot; so you can check <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">target - current</code> in O(1).</li>
        <li><strong>Count frequency:</strong> Object or Map with key = item, value = count.</li>
        <li><strong>Ordered results / iteration order:</strong> Array or <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">Map</code> (Map preserves insertion order).</li>
        <li><strong>Stack (LIFO) or Queue (FIFO):</strong> Array with push/pop or push/shift (or a proper queue for O(1) dequeue).</li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Map vs Object in JavaScript
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        <strong>Map</strong> allows any key (object, number, string), preserves insertion order, has <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">.size</code>, and no prototype keys. <strong>Object</strong> is fine for string/symbol keys and when you need JSON serialization. In interviews, saying &quot;I&apos;ll use a hash map for O(1) lookup&quot; and using <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">Map</code> or object is both acceptable.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Interview Answer
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        &quot;Arrays give O(1) access by index and O(n) search unless sorted. I use them when order matters or I need indices. Objects or Maps give O(1) average lookup by key, so I use them for fast lookups — like in Two Sum, counting frequency, or caching. For problems that need both order and fast lookup, I might use an array plus a Map, or a Map since it preserves insertion order.&quot;
      </p>
    </div>
  )
}
