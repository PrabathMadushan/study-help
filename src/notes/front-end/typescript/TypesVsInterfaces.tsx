import { CodeBlock } from '../../../components/CodeBlock'

export default function TypesVsInterfaces() {
    return (
        <div className="note-body space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Types vs Interfaces in TypeScript
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Both <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">type</code> and <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">interface</code> define object shapes in TypeScript. They're similar but have key differences. This is a top interview question!
            </p>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Basic Syntax
            </h3>
            <CodeBlock
                language="typescript"
                code={`// Interface
interface User {
  id: number;
  name: string;
  email?: string; // Optional
}

// Type alias
type UserType = {
  id: number;
  name: string;
  email?: string;
};

// Both work the same for objects:
const user1: User = { id: 1, name: 'Alice' };
const user2: UserType = { id: 2, name: 'Bob' };`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Key Differences
            </h3>
            <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                1. Declaration Merging (Interfaces Only)
            </h4>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Interfaces can be defined multiple times and TypeScript will merge them. Types cannot.
            </p>
            <CodeBlock
                language="typescript"
                code={`// ✅ Interfaces merge automatically
interface Window {
  title: string;
}

interface Window {
  width: number;
}

// Result: Window has both title and width
const win: Window = {
  title: 'My Window',
  width: 800
};

// ❌ Types cannot merge
type Config = { theme: string; };
// type Config = { lang: string; }; // Error: Duplicate identifier`}
            />
            <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                2. Primitives & Unions (Types Only)
            </h4>
            <CodeBlock
                language="typescript"
                code={`// ✅ Types can represent primitives
type ID = string | number;
type Status = 'pending' | 'success' | 'error';

// ❌ Interfaces cannot
// interface ID = string | number; // Error!

// ✅ Types support complex unions
type Shape = Circle | Square | Triangle;

// Interfaces need workarounds
interface Shape {
  kind: 'circle' | 'square' | 'triangle';
}`}
            />
            <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                3. Extending (Both, Different Syntax)
            </h4>
            <CodeBlock
                language="typescript"
                code={`// Interfaces use 'extends'
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// Types use intersection (&)
type AnimalType = {
  name: string;
};

type DogType = AnimalType & {
  breed: string;
};

// Both work:
const dog1: Dog = { name: 'Rex', breed: 'Labrador' };
const dog2: DogType = { name: 'Max', breed: 'Golden' };`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                When to Use Each
            </h3>
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4">
                <p className="font-semibold text-blue-900 dark:text-blue-200">Use Interfaces when:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-blue-800 dark:text-blue-300">
                    <li>Defining object shapes (especially public APIs)</li>
                    <li>Working with classes (implements)</li>
                    <li>Need declaration merging (extending library types)</li>
                    <li>Better error messages (TypeScript prefers interfaces)</li>
                </ul>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 mt-4">
                <p className="font-semibold text-green-900 dark:text-green-200">Use Types when:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-green-800 dark:text-green-300">
                    <li>Defining unions or intersections</li>
                    <li>Creating utility types or mapped types</li>
                    <li>Working with primitives, tuples, or functions</li>
                    <li>Computing types (conditional types)</li>
                </ul>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Advanced Examples
            </h3>
            <CodeBlock
                language="typescript"
                code={`// Interfaces with classes
interface Drawable {
  draw(): void;
}

class Circle implements Drawable {
  draw() {
    console.log('Drawing circle');
  }
}

// Type with mapped types
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

type User = { name: string; age: number };
type ReadonlyUser = Readonly<User>;
// Result: { readonly name: string; readonly age: number; }

// Type with conditional types
type IsString<T> = T extends string ? true : false;
type A = IsString<string>; // true
type B = IsString<number>; // false`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Performance & Compilation
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Interfaces are slightly faster for TypeScript's type checker because they're  cached by name. Types are re-computed each time. For most apps, the difference is negligible.
            </p>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Interview Answer (Memorize This)
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                "Both define object shapes. Interfaces support declaration merging and work better with classes. Types support unions, primitives, and advanced features like mapped and conditional types. I use interfaces for object shapes and public APIs, and types for unions, utility types, or when I need more flexibility. The TypeScript team recommends interfaces for most cases."
            </p>
        </div>
    )
}
