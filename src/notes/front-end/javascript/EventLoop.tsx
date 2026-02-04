import { CodeBlock } from '../../../components/CodeBlock'

export default function EventLoop() {
    return (
        <div className="note-body space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                The JavaScript Event Loop
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                JavaScript is <strong>single-threaded</strong> but can handle asynchronous operations through the <strong>event loop</strong>. Understanding this is critical for senior interviews and debugging async bugs.
            </p>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Call Stack
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                The call stack is where JavaScript keeps track of function execution. Functions are pushed when called and popped when they return. JavaScript executes one function at a time (LIFO - Last In, First Out).
            </p>
            <CodeBlock
                code={`function first() {
  console.log('First');
}
function second() {
  first();
  console.log('Second');
}
second();
// Call stack: second() → first() → log → first returns → log → second returns
// Output: "First", "Second"`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Web APIs & Callback Queue
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                When you call async functions (setTimeout, fetch, DOM events), they're handled by <strong>Web APIs</strong> (provided by the browser or Node.js). When complete, their callbacks are pushed to the <strong>callback queue</strong> (also called task queue or macrotask queue).
            </p>
            <CodeBlock
                code={`console.log('Start');

setTimeout(() => {
  console.log('Timeout');
}, 0);

console.log('End');

// Output:
// "Start"
// "End"
// "Timeout"

// Why? setTimeout callback goes to callback queue,
// but event loop only checks queue after call stack is empty!`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Microtask Queue (Job Queue)
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Promises use the <strong>microtask queue</strong>, which has <strong>higher priority</strong> than the callback queue. Microtasks run before the next macrotask.
            </p>
            <CodeBlock
                code={`console.log('1');

setTimeout(() => {
  console.log('2 - setTimeout (macrotask)');
}, 0);

Promise.resolve().then(() => {
  console.log('3 - Promise (microtask)');
});

console.log('4');

// Output:
// "1"
// "4"
// "3 - Promise (microtask)"    ← runs first!
// "2 - setTimeout (macrotask)"

// Execution order:
// 1. Synchronous code (call stack)
// 2. Microtasks (promises, queueMicrotask)
// 3. Macrotasks (setTimeout, setInterval, I/O)`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                The Event Loop Process
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                <li><strong>1.</strong> Execute all synchronous code (call stack)</li>
                <li><strong>2.</strong> Process all microtasks until the queue is empty</li>
                <li><strong>3.</strong> Render (if in browser)</li>
                <li><strong>4.</strong> Take one macrotask from callback queue</li>
                <li><strong>5.</strong> Repeat from step 2</li>
            </ul>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Complex Example
            </h3>
            <CodeBlock
                code={`console.log('Script start');

setTimeout(() => {
  console.log('setTimeout 1');
  Promise.resolve().then(() => {
    console.log('Promise inside setTimeout');
  });
}, 0);

Promise.resolve()
  .then(() => {
    console.log('Promise 1');
  })
  .then(() => {
    console.log('Promise 2');
  });

setTimeout(() => {
  console.log('setTimeout 2');
}, 0);

console.log('Script end');

/** Output:
 * "Script start"
 * "Script end"
 * "Promise 1"
 * "Promise 2"
 * "setTimeout 1"
 * "Promise inside setTimeout"
 * "setTimeout 2"
 */`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Common Interview Questions
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                <li><strong>Why is JavaScript single-threaded?</strong> Simplifies programming model; avoids concurrency issues. Event loop enables async without threads.</li>
                <li><strong>Difference between microtask and macrotask?</strong> Microtasks (promises) have higher priority and run before the next macrotask.</li>
                <li><strong>What's blocking the event loop?</strong> Long-running synchronous code prevents async callbacks from executing.</li>
            </ul>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Interview Answer (Memorize This)
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                "JavaScript is single-threaded with an event loop. The call stack executes synchronous code. Async operations (like setTimeout or fetch) are handled by Web APIs. When complete, callbacks go to the callback queue (macrotasks) or microtask queue (promises). The event loop processes all microtasks first, then one macrotask, then repeats. This allows non-blocking I/O despite being single-threaded."
            </p>
        </div>
    )
}
