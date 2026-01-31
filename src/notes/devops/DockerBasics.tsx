import { CodeBlock } from '../../components/CodeBlock'

export default function DockerBasics() {
  return (
    <div className="note-body space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        What is Docker? (Interview One-Liner)
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Docker packages an app and its dependencies into a <strong>container</strong> — a lightweight, runnable unit. Containers run consistently across dev, CI, and production. <strong>Image</strong> = blueprint; <strong>container</strong> = running instance of that image.
      </p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Why Use It? (Frontend Angle)
      </h3>
      <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
        <li><strong>Local parity:</strong> Same Node/npm version and env as CI/production.</li>
        <li><strong>Deployment:</strong> Some teams run the built frontend in a container and serve it with nginx.</li>
        <li><strong>Full-stack:</strong> Run frontend, API, and DB in containers with docker-compose for local dev.</li>
      </ul>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Dockerfile Basics
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A Dockerfile defines how to build an image: base image, copy files, run commands (e.g. npm install, npm run build). You don&apos;t need to write one for a frontend-only role, but knowing the idea helps.
      </p>
      <CodeBlock
        code={`# Minimal example (conceptual)
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
# Serve with nginx or run node`}
      />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Interview Answer
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        &quot;Docker packages the app and dependencies into containers so they run the same everywhere. Images are built from a Dockerfile; containers are running instances. I&apos;ve used it for local parity and seen it used for deployment. I understand the concept even if I haven&apos;t written Dockerfiles daily.&quot;
      </p>
    </div>
  )
}
