import { CodeBlock } from '../../../components/CodeBlock'

export default function TailwindUtility() {
  return (
    <div className="note-body space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Utility-First CSS (Interview Concept)
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Tailwind provides low-level utility classes (e.g. <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">flex</code>, <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">p-4</code>, <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">rounded-lg</code>) instead of pre-styled components. You compose them in the markup. No context switching to a separate CSS file for small tweaks.
      </p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Common Utilities to Know
      </h3>
      <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
        <li><strong>Layout:</strong> <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">flex</code>, <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">grid</code>, <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">gap-4</code>, <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">space-x-2</code></li>
        <li><strong>Spacing:</strong> <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">p-4</code>, <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">m-2</code>, <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">mt-4</code></li>
        <li><strong>Typography:</strong> <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">text-sm</code>, <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">font-semibold</code>, <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">text-gray-700</code></li>
        <li><strong>Responsive:</strong> <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">sm:</code>, <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">md:</code>, <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">lg:</code> prefixes</li>
        <li><strong>Dark mode:</strong> <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">dark:bg-gray-800</code>, <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">dark:text-white</code></li>
      </ul>
      <CodeBlock
        code={`<div className="flex items-center gap-4 p-4 rounded-lg bg-white dark:bg-gray-800 shadow">
  <span className="text-lg font-semibold text-gray-900 dark:text-white">Title</span>
</div>`}
        language="jsx"
      />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Config and Extensibility
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Configure theme (colors, spacing, breakpoints) in <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">tailwind.config.js</code>. Use <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">@apply</code> in CSS only for repeated utility combinations; prefer composing in JSX for consistency.
      </p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Interview Answer
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        &quot;Tailwind is utility-first: I use small, single-purpose classes and compose them in the markup. It speeds up UI work, keeps styles co-located, and supports responsive and dark mode with prefixes. I configure the theme when we need design tokens; otherwise I stick to the default scale.&quot;
      </p>
    </div>
  )
}
