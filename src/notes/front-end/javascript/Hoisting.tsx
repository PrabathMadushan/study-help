import { CodeBlock } from '../../../components/CodeBlock'

export default function Hoisting() {
    return (
        <div className="note-body space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Hoisting in JavaScript
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong>Hoisting</strong> is JavaScript's behavior of moving variable and function  <em>declarations</em> to the top of their scope during compilation. Only declarations are hoisted, not initializations.
            </p>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Function Hoisting
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Function <em>declarations</em> are fully hoisted—you can call them before they appear in code.
            </p>
            <CodeBlock
                code={`greet (); // "Hello!" - works!

function greet() {
  return 'Hello!';
}

// Why? During compilation, the function is hoisted:
// function greet() { return 'Hello!'; }
// greet();`}
            />
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                ⚠️ <strong>Function expressions</strong> are NOT hoisted:
            </p>
            <CodeBlock
                code={`greet(); // ❌ TypeError: greet is not a function

const greet = function() {
  return 'Hello!';
};

// Why? 'const greet' is hoisted, but it's in the TDZ (see below)`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                var Hoisting
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">var</code> declarations are hoisted and initialized to <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">undefined</code>.
            </p>
            <CodeBlock
                code={`console.log(x); // undefined (not ReferenceError!)
var x = 5;
console.log(x); // 5

// Hoisted as:
// var x = undefined;
// console.log(x);
// x = 5;
// console.log(x);`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                let & const: Temporal Dead Zone (TDZ)
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">let</code> and <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">const</code> <em>are</em> hoisted, but they're not initialized. Accessing them before the declaration results in a <strong>ReferenceError</strong> due to the TDZ.
            </p>
            <CodeBlock
                code={`console.log(y); // ❌ ReferenceError: Cannot access 'y' before initialization
let y = 10;

// TDZ = time between scope start and declaration
{
  // TDZ starts here for 'z'
  console.log(z); // ❌ ReferenceError
  let z = 20; // TDZ ends
  console.log(z); // 20 ✅
}`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Class Hoisting
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Classes are hoisted but remain in the TDZ until declaration.
            </p>
            <CodeBlock
                code={`const p = new Person(); // ❌ ReferenceError

class Person {
  constructor(name) {
    this.name = name;
  }
}`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Common Pitfall: var in Loops
            </h3>
            <CodeBlock
                code={`// Problem with var:
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3 (all closures share the same 'i')

// Fix with let (block scope):
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 100);
}
// Output: 0, 1, 2 (each iteration has its own 'j')`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Summary Table
            </h3>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                            <th className="px-4 py-2 text-left">Declaration</th>
                            <th className="px-4 py-2 text-left">Hoisted?</th>
                            <th className="px-4 py-2 text-left">Initialized?</th>
                            <th className="px-4 py-2 text-left">TDZ?</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-t dark:border-gray-700">
                            <td className="px-4 py-2"><code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">var</code></td>
                            <td className="px-4 py-2">Yes</td>
                            <td className="px-4 py-2">undefined</td>
                            <td className="px-4 py-2">No</td>
                        </tr>
                        <tr className="border-t dark:border-gray-700">
                            <td className="px-4 py-2"><code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">let/const</code></td>
                            <td className="px-4 py-2">Yes</td>
                            <td className="px-4 py-2">No</td>
                            <td className="px-4 py-2">Yes</td>
                        </tr>
                        <tr className="border-t dark:border-gray-700">
                            <td className="px-4 py-2">function</td>
                            <td className="px-4 py-2">Yes</td>
                            <td className="px-4 py-2">Fully</td>
                            <td className="px-4 py-2">No</td>
                        </tr>
                        <tr className="border-t dark:border-gray-700">
                            <td className="px-4 py-2">class</td>
                            <td className="px-4 py-2">Yes</td>
                            <td className="px-4 py-2">No</td>
                            <td className="px-4 py-2">Yes</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Interview Answer (Memorize This)
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                "Hoisting moves declarations to the top of their scope during compilation. 'var' is hoisted and initialized to undefined. 'let' and 'const' are hoisted but stay in the Temporal Dead Zone (TDZ) until their line runs—accessing them before throws a ReferenceError. Function declarations are fully hoisted, but function expressions are not. I prefer 'let/const' to avoid hoisting confusion and use block scope."
            </p>
        </div>
    )
}
