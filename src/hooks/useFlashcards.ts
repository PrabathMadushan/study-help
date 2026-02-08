import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { getFirestoreDb } from '../lib/firebase'
import type { Flashcard } from '../types/firestore'

/**
 * Real-time list of flashcards for a leaf category
 */
export function useFlashcards(categoryId: string | null) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!categoryId) {
      setFlashcards([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const q = query(
      collection(getFirestoreDb(), 'flashcards'),
      where('categoryId', '==', categoryId),
      orderBy('order', 'asc')
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          ...d.data(),
          id: d.id,
          createdAt: d.data().createdAt?.toDate?.(),
          updatedAt: d.data().updatedAt?.toDate?.(),
        })) as Flashcard[]
        setFlashcards(data)
        setLoading(false)
      },
      (err) => {
        console.error('[useFlashcards] Error:', err)
        setError(err as Error)
        setFlashcards([])
        setLoading(false)
      }
    )

    return unsubscribe
  }, [categoryId])

  return { flashcards, loading, error }
}

/**
 * Real-time list of all flashcards (for "Practice all" deck)
 */
export function useAllFlashcards() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    const q = collection(getFirestoreDb(), 'flashcards')
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          ...d.data(),
          id: d.id,
          createdAt: d.data().createdAt?.toDate?.(),
          updatedAt: d.data().updatedAt?.toDate?.(),
        })) as Flashcard[]
        setFlashcards(data)
        setLoading(false)
      },
      (err) => {
        console.error('[useAllFlashcards] Error:', err)
        setError(err as Error)
        setFlashcards([])
        setLoading(false)
      }
    )
    return unsubscribe
  }, [])

  return { flashcards, loading, error }
}
