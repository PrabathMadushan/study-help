import { CodeBlock } from '../../components/CodeBlock'

export default function BigOBasics() {
  return (
    <div className="note-body space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        What is Big O?
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Big O describes how runtime or space grows as input size <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">n</code> grows. We care about <strong>worst-case</strong> behavior and the <strong>dominant term</strong> — constants and lower-order terms are dropped.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Common Complexities (Interview Must-Know)
      </h3>
      <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
        <li><strong>O(1):</strong> Constant — same time/space regardless of n (e.g. array index access, hash lookup).</li>
        <li><strong>O(log n):</strong> Logarithmic — halves the problem each step (e.g. binary search).</li>
        <li><strong>O(n):</strong> Linear — one pass over n elements (e.g. single loop, linear search).</li>
        <li><strong>O(n log n):</strong> Linearithmic — typical for efficient sorts (e.g. merge sort, quicksort average).</li>
        <li><strong>O(n²):</strong> Quadratic — nested loops over n (e.g. two nested loops, bubble sort).</li>
        <li><strong>O(2ⁿ):</strong> Exponential — doubles with each step (e.g. naive recursion for Fibonacci).</li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Rules of Thumb
      </h3>
      <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
        <li>Focus on the <strong>dominant term</strong>: O(n² + n) → O(n²).</li>
        <li>Drop <strong>constants</strong>: O(2n) → O(n), O(500) → O(1).</li>
        <li>Different inputs → different variables: O(a + b) for two arrays of size a and b.</li>
        <li>Recursion: count depth × work per level (e.g. binary search: O(log n) levels, O(1) per level → O(log n)).</li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Quick Examples
      </h3>
      <CodeBlock
        code={`// O(1) - constant
const x = arr[i];
map.get(key);

// O(n) - single loop
for (let i = 0; i < n; i++) { ... }

// O(n²) - nested loops
for (let i = 0; i < n; i++)
  for (let j = 0; j < n; j++) { ... }

// O(log n) - halving each step
while (n > 0) { n = Math.floor(n / 2); }`}
      />

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Space Complexity
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Same notation: O(1) = fixed extra space (in-place), O(n) = extra structure of size n (e.g. hash map of n keys, recursion stack of depth n). Interviewers often ask &quot;time and space complexity&quot; — state both.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Interview Answer
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        &quot;Big O describes worst-case growth of time or space as input size n grows. I focus on the dominant term and drop constants: O(1) constant, O(log n) logarithmic like binary search, O(n) linear for one pass, O(n log n) for efficient sorts, O(n²) for nested loops. I always state both time and space when analyzing a solution.&quot;
      </p>
    </div>
  )
}
