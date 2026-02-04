import { CodeBlock } from '../../../components/CodeBlock'

export default function DebounceThrottle() {
    return (
        <div className="note-body space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Debounce & Throttle
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong>Debounce</strong> and <strong>Throttle</strong> are performance optimization techniques that limit how often a function is called. They're critical for handling high-frequency events like scrolling, resizing, or typing.
            </p>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Debounce: Wait Until User Stops
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong>Debounce</strong> delays execution until the user has <em>stopped</em> triggering the event for a specified time. Use for search input, form validation, or window resize.
            </p>
            <CodeBlock
                code={`function debounce(func, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId); // Cancel previous timer
    
    timeoutId = setTimeout(() => {
      func.apply(this, args); // Execute after delay
    }, delay);
  };
}

// Usage: Search API call
const searchAPI = (query) => {
  console.log('Searching for:', query);
  // fetch(\`/api/search?q=\${query}\`)
};

const debouncedSearch = debounce(searchAPI, 300);

// User types: "r", "re", "rea", "reac", "react"
// Only calls searchAPI once, 300ms after they stop typing!
input.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Throttle: Execute at Regular Intervals
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong>Throttle</strong> ensures a function is called <em>at most once</em> per time interval, regardless of how many times the event fires. Use for scroll handlers, mouse movement, or button clicks.
            </p>
            <CodeBlock
                code={`function throttle(func, limit) {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Usage: Track scroll position
const handleScroll = () => {
  console.log('Scroll position:', window.scrollY);
};

const throttledScroll = throttle(handleScroll, 200);

// User scrolls rapidly - handleScroll called max once per 200ms
window.addEventListener('scroll', throttledScroll);`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Debounce vs Throttle Comparison
            </h3>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                            <th className="px-4 py-2 text-left">Aspect</th>
                            <th className="px-4 py-2 text-left">Debounce</th>
                            <th className="px-4 py-2 text-left">Throttle</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-t dark:border-gray-700">
                            <td className="px-4 py-2">When executes</td>
                            <td className="px-4 py-2">After user stops</td>
                            <td className="px-4 py-2">At regular intervals</td>
                        </tr>
                        <tr className="border-t dark:border-gray-700">
                            <td className="px-4 py-2">Use case</td>
                            <td className="px-4 py-2">Search input, form validation</td>
                            <td className="px-4 py-2">Scroll, resize, mouse movement</td>
                        </tr>
                        <tr className="border-t dark:border-gray-700">
                            <td className="px-4 py-2">Executions</td>
                            <td className="px-4 py-2">Once after delay</td>
                            <td className="px-4 py-2">Multiple, but limited</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                React Hook Implementation
            </h3>
            <CodeBlock
                code={`import { useEffect, useRef } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}

// Usage:
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  
  useEffect(() => {
    if (debouncedSearch) {
      // API call here
      fetchResults(debouncedSearch);
    }
  }, [debouncedSearch]);
  
  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Advanced: Leading & Trailing Edge
            </h3>
            <CodeBlock
                code={`function debounce(func, delay, { leading = false, trailing = true } = {}) {
  let timeoutId;
  let lastCallTime;
  
  return function(...args) {
    const now = Date.now();
    const isFirstCall = !lastCallTime;
    
    clearTimeout(timeoutId);
    lastCallTime = now;
    
    if (leading && isFirstCall) {
      func.apply(this, args); // Execute immediately on first call
    }
    
    if (trailing) {
      timeoutId = setTimeout(() => {
        func.apply(this, args); // Execute after delay
        lastCallTime = undefined;
      }, delay);
    }
  };
}

// Throttle with trailing edge
function throttle(func, limit, { trailing = true } = {}) {
  let inThrottle;
  let lastArgs;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
        if (trailing && lastArgs) {
          func.apply(this, lastArgs);
          lastArgs = null;
        }
      }, limit);
    } else if (trailing) {
      lastArgs = args; // Save for trailing call
    }
  };
}`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Interview Answer (Memorize This)
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                "Debounce delays function execution until the user stops triggering the event—I use it for search inputs to avoid excessive API calls. Throttle limits execution to once per interval—I use it for scroll handlers to maintain performance. Debounce waits for quiet; throttle executes at regular intervals. I often use lodash.debounce/throttle or implement custom hooks in React."
            </p>
        </div>
    )
}
