import { useMemo } from 'react'
import { useCategory } from './useCategories'
import { useCategories } from './useCategories'
import { useNotes } from './useNotes'
import { useRadialLayout } from './useRadialLayout'

/**
 * Hook to manage graph navigation state
 * Loads category data and creates graph layout
 */
export function useGraphNavigation(categoryId: string | null) {
  // Load center category (null for root view)
  const { category: centerCategory, loading: categoryLoading } = useCategory(categoryId)
  
  // Load child categories
  const { categories: childCategories, loading: categoriesLoading } = useCategories(categoryId)
  
  // Load notes if this is a leaf category
  const { notes, loading: notesLoading } = useNotes(
    centerCategory?.isLeaf ? categoryId : null
  )

  // Create radial layout
  const { nodes, edges } = useRadialLayout(
    centerCategory,
    childCategories,
    centerCategory?.isLeaf ? notes : []
  )

  const isLoading = categoryLoading || categoriesLoading || notesLoading

  // Memoize result
  const result = useMemo(
    () => ({
      nodes,
      edges,
      centerCategory,
      childCategories,
      notes: centerCategory?.isLeaf ? notes : [],
      isLoading,
      hasChildren: childCategories.length > 0 || (centerCategory?.isLeaf ? notes.length > 0 : false),
    }),
    [nodes, edges, centerCategory, childCategories, notes, isLoading]
  )

  return result
}
