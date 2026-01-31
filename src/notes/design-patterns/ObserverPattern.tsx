import { CodeBlock } from '../../components/CodeBlock'

export default function ObserverPattern() {
  return (
    <div className="note-body space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        What is Observer? (Interview)
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        <strong>One-to-many:</strong> A subject (or observable) holds state; when it changes, it notifies all observers (subscribers). Observers don&apos;t poll — they react to updates. Used for decoupling: UI subscribes to data; data doesn&apos;t know about UI.
      </p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Simple Implementation
      </h3>
      <CodeBlock
        code={`function createSubject() {
  const observers = new Set();
  return {
    subscribe(fn) {
      observers.add(fn);
      return () => observers.delete(fn);
    },
    notify(data) {
      observers.forEach(fn => fn(data));
    },
  };
}

const store = createSubject();
store.subscribe(state => console.log('Updated:', state));
store.notify({ count: 1 });`}
      />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Pub/Sub vs Observer
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        <strong>Observer:</strong> Subject holds list of observers; when subject changes, it calls them. <strong>Pub/Sub:</strong> Message channel (event bus); publishers emit by event name; subscribers listen by event name. Pub/Sub decouples more (publisher doesn&apos;t know subscribers).
      </p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Where You See It
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        React state + setState: components (observers) re-render when state (subject) changes. Redux: store is subject; subscribers get notified on dispatch. RxJS: Observables are the pattern. DOM events: addEventListener is observer-like.
      </p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Interview Answer
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        &quot;Observer is one-to-many: when the subject changes, all observers are notified. I use it for decoupling — e.g. UI subscribes to data. React&apos;s setState and Redux subscribe are examples. Pub/Sub is similar but uses an event channel so publishers and subscribers don&apos;t reference each other.&quot;
      </p>
    </div>
  )
}
