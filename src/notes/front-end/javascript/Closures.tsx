import { CodeBlock } from '../../../components/CodeBlock'

export default function Closures() {
  return (
    <div className="note-body space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        What is a Closure?
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A closure is when an inner function keeps access to its outer scope (variables) even after the outer function has returned. The inner function &quot;closes over&quot; the outer scope. This is one of the most frequently asked JavaScript interview topics.
      </p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Classic Example
      </h3>
      <CodeBlock
        code={`function outer() {
  let count = 0;
  return function inner() {
    count++;
    console.log(count);
  };
}
const fn = outer();
fn(); // 1
fn(); // 2
fn(); // 3`}
      />
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        <strong>Why it works:</strong> The returned function holds a reference to the outer scope&apos;s <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">count</code>. Each call uses the same <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">count</code> variable, so it persists and increments.
      </p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Use Cases in Interviews
      </h3>
      <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
        <li><strong>Private state:</strong> Module pattern, factory functions (like the counter above).</li>
        <li><strong>Callbacks:</strong> Event handlers that need to remember a value (e.g. loop index in a click handler — though let/const in block scope often solves this).</li>
        <li><strong>Partial application / currying:</strong> A function that returns a function with some arguments &quot;closed over&quot;.</li>
      </ul>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Private State Pattern
      </h3>
      <CodeBlock
        code={`function createCounter() {
  let privateCount = 0;
  return {
    increment() {
      privateCount++;
      return privateCount;
    },
    getCount() {
      return privateCount;
    },
  };
}
const counter = createCounter();
counter.increment(); // 1
counter.getCount();  // 1`}
      />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Interview Answer (memorize this)
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        &quot;A closure is when an inner function keeps access to its outer scope after the outer function has returned. The inner function closes over the outer scope&apos;s variables. I use closures for private state (module pattern), callbacks that need to remember a value, and factories. In React, hooks like useState rely on closure to capture the latest state in callbacks.&quot;
      </p>
    </div>
  )
}
