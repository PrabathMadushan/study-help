import { CodeBlock } from '../../../components/CodeBlock'

export default function ErrorBoundaries() {
  return (
    <div className="note-body space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        What They Do
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Error boundaries catch JavaScript errors in the component tree below
        them and display a fallback UI. They do not catch errors in event
        handlers, async code, or server-side rendering.
      </p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Implementation (Class Component)
      </h3>
      <CodeBlock
        code={`class ErrorBoundary extends React.Component<Props, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logErrorToService(error, info.componentStack);
  }
  render() {
    if (this.state.hasError)
      return this.props.fallback;
    return this.props.children;
  }
}`}
        language="typescript"
      />
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Wrap route-level or feature sections so one failure does not take down
        the whole app.
      </p>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        <strong>Senior tip:</strong> There is no hook equivalent yet; use a
        class component or a library. Combine with logging/monitoring in{' '}
        <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">
          componentDidCatch
        </code>
        .
      </p>
    </div>
  )
}
