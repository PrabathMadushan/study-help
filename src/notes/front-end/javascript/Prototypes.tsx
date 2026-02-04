import { CodeBlock } from '../../../components/CodeBlock'

export default function Prototypes() {
    return (
        <div className="note-body space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                JavaScript Prototypes & Inheritance
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                JavaScript uses <strong>prototypal inheritance</strong>, not classical inheritance. Every object has an internal link to another object called its <strong>prototype</strong>. When you access a property, JavaScript looks up the prototype chain until it finds it or reaches <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">null</code>.
            </p>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                The Prototype Chain
            </h3>
            <CodeBlock
                code={`const obj = { name: 'Alice' };
console.log(obj.hasOwnProperty('name')); // true
// How? obj doesn't define hasOwnProperty!
// It's inherited from Object.prototype via the prototype chain:
// obj → Object.prototype → null`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Constructor Functions
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                When you create a function, it automatically gets a <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">prototype</code> property. Objects created with <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">new</code> link to this prototype.
            </p>
            <CodeBlock
                code={`function Person(name) {
  this.name = name;
}

// Add method to prototype (shared by all instances)
Person.prototype.greet = function() {
  return \`Hi, I'm \${this.name}\`;
};

const alice = new Person('Alice');
const bob = new Person('Bob');

console.log(alice.greet()); // "Hi, I'm Alice"
console.log(bob.greet()); // "Hi, I'm Bob"

// Both instances share the same greet method
console.log(alice.greet === bob.greet); // true`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                __proto__ vs prototype
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                <li><strong>prototype:</strong> Property on constructor functions. Defines what will be inherited by instances.</li>
                <li><strong>__proto__:</strong> Property on instances. Points to the constructor's prototype (the actual link in the chain).</li>
            </ul>
            <CodeBlock
                code={`function Animal(type) {
  this.type = type;
}

Animal.prototype.speak = function() {
  return 'Some generic sound';
};

const dog = new Animal('Dog');

// The link:
console.log(dog.__proto__ === Animal.prototype); // true
console.log(Animal.prototype.constructor === Animal); // true`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Prototypal Inheritance Example
            </h3>
            <CodeBlock
                code={`function Animal(name) {
  this.name = name;
}
Animal.prototype.eat = function() {
  return \`\${this.name} is eating\`;
};

function Dog(name, breed) {
  Animal.call(this, name); // Call parent constructor
  this.breed = breed;
}

// Set up inheritance
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  return 'Woof!';
};

const rex = new Dog('Rex', 'Labrador');
console.log(rex.eat()); // "Rex is eating" (inherited)
console.log(rex.bark()); // "Woof!" (own method)
console.log(rex instanceof Dog); // true
console.log(rex instanceof Animal); // true`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Modern Approach: Classes (Syntactic Sugar)
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                ES6 classes are syntactic sugar over prototypal inheritance. Under the hood, they still use prototypes.
            </p>
            <CodeBlock
                code={`class Animal {
  constructor(name) {
    this.name = name;
  }
  
  eat() {
    return \`\${this.name} is eating\`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // Call parent constructor
    this.breed = breed;
  }
  
  bark() {
    return 'Woof!';
  }
}

const max = new Dog('Max', 'Golden Retriever');
console.log(max.eat()); // "Max is eating"
console.log(max.bark()); // "Woof!"`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Key Methods
            </h3>
            <CodeBlock
                code={`// Object.create() - creates object with specified prototype
const parent = { greet() { return 'Hello'; } };
const child = Object.create(parent);
console.log(child.greet()); // "Hello" (inherited)

// hasOwnProperty() - check if property is own (not inherited)
console.log(child.hasOwnProperty('greet')); // false
console.log(parent.hasOwnProperty('greet')); // true

// Object.getPrototypeOf()
console.log(Object.getPrototypeOf(child) === parent); // true`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Interview Answer (Memorize This)
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                "JavaScript uses prototypal inheritance. When you access a property, JavaScript looks up the prototype chain until it finds it. Constructor functions have a 'prototype' property that defines what instances inherit. I use ES6 classes for cleaner syntax, but understand they're syntactic sugar over prototypes. For inheritance, I use 'extends' with classes or Object.create() for prototype chains."
            </p>
        </div>
    )
}
