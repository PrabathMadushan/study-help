import { CodeBlock } from '../../../components/CodeBlock'

export default function ThisKeyword() {
    return (
        <div className="note-body space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                What is "this" in JavaScript?
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">this</code> is a special keyword that refers to the execution context. Its value depends on <strong>how a function is called</strong>, not where it's defined. This is one of the most confusing topics in JavaScript interviews.
            </p>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                1. Global Context
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                In the global scope (outside any function), <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">this</code> refers to the global object (<code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">window</code> in browsers, <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">global</code> in Node.js).
            </p>
            <CodeBlock
                code={`console.log(this); // window (in browser)
this.name = 'Global';
console.log(window.name); // 'Global'`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                2. Object Method
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                When a function is called as a method of an object, <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">this</code> refers to the object before the dot.
            </p>
            <CodeBlock
                code={`const user = {
  name: 'Alice',
  greet() {
    console.log(\`Hello, \${this.name}\`); // this = user
  }
};
user.greet(); // "Hello, Alice"

// ⚠️ Pitfall: losing context
const fn = user.greet;
fn(); // "Hello, undefined" (this = window/global)`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                3. Constructor Functions & Classes
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                When using <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">new</code>, <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">this</code> refers to the newly created instance.
            </p>
            <CodeBlock
                code={`function Person(name) {
  this.name = name;
}
const p = new Person('Bob');
console.log(p.name); // 'Bob'

// Same with classes
class Animal {
  constructor(type) {
    this.type = type;
  }
}
const cat = new Animal('Cat');
console.log(cat.type); // 'Cat'`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                4. Arrow Functions
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Arrow functions <strong>do not have their own this</strong>. They inherit <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">this</code> from the surrounding (lexical) scope.
            </p>
            <CodeBlock
                code={`const user = {
  name: 'Charlie',
  greet: () => {
    console.log(this.name); // undefined (this = global/window)
  },
  delayedGreet() {
    setTimeout(() => {
      console.log(this.name); // 'Charlie' (inherits from delayedGreet)
    }, 1000);
  }
};
user.greet(); // undefined
user.delayedGreet(); // 'Charlie' after 1s`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                5. call, apply, bind
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                You can explicitly set <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">this</code> using <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">call</code>, <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">apply</code>, or <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">bind</code>.
            </p>
            <CodeBlock
                code={`function greet(greeting) {
  return \`\${greeting}, \${this.name}\`;
}

const user = { name: 'Dave' };

// call: invoke immediately with args
console.log(greet.call(user, 'Hi')); // "Hi, Dave"

// apply: same, but args as array
console.log(greet.apply(user, ['Hello'])); // "Hello, Dave"

// bind: returns new function with this bound
const boundGreet = greet.bind(user);
console.log(boundGreet('Hey')); // "Hey, Dave"`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Common Interview Questions
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                <li><strong>What determines this?</strong> How the function is <em>called</em>, not where it's defined.</li>
                <li><strong>Arrow functions vs regular?</strong> Arrow functions don't have their own <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">this</code>; they inherit it.</li>
                <li><strong>How to fix lost context?</strong> Use <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">bind</code>, arrow functions, or store <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">this</code> in a variable (e.g., <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">const self = this</code>).</li>
            </ul>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Interview Answer (Memorize This)
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                "The value of 'this' depends on how a function is called. In object methods, it's the object. In constructors with 'new', it's the new instance. Arrow functions don't have their own 'this'—they inherit from the outer scope. I use bind, call, or apply to explicitly set 'this' when needed, especially for callbacks and event handlers."
            </p>
        </div>
    )
}
