import { CodeBlock } from '../../../components/CodeBlock'

export default function CssFlexbox() {
  return (
    <div className="note-body space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Flexbox Basics (Interview Must-Know)
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">display: flex</code> turns a container into a flex context. Children become flex items. Control layout with container properties (direction, wrap, justify, align) and optional item properties (flex-grow, flex-shrink, order).
      </p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Key Container Properties
      </h3>
      <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
        <li><strong>flex-direction:</strong> <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">row</code> (default), <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">column</code>, <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">row-reverse</code>, <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">column-reverse</code></li>
        <li><strong>justify-content:</strong> alignment along main axis (flex-start, center, flex-end, space-between, space-around)</li>
        <li><strong>align-items:</strong> alignment along cross axis (stretch, flex-start, center, flex-end)</li>
        <li><strong>gap:</strong> spacing between items (no margin hacks)</li>
        <li><strong>flex-wrap:</strong> <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">wrap</code> when items overflow</li>
      </ul>
      <CodeBlock
        code={`/* Center a card */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

/* Navbar: logo left, links right */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}`}
        language="css"
      />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Flexbox vs Grid (When to Use)
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Use <strong>Flexbox</strong> for one-dimensional layouts (a row or a column) and when you want content to wrap or align along one axis. Use <strong>Grid</strong> when you need two-dimensional control (rows and columns) and explicit placement.
      </p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Interview Answer
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        &quot;Flexbox is for one-dimensional layout. I use display flex, then justify-content and align-items for alignment, and gap for spacing. For navbars, centering, and simple rows/columns I use Flexbox; for full page or card grids I use CSS Grid.&quot;
      </p>
    </div>
  )
}
