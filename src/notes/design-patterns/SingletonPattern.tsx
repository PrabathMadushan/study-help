import { CodeBlock } from '../../components/CodeBlock'

export default function SingletonPattern() {
  return (
    <div className="note-body space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        What is Singleton? (Interview)
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Ensures only <strong>one instance</strong> of a class or object exists in the app. Use for shared resources: config, API client, logger, connection pool. In JavaScript/TypeScript you often use a module (single object) or a class with a static getInstance().
      </p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Plain Object (Simplest)
      </h3>
      <CodeBlock
        code={`// One object = one instance
const config = {
  apiUrl: process.env.VITE_API_URL,
  theme: 'dark',
};
export default config;`}
      />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Class with getInstance
      </h3>
      <CodeBlock
        code={`class ApiClient {
  private static instance: ApiClient | null = null;

  private constructor() {
    // init
  }

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }
}`}
        language="typescript"
      />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        When to Use / When Not
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        <strong>Use for:</strong> App-wide config, single API client, logger, DB connection. <strong>Avoid for:</strong> Things that need multiple instances (e.g. multiple API clients for different backends) or that make testing harder (global mutable state).
      </p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Interview Answer
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        &quot;Singleton ensures one instance of a class or object. I use it for config, API client, or logger. In JS I often use a module that exports one object; in TypeScript I might use a class with a private constructor and static getInstance(). I avoid it when we need multiple instances or when it hurts testability.&quot;
      </p>
    </div>
  )
}
