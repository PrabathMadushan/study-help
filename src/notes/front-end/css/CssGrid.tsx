import { CodeBlock } from '../../../components/CodeBlock'

export default function CssGrid() {
    return (
        <div className="note-body space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                CSS Grid Layout
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                CSS Grid is a powerful two-dimensional layout system for creating complex, responsive layouts. Unlike Flexbox (one-dimensional), Grid handles both rows and columns simultaneously.
            </p>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Basic Grid Setup
            </h3>
            <CodeBlock
                language="css"
                code={`.container {
  display: grid;
  grid-template-columns: 200px 1fr 200px; /* 3 columns */
  grid-template-rows: auto 1fr auto; /* 3 rows */
  gap: 20px; /* Spacing between grid items */
  height: 100vh;
}

/* Explicit placement */
.header {
  grid-column: 1 / 4; /* Span all 3 columns */
  grid-row: 1;
}

.sidebar {
  grid-column: 1;
  grid-row: 2;
}

.main {
  grid-column: 2;
  grid-row: 2;
}

.aside {
  grid-column: 3;
  grid-row: 2;
}

.footer {
  grid-column: 1 / 4; /* Span all 3 columns */
  grid-row: 3;
}`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Grid Template Areas (Named Layout)
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                A visual, intuitive way to define layouts. This is often asked in interviews!
            </p>
            <CodeBlock
                language="css"
                code={`.container {
  display: grid;
  grid-template-areas:
    'header header header'
    'sidebar main aside'
    'footer footer footer';
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  gap: 20px;
  height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Responsive Grid with auto-fit & minmax()
            </h3>
            <CodeBlock
                language="css"
                code={`/* Holy Grail: Responsive card grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

/* 
  auto-fit: Creates as many columns as fit
  minmax(250px, 1fr): Each column min 250px, grows equally
  Result: Automatically responsive without media queries!
*/

/* Fixed number of columns */
.three-column {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

/* Responsive with media queries */
@media (max-width: 768px) {
  .three-column {
    grid-template-columns: 1fr;
  }
}`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Grid Alignment
            </h3>
            <CodeBlock
                language="css"
                code={`.container {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(2, 100px);
  gap: 10px;
  
  /* Align items within their grid cells */
  justify-items: center; /* horizontal */
  align-items: center; /* vertical */
  
  /* Align entire grid within container */
  justify-content: space-between; /* horizontal */
  align-content: center; /* vertical */
  
  height: 500px;
}

/* Individual item alignment */
.item {
  justify-self: end; /* Overrides justify-items */
  align-self: start; /* Overrides align-items */
}`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Spanning Cells
            </h3>
            <CodeBlock
                language="css"
                code={`.item-1 {
  grid-column: 1 / 3; /* Start at line 1, end before line 3 */
  grid-row: 1 / 2;
}

/* Shorthand */
.item-2 {
  grid-column: span 2; /* Span 2 columns */
  grid-row: span 3; /* Span 3 rows */
}

/* Start/end syntax */
.item-3 {
  grid-column-start: 2;
  grid-column-end: 4;
}`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                fr Unit & Fractional Sizing
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">fr</code> (fraction) distributes remaining space proportionally.
            </p>
            <CodeBlock
                language="css"
                code={`/* 1fr, 2fr, 1fr = 25%, 50%, 25% of available space */
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
}

/* Mixed units */
.container {
  grid-template-columns: 200px 1fr 2fr;
  /* 200px fixed, remaining space split 1:2 */
}

/* auto vs fr */
.container {
  grid-template-columns: auto 1fr;
  /* auto: fits content, 1fr: takes remaining space */
}`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Real-World Example: Dashboard Layout
            </h3>
            <CodeBlock
                language="css"
                code={`.dashboard {
  display: grid;
  grid-template-areas:
    'nav header header'
    'nav main aside'
    'nav main aside';
  grid-template-columns: 250px 1fr 300px;
  grid-template-rows: auto 1fr auto;
  gap: 20px;
  height: 100vh;
  padding: 20px;
}

.nav {
  grid-area: nav;
  background: #2c3e50;
}

.header {
  grid-area: header;
  background: #ecf0f1;
}

.main {
  grid-area: main;
  background: white;
  overflow-y: auto;
}

.aside {
  grid-area: aside;
  background: #ecf0f1;
}

/* Responsive */
@media (max-width: 1024px) {
  .dashboard {
    grid-template-areas:
      'header'
      'nav'
      'main'
      'aside';
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr auto;
  }
}`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Grid vs Flexbox (When to Use)
            </h3>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                            <th className="px-4 py-2 text-left">Grid</th>
                            <th className="px-4 py-2 text-left">Flexbox</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-t dark:border-gray-700">
                            <td className="px-4 py-2">Two-dimensional (rows & columns)</td>
                            <td className="px-4 py-2">One-dimensional (row or column)</td>
                        </tr>
                        <tr className="border-t dark:border-gray-700">
                            <td className="px-4 py-2">Layout-first (structure defined upfront)</td>
                            <td className="px-4 py-2">Content-first (flexible size)</td>
                        </tr>
                        <tr className="border-t dark:border-gray-700">
                            <td className="px-4 py-2">Page layouts, dashboards, card grids</td>
                            <td className="px-4 py-2">Navbars, centering, simple rows/columns</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Interview Answer (Memorize This)
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                "CSS Grid is for two-dimensional layouts. I define columns with grid-template-columns and rows with grid-template-rows. The 'fr' unit distributes space proportionally. I use grid-template-areas for readable, visual layouts. For responsive grids, repeat(auto-fit, minmax()) creates flexible card layouts without media queries. Grid is perfect for page layouts; Flexbox is better for one-dimensional components."
            </p>
        </div>
    )
}
