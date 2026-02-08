import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore'
import { getFirestoreDb } from './firebase'
import type { Category, Note, Flashcard, ExamQuestion } from '../types/firestore'

/**
 * Create a new category with automatic depth and path computation
 */
export async function createCategory(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'depth' | 'path'>): Promise<string> {
  const db = getFirestoreDb()
  const docRef = doc(collection(db, 'categories'))
  
  console.log('[createCategory] Creating category with data:', data)
  
  try {
    // Compute depth and path
    let depth = 0
    let path: string[] = []
    
    if (data.parentId) {
      const parentDoc = await getDoc(doc(db, 'categories', data.parentId))
      if (parentDoc.exists()) {
        const parentData = parentDoc.data() as Category
        depth = parentData.depth + 1
        path = [...parentData.path, parentDoc.id]  // Use parentDoc.id, not parentData.id!
        
        console.log('[createCategory] Parent found, depth:', depth, 'path:', path)
      } else {
        throw new Error(`Parent category ${data.parentId} not found`)
      }
    }
    
    // Clean data - remove undefined values and empty strings
    const cleanData: any = {
      parentId: data.parentId || null,
      name: data.name,
      isLeaf: data.isLeaf,
      order: data.order,
      depth,
      path,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
    
    // Only add optional fields if they have non-empty values
    if (data.description && data.description.trim()) {
      cleanData.description = data.description.trim()
    }
    if (data.icon && data.icon.trim()) {
      cleanData.icon = data.icon.trim()
    }
    if (data.color && data.color.trim()) {
      cleanData.color = data.color.trim()
    }
   
    console.log(docRef.id,cleanData)
    await setDoc(docRef, cleanData)
    
    console.log('[createCategory] Category created successfully with ID:', docRef.id)
    return docRef.id
  } catch (error) {
    console.error('[createCategory] Error creating category:', error)
    throw error
  }
}

/**
 * Update a category (recomputes depth/path if parentId changes)
 */
export async function updateCategory(id: string, data: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'depth' | 'path'>>): Promise<void> {
  const db = getFirestoreDb()
  const docRef = doc(db, 'categories', id)
  
  console.log('[updateCategory] Updating category:', id, 'with data:', data)
  
  try {
    // Clean data - remove undefined values and empty strings
    const cleanData: any = {
      updatedAt: serverTimestamp(),
    }
    
    // Only add fields that have actual non-empty values
    if (data.name !== undefined) cleanData.name = data.name
    if (data.isLeaf !== undefined) cleanData.isLeaf = data.isLeaf
    if (data.order !== undefined) cleanData.order = data.order
    if (data.description !== undefined && data.description && data.description.trim()) {
      cleanData.description = data.description.trim()
    }
    if (data.icon !== undefined && data.icon && data.icon.trim()) {
      cleanData.icon = data.icon.trim()
    }
    if (data.color !== undefined && data.color && data.color.trim()) {
      cleanData.color = data.color.trim()
    }
    
    // If parentId is changing, recompute depth and path
    if (data.parentId !== undefined) {
      let depth = 0
      let path: string[] = []
      
      if (data.parentId) {
        const parentDoc = await getDoc(doc(db, 'categories', data.parentId))
        if (parentDoc.exists()) {
          const parentData = parentDoc.data() as Category
          depth = parentData.depth + 1
          path = [...parentData.path, parentDoc.id]  // Use parentDoc.id, not parentData.id!
        } else {
          throw new Error(`Parent category ${data.parentId} not found`)
        }
      }
      
      cleanData.parentId = data.parentId || null
      cleanData.depth = depth
      cleanData.path = path
      
      console.log('[updateCategory] Parent changed, updated depth and path')
    }
    
    await updateDoc(docRef, cleanData)
    
    console.log('[updateCategory] Category updated successfully')
  } catch (error) {
    console.error('[updateCategory] Error updating category:', error)
    throw error
  }
}

/**
 * Delete a category (with option to cascade delete children)
 */
export async function deleteCategory(id: string, cascade: boolean = false): Promise<void> {
  const db = getFirestoreDb()
  
  console.log('[deleteCategory] Deleting category:', id, 'cascade:', cascade)
  
  try {
    if (cascade) {
      // Get all descendants
      const descendants = await getCategoryDescendants(id)
      
      // Batch delete
      const batch = writeBatch(db)
      batch.delete(doc(db, 'categories', id))
      
      descendants.forEach(descendant => {
        batch.delete(doc(db, 'categories', descendant.id))
      })
      
      await batch.commit()
      console.log('[deleteCategory] Deleted category and', descendants.length, 'descendants')
    } else {
      // Check if has children
      const children = await getCategoryChildren(id)
      if (children.length > 0) {
        throw new Error(`Cannot delete category with ${children.length} children. Use cascade=true to delete all descendants.`)
      }
      
      await deleteDoc(doc(db, 'categories', id))
      console.log('[deleteCategory] Category deleted')
    }
  } catch (error) {
    console.error('[deleteCategory] Error deleting category:', error)
    throw error
  }
}

/**
 * Get direct children of a category
 */
export async function getCategoryChildren(parentId: string | null): Promise<Category[]> {
  const db = getFirestoreDb()
  
  const q = query(
    collection(db, 'categories'),
    where('parentId', '==', parentId),
    orderBy('order', 'asc')
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category))
}

