import { CodeBlock } from '../../components/CodeBlock'

export default function JwtAuth() {
  return (
    <div className="note-body space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        JWT Structure (Interview Favorite)
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        JWT (JSON Web Token) has three parts separated by dots: <strong>header</strong> (algorithm, type), <strong>payload</strong> (claims: sub, exp, iat, custom data), <strong>signature</strong> (HMAC or RSA). The signature ensures the token hasn&apos;t been tampered with. Payload is Base64-encoded, not encrypted — don&apos;t put secrets in it.
      </p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Where to Store Tokens (Frontend)
      </h3>
      <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
        <li><strong>Memory:</strong> In a variable or ref. Lost on refresh; no XSS persistence. Good for short-lived access tokens.</li>
        <li><strong>httpOnly cookie:</strong> Set by server; not readable by JS. Reduces XSS risk. Use for refresh or session.</li>
        <li><strong>localStorage:</strong> Persists across tabs; readable by any script. Vulnerable to XSS. Avoid for tokens if you can.</li>
      </ul>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Sending the Token
      </h3>
      <CodeBlock
        code={`// Typical: Authorization header
headers: {
  'Authorization': \`Bearer \${token}\`,
  'Content-Type': 'application/json',
}

// Or: cookie sent automatically if same-origin`}
      />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Refresh Token Pattern
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Access token: short-lived (e.g. 15 min). Refresh token: long-lived, stored securely (httpOnly cookie or secure storage). When access token expires, call a refresh endpoint with the refresh token to get a new access token. Don&apos;t put refresh token in localStorage if you can avoid it.
      </p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Interview Answer
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        &quot;JWT has header, payload, and signature. Payload is Base64, not encrypted. I prefer not storing JWT in localStorage due to XSS; I use memory or httpOnly cookie. I send it in the Authorization header as Bearer token. For refresh I use a separate refresh token and a dedicated endpoint.&quot;
      </p>
    </div>
  )
}
