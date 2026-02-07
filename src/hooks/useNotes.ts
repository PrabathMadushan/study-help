import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, onSnapshot, doc } from 'firebase/firestore'
import { getFirestoreDb } from '../lib/firebase'
import type { Note } from '../types/firestore'

/**
 * Hook to get notes by categoryId
 */
export function useNotes(categoryId: string | null) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!categoryId) {
      setNotes([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const q = query(
      collection(getFirestoreDb(), 'notes'),
      where('categoryId', '==', categoryId),
      orderBy('order', 'asc')
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Note[]

        setNotes(data)
        setLoading(false)
      },
      (err) => {
        console.error('[useNotes] Error fetching notes:', err)
        setError(err as Error)
        setNotes([])
        setLoading(false)
      }
    )

    return unsubscribe
  }, [categoryId])

  return { notes, loading, error }
}

/**
 * Hook to get a single note by ID
 */
export function useNote(noteId: string | null) {
  const [note, setNote] = useState<Note | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!noteId) {
      setNote(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const unsubscribe = onSnapshot(
      doc(getFirestoreDb(), 'notes', noteId),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = {
            ...snapshot.data(),
            id: snapshot.id,
            createdAt: snapshot.data().createdAt?.toDate(),
            updatedAt: snapshot.data().updatedAt?.toDate(),
          } as Note
          setNote(data)
        } else {
          setNote(null)
        }
        setLoading(false)
      },
      (err) => {
        console.error('[useNote] Error fetching note:', err)
        setError(err as Error)
        setNote(null)
        setLoading(false)
      }
    )

    return unsubscribe
  }, [noteId])

  return { note, loading, error }
}
