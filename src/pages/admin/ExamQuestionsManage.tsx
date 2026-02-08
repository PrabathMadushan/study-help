import { useState } from 'react'
import { useExamQuestions } from '../../hooks/useExamQuestions'
import { createExamQuestion, updateExamQuestion, deleteExamQuestion } from '../../lib/admin'
import { LoadingSpinner } from '../../components/LoadingScreen'
import { CategorySelector } from '../../components/CategorySelector'
import type { ExamQuestion, ExamQuestionType } from '../../types/firestore'

const defaultForm = {
  question: '',
  type: 'short' as ExamQuestionType,
  options: [] as string[],
  correctAnswer: '',
  order: 0,
}

export function ExamQuestionsManage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const { questions, loading: questionsLoading } = useExamQuestions(selectedCategoryId)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState(defaultForm)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategoryId) {
      alert('Please select a category first')
      return
    }
    try {
      const payload = {
        question: formData.question.trim(),
        type: formData.type,
        options: formData.type === 'mcq' ? formData.options.filter(Boolean) : [],
        correctAnswer: formData.correctAnswer.trim(),
        order: formData.order,
      }
      if (editingId) {
        await updateExamQuestion(editingId, payload)
        setEditingId(null)
      } else {
        await createExamQuestion({
          ...payload,
          categoryId: selectedCategoryId,
        })
      }
      setFormData(defaultForm)
      setIsCreating(false)
    } catch (error) {
      console.error('Error saving exam question:', error)
      alert('Error saving: ' + (error as Error).message)
    }
  }

  const handleEdit = (q: ExamQuestion) => {
    setFormData({
      question: q.question,
      type: q.type,
      options: q.options ?? [],
      correctAnswer: q.correctAnswer,
      order: q.order,
    })
    setEditingId(q.id)
    setIsCreating(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this exam question?')) return
    try {
      await deleteExamQuestion(id)
    } catch (error) {
      console.error('Error deleting:', error)
      alert('Error: ' + (error as Error).message)
    }
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingId(null)
    setFormData(defaultForm)
  }

  const addOption = () => setFormData({ ...formData, options: [...formData.options, ''] })
  const setOption = (index: number, value: string) => {
    const next = [...formData.options]
    next[index] = value
    setFormData({ ...formData, options: next })
  }
  const removeOption = (index: number) => {
    setFormData({ ...formData, options: formData.options.filter((_, i) => i !== index) })
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Manage Exam Questions
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Add exam questions (MCQ or short answer) per leaf category.
        </p>
      </div>

      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Leaf Category
        </label>
        <CategorySelector
          value={selectedCategoryId}
          onChange={setSelectedCategoryId}
          filterLeafOnly={true}
        />
      </div>

      {selectedCategoryId && (
        <>
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Exam Questions in Category
              </h2>
              {!isCreating && (
                <button
                  onClick={() => setIsCreating(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + Add Question
                </button>
              )}
            </div>

            {questionsLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No exam questions yet.
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((q) => (
                  <div
                    key={q.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">{q.question}</p>
                        <p className="text-xs text-gray-500 mb-1">Type: {q.type}</p>
                        {q.type === 'mcq' && q.options?.length ? (
                          <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                            {q.options.map((opt, i) => (
                              <li key={i}>{opt}{opt === q.correctAnswer ? ' ✓' : ''}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-600 dark:text-gray-400">Answer: {q.correctAnswer}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">Order: {q.order}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleEdit(q)}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {isCreating && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {editingId ? 'Edit Question' : 'New Exam Question'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Question *</label>
                  <input
                    type="text"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as ExamQuestionType })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="short">Short answer</option>
                    <option value="mcq">Multiple choice (MCQ)</option>
                  </select>
                </div>
                {formData.type === 'mcq' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Options (one per line, one must match correct answer)</label>
                    {formData.options.map((opt, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => setOption(i, e.target.value)}
                          placeholder={`Option ${i + 1}`}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                        />
                        <button type="button" onClick={() => removeOption(i)} className="px-2 py-1 text-red-600">Remove</button>
                      </div>
                    ))}
                    <button type="button" onClick={addOption} className="text-sm text-blue-600 dark:text-blue-400">+ Add option</button>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Correct answer *</label>
                  <input
                    type="text"
                    value={formData.correctAnswer}
                    onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    {editingId ? 'Update' : 'Create'}
                  </button>
                  <button type="button" onClick={handleCancel} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}

      {!selectedCategoryId && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">Select a leaf category to manage exam questions.</p>
        </div>
      )}
    </div>
  )
}
