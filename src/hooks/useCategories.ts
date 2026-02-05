import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { getFirestoreDb } from '../lib/firebase'
import type { Category } from '../types/firestore'

export function useCategories(subjectId?: string | null) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!subjectId) {
      setCategories([])
      setLoading(false)
      return
    }

    const q = query(
      collection(getFirestoreDb(), 'categories'),
      where('subjectId', '==', subjectId),
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
        })) as Category[]

        setCategories(data)
        setLoading(false)
      },
      (error) => {
        console.error('Error fetching categories:', error)
        setCategories([])
        setLoading(false)
      }
    )

    return unsubscribe
  }, [subjectId])

  return { categories, loading }
}
