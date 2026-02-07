import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { getFirestoreDb } from '../lib/firebase'
import type { Category } from '../types/firestore'

/**
 * Hook to get the breadcrumb path from root to a category
 * Returns array of categories from root to target
 */
export function useCategoryPath(categoryId: string | null) {
  const [path, setPath] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!categoryId) {
      setPath([])
      setLoading(false)
      return
    }

    let isMounted = true

    async function loadPath() {
      setLoading(true)
      setError(null)

      try {
        const db = getFirestoreDb()
        
        // Get the target category
        const categoryDoc = await getDoc(doc(db, 'categories', categoryId))
        
        if (!categoryDoc.exists()) {
          if (isMounted) {
            setPath([])
            setLoading(false)
          }
          return
        }

        const category = {
          ...categoryDoc.data(),
          id: categoryDoc.id,
          createdAt: categoryDoc.data().createdAt?.toDate(),
          updatedAt: categoryDoc.data().updatedAt?.toDate(),
        } as Category

        // Load all ancestors from the path array
        const ancestors: Category[] = []
        
        if (category.path && category.path.length > 0) {
          for (const ancestorId of category.path) {
            const ancestorDoc = await getDoc(doc(db, 'categories', ancestorId))
            if (ancestorDoc.exists()) {
              ancestors.push({
                ...ancestorDoc.data(),
                id: ancestorDoc.id,
                createdAt: ancestorDoc.data().createdAt?.toDate(),
                updatedAt: ancestorDoc.data().updatedAt?.toDate(),
              } as Category)
            }
          }
        }

        // Full path is ancestors + current category
        const fullPath = [...ancestors, category]

        if (isMounted) {
          setPath(fullPath)
          setLoading(false)
        }
      } catch (err) {
        console.error('[useCategoryPath] Error loading path:', err)
        if (isMounted) {
          setError(err as Error)
          setPath([])
          setLoading(false)
        }
      }
    }

    loadPath()

    return () => {
      isMounted = false
    }
  }, [categoryId])

  return { path, loading, error }
}

/**
 * Hook to get breadcrumb labels (just names)
 */
export function useCategoryBreadcrumbs(categoryId: string | null) {
  const { path, loading, error } = useCategoryPath(categoryId)

  const breadcrumbs = path.map(cat => ({
    id: cat.id,
    name: cat.name,
    icon: cat.icon,
  }))

  return { breadcrumbs, loading, error }
}
