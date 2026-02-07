import { useState } from 'react'
import { runAllValidations, type Category } from '../../lib/validation'
import { LoadingSpinner } from '../../components/LoadingScreen'

export function ValidationTools() {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleRunValidation = async () => {
    setIsRunning(true)
    try {
      const validationResults = await runAllValidations()
      setResults(validationResults)
    } catch (error) {
      console.error('Error running validation:', error)
      alert('Error running validation: ' + (error as Error).message)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Validation Tools
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Check data integrity and find issues in the category tree structure.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <button
          onClick={handleRunValidation}
          disabled={isRunning}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? 'Running Validation...' : 'Run All Validations'}
        </button>

        {isRunning && (
          <div className="mt-8 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {results && !isRunning && (
          <div className="mt-8 space-y-6">
            {/* Statistics */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                Category Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-blue-800 dark:text-blue-200">Total Categories</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {results.stats.totalCategories}
                  </p>
                </div>
                <div>
                  <p className="text-blue-800 dark:text-blue-200">Root Categories</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {results.stats.rootCategories}
                  </p>
                </div>
                <div>
                  <p className="text-blue-800 dark:text-blue-200">Leaf Categories</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {results.stats.leafCategories}
                  </p>
                </div>
                <div>
                  <p className="text-blue-800 dark:text-blue-200">Container Categories</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {results.stats.containerCategories}
                  </p>
                </div>
                <div>
                  <p className="text-blue-800 dark:text-blue-200">Max Depth</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {results.stats.maxDepth}
                  </p>
                </div>
                <div>
                  <p className="text-blue-800 dark:text-blue-200">Avg Depth</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {results.stats.avgDepth}
                  </p>
                </div>
              </div>
            </div>

            {/* Overall Status */}
            <div
              className={`p-4 rounded-lg ${
                results.hasIssues
                  ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                  : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              }`}
            >
              <h3
                className={`font-semibold mb-2 ${
                  results.hasIssues
                    ? 'text-red-900 dark:text-red-100'
                    : 'text-green-900 dark:text-green-100'
                }`}
              >
                {results.hasIssues ? 'Issues Found' : 'All Checks Passed'}
              </h3>
              <p
                className={
                  results.hasIssues
                    ? 'text-red-800 dark:text-red-200'
                    : 'text-green-800 dark:text-green-200'
                }
              >
                {results.hasIssues
                  ? 'Data integrity issues detected. Review details below.'
                  : 'Your category tree structure is valid and consistent.'}
              </p>
            </div>

            {/* Orphaned Categories */}
            {results.orphaned.length > 0 && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  Orphaned Categories ({results.orphaned.length})
                </h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
                  Categories with non-existent parent IDs
                </p>
                <ul className="space-y-2">
                  {results.orphaned.map((cat: Category) => (
                    <li
                      key={cat.id}
                      className="text-sm text-yellow-900 dark:text-yellow-100 font-mono bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded"
                    >
                      {cat.name} (ID: {cat.id}, Parent: {cat.parentId})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Circular References */}
            {results.circular.length > 0 && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                  Circular References ({results.circular.length})
                </h3>
                <p className="text-sm text-red-800 dark:text-red-200 mb-3">
                  Categories involved in circular parent-child relationships
                </p>
                <ul className="space-y-2">
                  {results.circular.map((id: string) => (
                    <li
                      key={id}
                      className="text-sm text-red-900 dark:text-red-100 font-mono bg-red-100 dark:bg-red-900/30 p-2 rounded"
                    >
                      Category ID: {id}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Path Validation Errors */}
            {!results.pathValidation.valid && (
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                  Path Validation Errors ({results.pathValidation.errors.length})
                </h3>
                <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">
                  Inconsistencies in depth and path arrays
                </p>
                <ul className="space-y-2 max-h-96 overflow-y-auto">
                  {results.pathValidation.errors.map((error: string, idx: number) => (
                    <li
                      key={idx}
                      className="text-sm text-orange-900 dark:text-orange-100 font-mono bg-orange-100 dark:bg-orange-900/30 p-2 rounded"
                    >
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Excessive Depth */}
            {results.excessive.length > 0 && (
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                  Excessive Depth ({results.excessive.length})
                </h3>
                <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">
                  Categories exceeding max depth limit (50)
                </p>
                <ul className="space-y-2">
                  {results.excessive.map((cat: Category) => (
                    <li
                      key={cat.id}
                      className="text-sm text-purple-900 dark:text-purple-100 font-mono bg-purple-100 dark:bg-purple-900/30 p-2 rounded"
                    >
                      {cat.name} (Depth: {cat.depth})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
