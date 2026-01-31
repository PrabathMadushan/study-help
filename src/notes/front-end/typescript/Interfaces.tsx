import { CodeBlock } from '../../../components/CodeBlock'

export default function Interfaces() {
  return (
    <div className="note-body space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        type vs interface (Interview Favorite)
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Use <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">interface</code> for object shapes; use <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">type</code> for unions, primitives, and mapped types. <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">interface</code> can be extended and merged (declaration merging); <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">type</code> cannot.
      </p>
      <CodeBlock
        code={`interface User {
  id: number;
  name: string;
  email?: string;
}

type Status = 'idle' | 'loading' | 'error';

interface Admin extends User {
  role: string;
}`}
        language="typescript"
      />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Optional and Union Types
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Optional properties use <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">?</code>. Union types restrict to a set of values — great for component props and API responses.
      </p>
      <CodeBlock
        code={`interface CardProps {
  title: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

type ApiStatus = 'idle' | 'loading' | 'success' | 'error';`}
        language="typescript"
      />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Typing API Responses (Senior Level)
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Always define interfaces for API responses so the rest of the app is typed. Use generics for reusable fetchers.
      </p>
      <CodeBlock
        code={`interface User {
  id: number;
  name: string;
  email?: string;
}

async function fetchUsers(): Promise<User[]> {
  const res = await fetch('/api/users');
  return res.json();
}`}
        language="typescript"
      />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        any vs unknown
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Avoid <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">any</code>; it opts out of type checking. For truly unknown data (e.g. JSON.parse), use <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">unknown</code> and narrow with type guards (typeof, in, or custom predicates).
      </p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Interview Answer
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        &quot;I use interface for object shapes and when I need to extend; I use type for unions and primitives. I always type props, state, and API responses. I avoid any and use unknown with type guards when the shape isn&apos;t known upfront.&quot;
      </p>
    </div>
  )
}