/**
 * Get all descendants of a category (recursive)
 */
export async function getCategoryDescendants(categoryId: string): Promise<Category[]> {
  const children = await getCategoryChildren(categoryId)
  const descendants: Category[] = [...children]
  
  for (const child of children) {
    const childDescendants = await getCategoryDescendants(child.id)
    descendants.push(...childDescendants)
  }
  
  return descendants
}

/**
 * Get ancestors of a category (path to root)
 */
export async function getCategoryAncestors(categoryId: string): Promise<Category[]> {
  const db = getFirestoreDb()
  
  const categoryDoc = await getDoc(doc(db, 'categories', categoryId))
  if (!categoryDoc.exists()) {
    return []
  }
  
  const category = categoryDoc.data() as Category
  if (!category.path || category.path.length === 0) {
    return []
  }
  
  const ancestors: Category[] = []
  for (const ancestorId of category.path) {
    const ancestorDoc = await getDoc(doc(db, 'categories', ancestorId))
    if (ancestorDoc.exists()) {
      ancestors.push({ id: ancestorDoc.id, ...ancestorDoc.data() } as Category)
    }
  }
  
  return ancestors
}

/**
 * Check if a category can be safely deleted
 */
export async function canDeleteCategory(categoryId: string): Promise<{ canDelete: boolean; reason?: string }> {
  const children = await getCategoryChildren(categoryId)
  
  if (children.length > 0) {
    return {
      canDelete: false,
      reason: `Category has ${children.length} child categories`
    }
  }
  
  // Check for notes
  const db = getFirestoreDb()
  const notesQuery = query(
    collection(db, 'notes'),
    where('categoryId', '==', categoryId)
  )
  const notesSnapshot = await getDocs(notesQuery)
  
  if (!notesSnapshot.empty) {
    return {
      canDelete: false,
      reason: `Category has ${notesSnapshot.size} notes`
    }
  }
  
  return { canDelete: true }
}

/**
 * Get a single category by ID
 */
export async function getCategoryById(categoryId: string): Promise<Category | null> {
  const db = getFirestoreDb()
  const docSnap = await getDoc(doc(db, 'categories', categoryId))
  
  if (!docSnap.exists()) {
    return null
  }
  
  return { id: docSnap.id, ...docSnap.data() } as Category
}

/**
 * Create a note
 */
