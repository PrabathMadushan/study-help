import type { Subject } from '../types/firestore'

type SubjectCardProps = {
  subject: Subject
  onClick: () => void
}

export function SubjectCard({ subject, onClick }: SubjectCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative p-8 bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-105 hover:border-violet-500/50 dark:hover:border-violet-400/50 w-full text-left"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 flex items-center justify-center text-5xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-2xl group-hover:scale-110 transition-transform">
            {subject.icon}
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
          {subject.name}
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-center">
          {subject.description}
        </p>

        <div className="mt-6 flex items-center justify-center text-sm font-medium text-violet-600 dark:text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Start Learning</span>
          <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  )
}
