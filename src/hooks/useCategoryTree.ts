import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { getFirestoreDb } from '../lib/firebase'
import type { Category } from '../types/firestore'

export interface CategoryTree extends Category {
  children: CategoryTree[]
}

/**
 * Hook to get hierarchical category tree
 * @param rootId - Root category ID to start from, null for all root categories
 * @param maxDepth - Maximum depth to load (0 = unlimited)
 */
export function useCategoryTree(rootId: string | null = null, maxDepth: number = 0) {
  const [tree, setTree] = useState<CategoryTree[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadTree() {
      setLoading(true)
      setError(null)

      try {
        const categories = await loadCategoryTreeRecursive(rootId, 0, maxDepth)
        
        if (isMounted) {
          setTree(categories)
          setLoading(false)
        }
      } catch (err) {
        console.error('[useCategoryTree] Error loading tree:', err)
        if (isMounted) {
          setError(err as Error)
          setTree([])
          setLoading(false)
        }
      }
    }

    loadTree()

    return () => {
      isMounted = false
    }
  }, [rootId, maxDepth])

  return { tree, loading, error }
}

/**
 * Recursive function to load category tree
 */
async function loadCategoryTreeRecursive(
  parentId: string | null,
  currentDepth: number,
  maxDepth: number
): Promise<CategoryTree[]> {
  const db = getFirestoreDb()
  
  // Get categories at this level
  const q = query(
    collection(db, 'categories'),
    where('parentId', '==', parentId),
    orderBy('order', 'asc')
  )

  const snapshot = await getDocs(q)
  const categories = snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Category[]

  // Recursively load children if not at max depth
  const shouldLoadChildren = maxDepth === 0 || currentDepth < maxDepth
  
  const treeNodes: CategoryTree[] = await Promise.all(
    categories.map(async (category) => {
      let children: CategoryTree[] = []
      
      if (shouldLoadChildren && !category.isLeaf) {
        children = await loadCategoryTreeRecursive(category.id, currentDepth + 1, maxDepth)
      }
      
      return {
        ...category,
        children,
      }
    })
  )

  return treeNodes
}
