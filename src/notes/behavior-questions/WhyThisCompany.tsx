import { CodeBlock } from '../../components/CodeBlock'

export default function WhyThisCompany() {
  return (
    <div className="note-body space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Why &quot;Why This Company?&quot; Matters
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Interviewers ask this to see if you&apos;ve done your homework and whether you&apos;re a fit for their mission, product, and culture. A generic answer hurts; a specific one shows genuine interest and helps you stand out.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        What to Research Before the Interview
      </h3>
      <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
        <li><strong>Mission and product:</strong> What do they build? Who are the users? What problem do they solve?</li>
        <li><strong>Recent news:</strong> Launches, funding, acquisitions, blog posts, tech blog.</li>
        <li><strong>Tech stack and engineering:</strong> What do they use? Do they have open source, engineering blog, or talks?</li>
        <li><strong>Values and culture:</strong> Stated values, diversity, remote/hybrid, growth.</li>
        <li><strong>Role-specific:</strong> Team focus, projects you might work on, who you&apos;d work with.</li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        How to Structure Your Answer
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Tie <strong>their</strong> work to <strong>your</strong> skills and goals. Be specific: name a product, a project, a value, or a tech choice. Show you&apos;ve thought about why <em>this</em> company, not just &quot;any good company.&quot;
      </p>
      <CodeBlock
        code={`// Weak: generic
"I want to work at a company that values innovation
and has great people."

// Strong: specific
"I've been following your work on [product/feature].
I care a lot about [accessibility/performance/scale],
and I saw your engineering blog post on [topic] — that
aligns with what I want to grow in. I'd like to
contribute to [team/product] and learn from how you
[technical or process detail]."`}
      />

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        What to Mention (Pick 1–2)
      </h3>
      <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
        <li><strong>Product:</strong> &quot;I use your product / I tried the demo and was impressed by…&quot;</li>
        <li><strong>Tech:</strong> &quot;Your stack (React, TypeScript, …) matches what I want to deepen.&quot;</li>
        <li><strong>Impact:</strong> &quot;The scale / the problem you solve (e.g. accessibility, performance) matters to me.&quot;</li>
        <li><strong>Culture:</strong> &quot;Your focus on [learning, ownership, work-life] fits how I like to work.&quot;</li>
        <li><strong>People:</strong> &quot;I talked to [name] or read about the team and I&apos;d like to work with this kind of team.&quot;</li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Follow-Up: &quot;Do You Have Questions for Us?&quot;
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Use this to show interest and learn more. Ask about: day-to-day work, tech decisions, how the team ships, growth and mentorship, or something specific from your research (e.g. &quot;I read about X — how does that work in practice?&quot;).
      </p>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Interview Answer (How to Describe Your Approach)
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        &quot;I research the company&apos;s mission, product, and recent news, and I look at their tech stack and engineering blog. I tie my skills and goals to something specific — a product, a project, or a value — so my answer isn&apos;t generic. I also prepare questions about the role and the team so I can show genuine interest and learn whether we&apos;re a good fit.&quot;
      </p>
    </div>
  )
}
