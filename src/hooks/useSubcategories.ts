import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { getFirestoreDb } from '../lib/firebase'
import type { Subcategory } from '../types/firestore'

export function useSubcategories(categoryId?: string | null) {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!categoryId) {
      setSubcategories([])
      setLoading(false)
      return
    }

    const q = query(
      collection(getFirestoreDb(), 'subcategories'),
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
        })) as Subcategory[]

        setSubcategories(data)
        setLoading(false)
      },
      (error) => {
        console.error('Error fetching subcategories:', error)
        setSubcategories([])
        setLoading(false)
      }
    )

    return unsubscribe
  }, [categoryId])

  return { subcategories, loading }
}
