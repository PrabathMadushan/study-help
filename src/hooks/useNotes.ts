import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, onSnapshot, doc } from 'firebase/firestore'
import { getFirestoreDb } from '../lib/firebase'
import type { Note } from '../types/firestore'

export function useNotes(parentId?: string | null, parentType?: 'category' | 'subcategory' | 'subSubcategory') {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!parentId || !parentType) {
      setNotes([])
      setLoading(false)
      return
    }

    const fieldName = parentType === 'category' ? 'categoryId' 
      : parentType === 'subcategory' ? 'subcategoryId' 
      : 'subSubcategoryId'

    const q = query(
      collection(getFirestoreDb(), 'notes'),
      where(fieldName, '==', parentId),
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
      (error) => {
        console.error('Error fetching notes:', error)
        setNotes([])
        setLoading(false)
      }
    )

    return unsubscribe
  }, [parentId, parentType])

  return { notes, loading }
}

export function useNote(noteId?: string | null) {
  const [note, setNote] = useState<Note | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!noteId) {
      setNote(null)
      setLoading(false)
      return
    }

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
      (error) => {
        console.error('Error fetching note:', error)
        setNote(null)
        setLoading(false)
      }
    )

    return unsubscribe
  }, [noteId])

  return { note, loading }
}
