import { collection, getDocs, query, where, getDoc, doc } from 'firebase/firestore'
import { getFirestoreDb } from './firebase'
import type { Category } from '../types/firestore'

/**
 * Find categories with parentId that doesn't exist (orphaned)
 */
export async function findOrphanedCategories(): Promise<Category[]> {
  const db = getFirestoreDb()
  const categoriesSnapshot = await getDocs(collection(db, 'categories'))
  
  const orphaned: Category[] = []
  
  for (const categoryDoc of categoriesSnapshot.docs) {
    const category = { id: categoryDoc.id, ...categoryDoc.data() } as Category
    
    if (category.parentId) {
      const parentDoc = await getDoc(doc(db, 'categories', category.parentId))
      if (!parentDoc.exists()) {
        orphaned.push(category)
      }
    }
  }
  
  return orphaned
}

/**
 * Detect circular references in category tree
 * Returns array of category IDs involved in cycles
 */
export async function detectCircularReferences(): Promise<string[]> {
  const db = getFirestoreDb()
  const categoriesSnapshot = await getDocs(collection(db, 'categories'))
  
  const categories = categoriesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Category[]
  
  const circularIds: string[] = []
  const visited = new Set<string>()
  const recursionStack = new Set<string>()
  
  function hasCycle(categoryId: string): boolean {
    if (recursionStack.has(categoryId)) {
      return true
    }
    
    if (visited.has(categoryId)) {
      return false
    }
    
    visited.add(categoryId)
    recursionStack.add(categoryId)
    
    const category = categories.find(c => c.id === categoryId)
    if (category?.parentId) {
      if (hasCycle(category.parentId)) {
        circularIds.push(categoryId)
        recursionStack.delete(categoryId)
        return true
      }
    }
    
    recursionStack.delete(categoryId)
    return false
  }
  
  for (const category of categories) {
    if (!visited.has(category.id)) {
      hasCycle(category.id)
    }
  }
  
  return Array.from(new Set(circularIds))
}

/**
 * Validate depth and path consistency for all categories
 */
export async function validateCategoryPaths(): Promise<{ valid: boolean; errors: string[] }> {
  const db = getFirestoreDb()
  const categoriesSnapshot = await getDocs(collection(db, 'categories'))
  
  const errors: string[] = []
  
  for (const categoryDoc of categoriesSnapshot.docs) {
    const category = { id: categoryDoc.id, ...categoryDoc.data() } as Category
    
    // Check root category
    if (!category.parentId) {
      if (category.depth !== 0) {
        errors.push(`${category.name} (${category.id}): Root category has depth ${category.depth}, expected 0`)
      }
      if (category.path.length !== 0) {
        errors.push(`${category.name} (${category.id}): Root category has non-empty path`)
      }
      continue
    }
    
    // Check child category
    if (category.depth !== category.path.length) {
      errors.push(
        `${category.name} (${category.id}): Depth ${category.depth} doesn't match path length ${category.path.length}`
      )
    }
    
    // Verify path contains valid ancestors
    for (let i = 0; i < category.path.length; i++) {
      const ancestorId = category.path[i]
      const ancestorDoc = await getDoc(doc(db, 'categories', ancestorId))
      
      if (!ancestorDoc.exists()) {
        errors.push(
          `${category.name} (${category.id}): Path contains non-existent ancestor ${ancestorId} at index ${i}`
        )
      }
    }
    
    // Verify last element of path is parent
    if (category.path.length > 0) {
      const lastPathId = category.path[category.path.length - 1]
      if (lastPathId !== category.parentId) {
        errors.push(
          `${category.name} (${category.id}): Last path element ${lastPathId} doesn't match parentId ${category.parentId}`
        )
      }
    } else if (category.parentId) {
      errors.push(
        `${category.name} (${category.id}): Has parentId ${category.parentId} but empty path`
      )
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Find categories exceeding max depth
 */
export async function findExcessiveDepth(maxDepth: number = 50): Promise<Category[]> {
  const db = getFirestoreDb()
  const categoriesSnapshot = await getDocs(collection(db, 'categories'))
  
  const excessive: Category[] = []
  
  for (const categoryDoc of categoriesSnapshot.docs) {
    const category = { id: categoryDoc.id, ...categoryDoc.data() } as Category
    
    if (category.depth > maxDepth) {
      excessive.push(category)
    }
  }
  
  return excessive
}

/**
 * Get statistics about the category tree
 */
export async function getCategoryStatistics() {
  const db = getFirestoreDb()
  const categoriesSnapshot = await getDocs(collection(db, 'categories'))
  
  const categories = categoriesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Category[]
  
  const rootCategories = categories.filter(c => !c.parentId)
  const leafCategories = categories.filter(c => c.isLeaf)
  const containerCategories = categories.filter(c => !c.isLeaf)
  
  const depths = categories.map(c => c.depth)
  const maxDepth = depths.length > 0 ? Math.max(...depths) : 0
  const avgDepth = depths.length > 0 ? depths.reduce((a, b) => a + b, 0) / depths.length : 0
  
  return {
    totalCategories: categories.length,
    rootCategories: rootCategories.length,
    leafCategories: leafCategories.length,
    containerCategories: containerCategories.length,
    maxDepth,
    avgDepth: Math.round(avgDepth * 10) / 10,
  }
}

/**
 * Run all validation checks
 */
export async function runAllValidations() {
  const [orphaned, circular, pathValidation, excessive, stats] = await Promise.all([
    findOrphanedCategories(),
    detectCircularReferences(),
    validateCategoryPaths(),
    findExcessiveDepth(50),
    getCategoryStatistics(),
  ])
  
  return {
    orphaned,
    circular,
    pathValidation,
    excessive,
    stats,
    hasIssues: orphaned.length > 0 || circular.length > 0 || !pathValidation.valid || excessive.length > 0,
  }
}
