import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, onSnapshot, doc } from 'firebase/firestore'
import { getFirestoreDb } from '../lib/firebase'
import type { Category } from '../types/firestore'

/**
 * Hook to get categories by parentId
 * @param parentId - Parent category ID, null for root categories
 */
export function useCategories(parentId: string | null = null) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    const q = query(
      collection(getFirestoreDb(), 'categories'),
      where('parentId', '==', parentId),
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
      (err) => {
        console.error('[useCategories] Error fetching categories:', err)
        setError(err as Error)
        setCategories([])
        setLoading(false)
      }
    )

    return unsubscribe
  }, [parentId])

  return { categories, loading, error }
}

/**
 * Hook to get a single category by ID
 */
export function useCategory(categoryId: string | null) {
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!categoryId) {
      setCategory(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const unsubscribe = onSnapshot(
      doc(getFirestoreDb(), 'categories', categoryId),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = {
            ...snapshot.data(),
            id: snapshot.id,
            createdAt: snapshot.data().createdAt?.toDate(),
            updatedAt: snapshot.data().updatedAt?.toDate(),
          } as Category
          setCategory(data)
        } else {
          setCategory(null)
        }
        setLoading(false)
      },
      (err) => {
        console.error('[useCategory] Error fetching category:', err)
        setError(err as Error)
        setCategory(null)
        setLoading(false)
      }
    )

    return unsubscribe
  }, [categoryId])

  return { category, loading, error }
}
