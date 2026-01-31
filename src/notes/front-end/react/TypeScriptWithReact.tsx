import { CodeBlock } from '../../../components/CodeBlock'

export default function TypeScriptWithReact() {
  return (
    <div className="note-body space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Typing Props
      </h3>
      <CodeBlock
        code={`interface CardProps {
  title: string;
  onClick?: () => void;
  children: React.ReactNode;
}
function Card({ title, onClick, children }: CardProps) { ... }`}
        language="typescript"
      />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Typing Events &amp; Refs
      </h3>
      <CodeBlock
        code={`const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { ... };
const divRef = useRef<HTMLDivElement>(null);`}
        language="typescript"
      />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Generics for Components
      </h3>
      <CodeBlock
        code={`interface SelectProps<T> {
  options: T[];
  getLabel: (item: T) => string;
  getValue: (item: T) => string;
}
function Select<T>({ options, getLabel, getValue }: SelectProps<T>) { ... }`}
        language="typescript"
      />
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        <strong>Senior tip:</strong> Use{' '}
        <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">
          React.ReactNode
        </code>{' '}
        for children; avoid{' '}
        <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">
          any
        </code>
        ; type hooks with generics{' '}
        <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">
          useState&lt;User | null&gt;(null)
        </code>
        .
      </p>
    </div>
  )
}