export async function createNote(data: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'path'>): Promise<string> {
  const db = getFirestoreDb()
  const docRef = doc(collection(db, 'notes'))
  
  console.log('[createNote] Creating note with data:', data)
  
  try {
    // Get category to compute path
    const categoryDoc = await getDoc(doc(db, 'categories', data.categoryId))
    if (!categoryDoc.exists()) {
      throw new Error(`Category ${data.categoryId} not found`)
    }
    
    const category = categoryDoc.data() as Category
    if (!category.isLeaf) {
      throw new Error(`Category ${data.categoryId} is not a leaf category (isLeaf=false)`)
    }
    
    const path = [...category.path, categoryDoc.id]  // Use categoryDoc.id!
    
    // Clean data - remove undefined values
    const cleanData: any = {
      categoryId: data.categoryId,
      path,
      title: data.title,
      content: data.content,
      order: data.order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
    
    // Only add interviewAnswer if it has a value
    if (data.interviewAnswer) {
      cleanData.interviewAnswer = data.interviewAnswer
    }
    
    await setDoc(docRef, cleanData)
    
    console.log('[createNote] Note created successfully with ID:', docRef.id)
    return docRef.id
  } catch (error) {
    console.error('[createNote] Error creating note:', error)
    throw error
  }
}

/**
 * Update a note
 */
export async function updateNote(id: string, data: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'path'>>): Promise<void> {
  const db = getFirestoreDb()
  const docRef = doc(db, 'notes', id)
  
  console.log('[updateNote] Updating note:', id, 'with data:', data)
  
  try {
    // Clean data - remove undefined values
    const cleanData: any = {
      updatedAt: serverTimestamp(),
    }
    
    // Only add fields that have actual values
    if (data.title !== undefined) cleanData.title = data.title
    if (data.content !== undefined) cleanData.content = data.content
    if (data.order !== undefined) cleanData.order = data.order
    if (data.interviewAnswer !== undefined) {
      cleanData.interviewAnswer = data.interviewAnswer || null
    }
    
    // If categoryId is changing, recompute path
    if (data.categoryId) {
      const categoryDoc = await getDoc(doc(db, 'categories', data.categoryId))
      if (!categoryDoc.exists()) {
        throw new Error(`Category ${data.categoryId} not found`)
      }
      
      const category = categoryDoc.data() as Category
      if (!category.isLeaf) {
        throw new Error(`Category ${data.categoryId} is not a leaf category`)
      }
      
      const path = [...category.path, categoryDoc.id]  // Use categoryDoc.id!
      
      cleanData.categoryId = data.categoryId
      cleanData.path = path
    }
    
    await updateDoc(docRef, cleanData)
    
    console.log('[updateNote] Note updated successfully')
  } catch (error) {
    console.error('[updateNote] Error updating note:', error)
    throw error
  }
}

/**
 * Delete a note
 */
export async function deleteNote(id: string): Promise<void> {
  const db = getFirestoreDb()
  await deleteDoc(doc(db, 'notes', id))
}

// ============== Flashcards (per leaf category) ==============

export async function createFlashcard(data: Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const db = getFirestoreDb()
  const docRef = doc(collection(db, 'flashcards'))
  const cleanData = {
    categoryId: data.categoryId,
    question: data.question.trim(),
    answer: data.answer.trim(),
    order: data.order,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }
  await setDoc(docRef, cleanData)
  return docRef.id
}

export async function updateFlashcard(id: string, data: Partial<Omit<Flashcard, 'id' | 'categoryId' | 'createdAt' | 'updatedAt'>>): Promise<void> {
  const db = getFirestoreDb()
  const docRef = doc(db, 'flashcards', id)
  const cleanData: Record<string, unknown> = { updatedAt: serverTimestamp() }
  if (data.question !== undefined) cleanData.question = data.question.trim()
  if (data.answer !== undefined) cleanData.answer = data.answer.trim()
  if (data.order !== undefined) cleanData.order = data.order
  await updateDoc(docRef, cleanData)
}

export async function deleteFlashcard(id: string): Promise<void> {
  const db = getFirestoreDb()
  await deleteDoc(doc(db, 'flashcards', id))
}

export async function getFlashcardsByCategoryId(categoryId: string): Promise<Flashcard[]> {
  const db = getFirestoreDb()
  const q = query(
    collection(db, 'flashcards'),
    where('categoryId', '==', categoryId),
    orderBy('order', 'asc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate?.(),
    updatedAt: d.data().updatedAt?.toDate?.(),
  })) as Flashcard[]
}

// ============== Exam questions (per leaf category) ==============

export async function createExamQuestion(data: Omit<ExamQuestion, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const db = getFirestoreDb()
  const docRef = doc(collection(db, 'exam_questions'))
  const options = data.type === 'mcq' ? (data.options ?? []) : []
  const cleanData = {
    categoryId: data.categoryId,
    question: data.question.trim(),
    type: data.type,
    options,
    correctAnswer: data.correctAnswer.trim(),
    order: data.order,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }
  await setDoc(docRef, cleanData)
  return docRef.id
}

export async function updateExamQuestion(id: string, data: Partial<Omit<ExamQuestion, 'id' | 'categoryId' | 'createdAt' | 'updatedAt'>>): Promise<void> {
  const db = getFirestoreDb()
  const docRef = doc(db, 'exam_questions', id)
  const cleanData: Record<string, unknown> = { updatedAt: serverTimestamp() }
  if (data.question !== undefined) cleanData.question = data.question.trim()
  if (data.type !== undefined) cleanData.type = data.type
  if (data.options !== undefined) cleanData.options = Array.isArray(data.options) ? data.options : []
  if (data.correctAnswer !== undefined) cleanData.correctAnswer = data.correctAnswer.trim()
  if (data.order !== undefined) cleanData.order = data.order
  await updateDoc(docRef, cleanData)
}

export async function deleteExamQuestion(id: string): Promise<void> {
  const db = getFirestoreDb()
  await deleteDoc(doc(db, 'exam_questions', id))
}

export async function getExamQuestionsByCategoryId(categoryId: string): Promise<ExamQuestion[]> {
  const db = getFirestoreDb()
  const q = query(
    collection(db, 'exam_questions'),
    where('categoryId', '==', categoryId),
    orderBy('order', 'asc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => {
    const raw = d.data()
    return {
      id: d.id,
      ...raw,
      options: raw.options ?? [],
      createdAt: raw.createdAt?.toDate?.(),
      updatedAt: raw.updatedAt?.toDate?.(),
    }
  }) as ExamQuestion[]
}
