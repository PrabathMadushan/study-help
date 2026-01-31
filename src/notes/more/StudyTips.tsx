import { CodeBlock } from '../../components/CodeBlock'

export default function StudyTips() {
  return (
    <div className="note-body space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Why Study Tips Matter for Interviews
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Interview prep is a mix of concepts, practice, and retention. Spaced repetition helps long-term retention; taking notes in your own words and explaining out loud deepens understanding. Use this app to track progress and revisit incomplete notes.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Spaced Repetition
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Revisit material at increasing intervals (e.g. 1 day, 3 days, 1 week). It strengthens memory and surfaces gaps. In this app, mark notes as complete and come back to them later — the progress bar helps you see what you&apos;ve covered and what to review.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Take Notes in Your Own Words
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Don&apos;t just copy. Summarize and rephrase. It forces you to understand and makes recall easier. When you can explain a concept in one or two sentences (like the &quot;Interview Answer&quot; sections in these notes), you&apos;re ready to say it in an interview.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Practice Explaining Out Loud
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Saying an answer out loud is different from reading it. Practice the &quot;Interview Answer&quot; one-liners and STAR stories out loud. Record yourself or practice with a friend. It reduces nerves and makes your answers sound natural.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Interview Prep Checklist
      </h3>
      <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
        <li><strong>Concepts:</strong> Go through each category (Front end, Back-end, DevOps, Design Patterns, Data Structures, Algorithms). Mark notes complete when you can explain the main idea.</li>
        <li><strong>Coding:</strong> Practice a few problems per topic (arrays, hash maps, binary search, linked lists). Focus on clarity and talking through your approach.</li>
        <li><strong>Behavioral:</strong> Prepare 3–5 STAR stories. Practice &quot;Why this company?&quot; with specific research for each target company.</li>
        <li><strong>System design (if applicable):</strong> Review basics (APIs, auth, scaling, caching) and practice sketching a simple system on a whiteboard or doc.</li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        How to Use This App
      </h3>
      <CodeBlock
        code={`1. Start with one category (e.g. Front end → React).
2. Read each note and try to explain the "Interview Answer"
   in your own words before reading it.
3. Mark the note complete when you're comfortable.
4. Revisit incomplete or older notes on a schedule
   (e.g. every 3 days) for spaced repetition.
5. Before an interview, skim all "Interview Answer"
   sections and run through your STAR stories.`}
      />

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        One-Liner Recap
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        &quot;I use spaced repetition to revisit material, take notes in my own words to deepen understanding, and practice explaining out loud so I can deliver clear answers in interviews. I track progress with this app and focus on the Interview Answer sections and STAR stories before each interview.&quot;
      </p>
    </div>
  )
}
