import { CodeBlock } from '../../components/CodeBlock'

export default function RestApiBasics() {
  return (
    <div className="note-body space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        REST Methods (Interview Must-Know)
      </h3>
      <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
        <li><strong>GET:</strong> Read resource(s). Idempotent, cacheable. No body.</li>
        <li><strong>POST:</strong> Create resource. Often returns 201 + Location header.</li>
        <li><strong>PUT:</strong> Full replace. Idempotent.</li>
        <li><strong>PATCH:</strong> Partial update. Idempotent when same patch applied twice.</li>
        <li><strong>DELETE:</strong> Remove resource. Idempotent.</li>
      </ul>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        HTTP Status Codes (Frontend Perspective)
      </h3>
      <CodeBlock
        code={`// Success
200 OK        - GET success
201 Created   - POST success, resource created
204 No Content - DELETE success, no body

// Client errors (4xx)
400 Bad Request  - Invalid payload / validation
401 Unauthorized - Not authenticated (missing/invalid token)
403 Forbidden    - Authenticated but not allowed
404 Not Found    - Resource doesn't exist

// Server errors (5xx)
500 Internal Server Error - Server bug / unhandled error`}
      />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Headers and Conventions
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        <strong>Authorization:</strong> <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">Bearer &lt;token&gt;</code> for JWT. <strong>Content-Type:</strong> <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">application/json</code> for JSON bodies. Use plural nouns for resources: <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">/api/users</code>, <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">/api/users/1</code>.
      </p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Idempotency (Senior Level)
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        GET, PUT, DELETE are idempotent: same request multiple times has the same effect. POST is not (creates new resource each time). PATCH can be idempotent if the patch is defined to be so.
      </p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Interview Answer
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        &quot;REST uses HTTP methods: GET for read, POST for create, PUT/PATCH for update, DELETE for remove. I use proper status codes: 2xx for success, 4xx for client errors (400 validation, 401 auth, 404 not found), 5xx for server errors. I send Authorization for auth and Content-Type for JSON. From the frontend I always handle loading, error, and success states and show appropriate UI.&quot;
      </p>
    </div>
  )
}
