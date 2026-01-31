import { CodeBlock } from '../../components/CodeBlock'

export default function BinarySearch() {
  return (
    <div className="note-body space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        When to Use Binary Search
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Binary search works on <strong>sorted</strong> arrays (or any structure where you can compare with a midpoint and eliminate half). Compare target to middle; if target is smaller, search left half; if larger, search right half. Time O(log n), space O(1) for iterative version.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Standard Template (Memorize for Interviews)
      </h3>
      <CodeBlock
        code={`function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`}
      />
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        <strong>Why <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">left &lt;= right</code>?</strong> So we still check when <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">left === right</code> (one element). Use <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">mid = left + (right - left) / 2</code> to avoid overflow in other languages; in JS it&apos;s less critical but good practice.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Variants Interviewers Love
      </h3>
      <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
        <li><strong>First occurrence / lower bound:</strong> When <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">arr[mid] === target</code>, set <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">right = mid - 1</code> and keep searching left; return <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">left</code> (or check bounds).</li>
        <li><strong>Last occurrence / upper bound:</strong> When equal, set <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">left = mid + 1</code> and keep searching right; return <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">right</code> (or check bounds).</li>
        <li><strong>Search in rotated sorted array:</strong> Compare <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">arr[mid]</code> with <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">arr[left]</code> or <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">arr[right]</code> to know which half is sorted, then narrow.</li>
        <li><strong>Binary search on answer:</strong> When the problem asks for &quot;minimum/maximum value that satisfies X&quot;, the search space is the range of possible answers; <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">mid</code> is a candidate and you check if it satisfies X.</li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Common Mistakes
      </h3>
      <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
        <li>Using <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">left &lt; right</code> and forgetting to handle the last element.</li>
        <li>Updating <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">left = mid</code> or <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">right = mid</code> instead of <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">mid + 1</code> / <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">mid - 1</code> — can cause infinite loop.</li>
        <li>Assuming input is sorted — always clarify or sort first (then O(n log n) for sort + O(log n) search).</li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Interview Answer
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        &quot;Binary search works on sorted data. I keep left and right pointers, compute mid, and compare with target; if target is smaller I search the left half by setting right = mid - 1, else left = mid + 1. I use left &lt;= right so we check the single-element case. Time is O(log n), space O(1) for the iterative version. For first/last occurrence I adjust whether we go left or right when equal; for &quot;minimum value that satisfies X&quot; I binary search on the range of possible answers.&quot;
      </p>
    </div>
  )
}
