import { useNavigate } from 'react-router-dom'
import { useSubjects } from '../hooks/useSubjects'
import { useSubject } from '../contexts/SubjectContext'
import { LoadingScreen } from '../components/LoadingScreen'

export function SubjectsPage() {
  const { subjects, loading } = useSubjects()
  const { setCurrentSubjectId } = useSubject()
  const navigate = useNavigate()

  const handleSubjectSelect = (subjectId: string) => {
    setCurrentSubjectId(subjectId)
    navigate('/')
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-400 dark:via-purple-400 dark:to-indigo-400">
          Choose Your Subject
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Select a subject to begin your learning journey
        </p>
      </div>

      {subjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No subjects available yet.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Contact your administrator to add subjects.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => handleSubjectSelect(subject.id)}
              className="group relative p-8 bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-105 hover:border-violet-500/50 dark:hover:border-violet-400/50"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 flex items-center justify-center text-5xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-2xl group-hover:scale-110 transition-transform">
                    {subject.icon}
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {subject.name}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
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
          ))}
        </div>
      )}
    </div>
  )
}
