import { CodeBlock } from '../../components/CodeBlock'

export default function StarMethod() {
  return (
    <div className="note-body space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        What is the STAR Method?
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        STAR is a structure for answering behavioral interview questions: <strong>S</strong>ituation, <strong>T</strong>ask, <strong>A</strong>ction, <strong>R</strong>esult. It keeps your answer focused, concrete, and easy to follow — and shows you can reflect on real experiences.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        The Four Parts
      </h3>
      <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
        <li><strong>Situation:</strong> 1–2 sentences of context. When, where, who was involved, and what was the challenge or opportunity?</li>
        <li><strong>Task:</strong> Your goal or responsibility. What were you supposed to achieve or own?</li>
        <li><strong>Action:</strong> What you did, step by step. Use &quot;I&quot; — your decisions, your code, your communication. Be specific.</li>
        <li><strong>Result:</strong> Impact, metric, or lesson. Quantify when possible (e.g. &quot;reduced load time by 20%&quot;, &quot;shipped on time&quot;, &quot;team adopted the pattern&quot;).</li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Example Outline (Conflict / Disagreement)
      </h3>
      <CodeBlock
        code={`S: "On my last project, we had a disagreement about whether
to use Redux or Context for global state — half the team
wanted Redux, half wanted to keep it simple with Context."

T: "My task was to help us make a decision and keep the
timeline on track."

A: "I set up a short spike: I built a small proof-of-concept
with both approaches, compared bundle size and DX, and
presented the tradeoffs. I suggested we use Context for
auth/theme and keep Redux for the complex checkout flow.
I documented the decision in the ADR."

R: "We agreed on the hybrid approach and shipped the
feature on time. The team still uses that pattern for
new features."`}
      />

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Tips for Strong STAR Answers
      </h3>
      <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
        <li>Keep <strong>Situation</strong> short — just enough context. Don&apos;t ramble.</li>
        <li>In <strong>Action</strong>, focus on <strong>what you did</strong>, not what the team did. Use &quot;I proposed&quot;, &quot;I implemented&quot;, &quot;I debugged&quot;.</li>
        <li>End with a clear <strong>Result</strong>: number, outcome, or takeaway. &quot;As a result, we…&quot; or &quot;In the end, I learned…&quot;</li>
        <li>Prepare 3–5 stories that cover: conflict, failure/mistake, leadership/ownership, tight deadline, learning something new. Reuse and adapt them for different questions.</li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Common Behavioral Questions (Use STAR)
      </h3>
      <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
        <li>Tell me about a time you disagreed with a teammate or manager.</li>
        <li>Describe a project that failed or didn&apos;t go as planned. What did you do?</li>
        <li>Tell me about a time you had to learn something new quickly.</li>
        <li>Describe a situation where you had to meet a tight deadline.</li>
        <li>Tell me about a time you took ownership of something without being asked.</li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Interview Answer (How to Describe STAR)
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        &quot;I structure my answers with STAR: I give a brief situation and my task, then walk through the specific actions I took — what I did, not the team — and end with the result, ideally with a metric or clear outcome. I prepare a few stories in advance so I can adapt them to questions about conflict, failure, learning, or ownership.&quot;
      </p>
    </div>
  )
}
