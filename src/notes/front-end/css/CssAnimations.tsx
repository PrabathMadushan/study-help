import { CodeBlock } from '../../../components/CodeBlock'

export default function CssAnimations() {
    return (
        <div className="note-body space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                CSS Animations & Keyframes
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                CSS animations allow you to create smooth, complex animations without JavaScript. They're defined with <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">@keyframes</code> and applied with the <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">animation</code> property.
            </p>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Basic Animation Setup
            </h3>
            <CodeBlock
                language="css"
                code={`/* Define the animation */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Apply the animation */
.element {
  animation: fadeIn 1s ease-in-out;
  /* animation: name duration timing-function */
}

/* Multiple steps */
@keyframes slide {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateX(0);
  }
}`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Animation Properties
            </h3>
            <CodeBlock
                language="css"
                code={`.element {
  /* Shorthand */
  animation: name duration timing-function delay iteration-count direction fill-mode;
  
  /* Long form */
  animation-name: slideIn;
  animation-duration: 2s;
  animation-timing-function: ease-in-out;
  animation-delay: 0.5s;
  animation-iteration-count: infinite; /* or number */
  animation-direction: alternate; /* normal, reverse, alternate, alternate-reverse */
  animation-fill-mode: forwards; /* none, forwards, backwards, both */
  animation-play-state: running; /* running, paused */
}

/* fill-mode explained:
   - forwards: Keeps final state
   - backwards: Applies first frame during delay
   - both: Both forwards + backwards
*/`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Timing Functions
            </h3>
            <CodeBlock
                language="css"
                code={`/* Predefined */
animation-timing-function: linear; /* Constant speed */
animation-timing-function: ease; /* Slow start, fast, slow end (default) */
animation-timing-function: ease-in; /* Slow start */
animation-timing-function: ease-out; /* Slow end */
animation-timing-function: ease-in-out; /* Slow start & end */

/* Custom cubic-bezier */
animation-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55); /* Bounce */

/* Steps (for sprite animations) */
animation-timing-function: steps(4, end); /* 4 discrete steps */`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Common Animation Patterns
            </h3>
            <CodeBlock
                language="css"
                code={`/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide in from left */
@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Scale bounce */
@keyframes bounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

/* Spin */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  animation: spin 1s linear infinite;
}

/* Pulse */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(0.95);
  }
}

/* Shake */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }
}`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Multiple Animations
            </h3>
            <CodeBlock
                language="css"
                code={`.element {
  animation: 
    fadeIn 1s ease-in,
    slideUp 1s ease-out 0.2s,
    pulse 2s ease-in-out 1s infinite;
  /* Separate with commas */
}`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Animation with Hover & States
            </h3>
            <CodeBlock
                language="css"
                code={`@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.button {
  transition: transform 0.3s ease;
}

.button:hover {
  animation: float 2s ease-in-out infinite;
}

/* Pause animation */
.element {
  animation: spin 2s linear infinite;
}

.element:hover {
  animation-play-state: paused;
}`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Performance Considerations
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                For smooth 60fps animations, animate only these properties (GPU-accelerated):
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                <li><strong>transform</strong> - translate, scale, rotate, skew</li>
                <li><strong>opacity</strong></li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                ⚠️ Avoid animating: width, height, top, left, margin, padding (causes layout/paint).
            </p>
            <CodeBlock
                language="css"
                code={`/* ❌ Slow (triggers layout) */
@keyframes slow {
  from { left: 0; width: 100px; }
  to { left: 200px; width: 200px; }
}

/* ✅ Fast (GPU-accelerated) */
@keyframes fast {
  from { transform: translateX(0) scale(1); }
  to { transform: translateX(200px) scale(2); }
}

/* Enable hardware acceleration */
.animated {
  will-change: transform, opacity;
  /* Tells browser to optimize this element */
}`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Real-World Example: Loading Spinner
            </h3>
            <CodeBlock
                language="css"
                code={`@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Pulsing dot */
@keyframes pulse-dot {
  0%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
}

.loading-dots span {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #3498db;
  border-radius: 50%;
  margin: 0 4px;
  animation: pulse-dot 1.4s ease-in-out infinite;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}`}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Interview Answer (Memorize This)
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                "CSS animations use @keyframes to define state changes over time. I apply them with the animation property, specifying duration, timing function, and iteration count. For performance, I animate only transform and opacity—they're GPU-accelerated. I use animation-fill-mode: forwards to keep the final state, and will-change for optimization. Animations are better than JavaScript for simple, declarative motion."
            </p>
        </div>
    )
}
