import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { getFirestoreDb } from '../lib/firebase'
import type { ExamQuestion } from '../types/firestore'

/**
 * Real-time list of exam questions for a leaf category
 */
export function useExamQuestions(categoryId: string | null) {
  const [questions, setQuestions] = useState<ExamQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!categoryId) {
      setQuestions([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const q = query(
      collection(getFirestoreDb(), 'exam_questions'),
      where('categoryId', '==', categoryId),
      orderBy('order', 'asc')
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => {
          const raw = d.data()
          return {
            ...raw,
            id: d.id,
            options: raw.options ?? [],
            createdAt: raw.createdAt?.toDate?.(),
            updatedAt: raw.updatedAt?.toDate?.(),
          }
        }) as ExamQuestion[]
        setQuestions(data)
        setLoading(false)
      },
      (err) => {
        console.error('[useExamQuestions] Error:', err)
        setError(err as Error)
        setQuestions([])
        setLoading(false)
      }
    )

    return unsubscribe
  }, [categoryId])

  return { questions, loading, error }
}

/**
 * Real-time list of all exam questions (for "Exam all" or multi-category exam)
 */
export function useAllExamQuestions() {
  const [questions, setQuestions] = useState<ExamQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    const q = collection(getFirestoreDb(), 'exam_questions')
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => {
          const raw = d.data()
          return {
            ...raw,
            id: d.id,
            options: raw.options ?? [],
            createdAt: raw.createdAt?.toDate?.(),
            updatedAt: raw.updatedAt?.toDate?.(),
          }
        }) as ExamQuestion[]
        setQuestions(data)
        setLoading(false)
      },
      (err) => {
        console.error('[useAllExamQuestions] Error:', err)
        setError(err as Error)
        setQuestions([])
        setLoading(false)
      }
    )
    return unsubscribe
  }, [])

  return { questions, loading, error }
}
