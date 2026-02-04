import { CodeBlock } from '../../../components/CodeBlock'

export default function Promises() {
    return (
        <div className="note-body space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                JavaScript Promises
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                A <strong>Promise</strong> represents the eventual completion (or failure) of an asynchronous operation. It's an object that can be in one of three states: <strong>pending</strong>, <strong>fulfilled</strong>, or <strong>rejected</strong>.
            </p>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Creating a Promise
            </h3>
            <CodeBlock
                code={`const promise = new Promise((resolve, reject) => {
  // Async work here
  const success = true;
  
  if (success) {
    resolve('Data loaded!'); // Fulfill
  } else {
    reject('Error occurred'); // Reject
  }
});

promise
  .then(result => console.log(result)) // "Data loaded!"
  .catch(error => console.error(error));`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Promise States
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                <li><strong>Pending:</strong> Initial state, neither fulfilled nor rejected</li>
                <li><strong>Fulfilled:</strong> Operation completed successfully (resolve called)</li>
                <li><strong>Rejected:</strong> Operation failed (reject called)</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Once settled (fulfilled or rejected), a promise <strong>cannot change state</strong>.
            </p>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Chaining Promises
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">.then()</code> returns a new promise, allowing chaining.
            </p>
            <CodeBlock
                code={`fetch('/api/user')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    return fetch(\`/api/posts/\${data.id}\`);
  })
  .then(response => response.json())
  .then(posts => console.log(posts))
  .catch(error => console.error('Error:', error))
  .finally(() => console.log('Cleanup work'));

// .finally() runs regardless of success/failure`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Promise Static Methods
            </h3>
            <CodeBlock
                code={`// Promise.all() - wait for all to resolve
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = Promise.resolve(3);

Promise.all([p1, p2, p3])
  .then(values => console.log(values)); // [1, 2, 3]

// If ANY reject, Promise.all() rejects immediately
Promise.all([p1, Promise.reject('Error'), p3])
  .catch(error => console.log(error)); // "Error"

// ---

// Promise.allSettled() - wait for all, regardless of outcome
Promise.allSettled([p1, Promise.reject('Fail'), p3])
  .then(results => console.log(results));
// [
//   { status: 'fulfilled', value: 1 },
//   { status: 'rejected', reason: 'Fail' },
//   { status: 'fulfilled', value: 3 }
// ]

// ---

// Promise.race() - first to settle (resolve or reject) wins
Promise.race([
  new Promise(resolve => setTimeout(() => resolve('Fast'), 100)),
  new Promise(resolve => setTimeout(() => resolve('Slow'), 200))
]).then(result => console.log(result)); // "Fast"

// ---

// Promise.any() - first to FULFILL wins (ignores rejections)
Promise.any([
  Promise.reject('Error 1'),
  Promise.resolve('Success'),
  Promise.reject('Error 2')
]).then(result => console.log(result)); // "Success"`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Error Handling
            </h3>
            <CodeBlock
                code={`// Errors in .then() are caught by .catch()
Promise.resolve(5)
  .then(value => {
    throw new Error('Something broke!');
  })
  .then(value => {
    console.log('This will not run');
  })
  .catch(error => {
    console.error(error.message); // "Something broke!"
  });

// Catch doesn't stop the chain
Promise.reject('Error')
  .catch(err => {
    console.log('Caught:', err);
    return 'Recovered';
  })
  .then(value => console.log(value)); // "Recovered"`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Common Interview Question: Promise vs Callback
            </h3>
            <CodeBlock
                code={`// Callback Hell:
getData(function(a) {
  getMoreData(a, function(b) {
    getEvenMoreData(b, function(c) {
      console.log(c);
    });
  });
});

// Promise Chain (much better!):
getData()
  .then(a => getMoreData(a))
  .then(b => getEvenMoreData(b))
  .then(c => console.log(c))
  .catch(handleError);`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Creating Utility Promises
            </h3>
            <CodeBlock
                code={`// Promisify setTimeout
const delay = (ms) => new Promise (resolve => setTimeout(resolve, ms));

await delay(1000);
console.log('1 second later!');

// Promisify callback-based APIs
function readFilePromise(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Interview Answer (Memorize This)
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                "A Promise represents an async operation's eventual result. It has three states: pending, fulfilled, or rejected. I use .then() for success, .catch() for errors, and .finally() for cleanup. For multiple promises, Promise.all() waits for all, Promise.race() for the first, and Promise.allSettled() for all results regardless of status. Promises solve callback hell and enable cleaner chaining."
            </p>
        </div>
    )
}
