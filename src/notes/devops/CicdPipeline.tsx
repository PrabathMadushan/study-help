import { CodeBlock } from '../../components/CodeBlock'

export default function CicdPipeline() {
  return (
    <div className="note-body space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        CI/CD in One Sentence (Interview Gold)
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        <strong>&quot;CI/CD automates build, test, and deployment so every change is safely released without manual effort.&quot;</strong> Memorize this for interviews.
      </p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Typical Pipeline Stages
      </h3>
      <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
        <li><strong>Build:</strong> Install deps, compile/transpile (e.g. npm run build).</li>
        <li><strong>Test:</strong> Unit tests, lint, type check. Fail the pipeline if tests fail.</li>
        <li><strong>Deploy:</strong> Push build to hosting (Netlify, Vercel, S3, etc.). Often separate for staging vs production.</li>
      </ul>
      <CodeBlock
        code={`# Example: Netlify / Vercel
# On push to main:
# 1. Build: npm run build
# 2. Test: npm run test (if configured)
# 3. Deploy: publish dist/ to CDN`}
      />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Tools (Frontend Context)
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        <strong>GitHub Actions, GitLab CI:</strong> Define workflows in YAML; run build/test/deploy on push or PR. <strong>Netlify, Vercel:</strong> Connect repo; they run build and deploy on push. No server to manage. <strong>Jenkins:</strong> Self-hosted; more config, full control.
      </p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Rollback and Environment
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Know how your team rolls back: redeploy previous build, feature flags, or revert commit and re-run pipeline. Use environment variables for API URLs and keys; never commit secrets. Use <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm">.env</code> locally and platform env (Netlify, Vercel) in CI.
      </p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Interview Answer
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        &quot;CI/CD automates build, test, and deployment so we release safely without manual steps. On push we run build and tests; if they pass we deploy. I&apos;ve used Netlify/Vercel for frontend — they build and publish the dist folder. I use env vars for config and never commit secrets.&quot;
      </p>
    </div>
  )
}
