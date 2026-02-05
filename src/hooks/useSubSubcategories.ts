import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { getFirestoreDb } from '../lib/firebase'
import type { SubSubcategory } from '../types/firestore'

export function useSubSubcategories(subcategoryId?: string | null) {
  const [subSubcategories, setSubSubcategories] = useState<SubSubcategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!subcategoryId) {
      setSubSubcategories([])
      setLoading(false)
      return
    }

    const q = query(
      collection(getFirestoreDb(), 'subSubcategories'),
      where('subcategoryId', '==', subcategoryId),
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
        })) as SubSubcategory[]

        setSubSubcategories(data)
        setLoading(false)
      },
      (error) => {
        console.error('Error fetching sub-subcategories:', error)
        setSubSubcategories([])
        setLoading(false)
      }
    )

    return unsubscribe
  }, [subcategoryId])

  return { subSubcategories, loading }
}
