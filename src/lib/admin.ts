import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp
} from 'firebase/firestore'
import { getFirestoreDb } from './firebase'
import type { Subject, Category, Subcategory, SubSubcategory, Note } from '../types/firestore'

// Subject CRUD
export async function createSubject(data: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = getFirestoreDb()
  const docRef = doc(collection(db, 'subjects'))
  
  console.log('[createSubject] Creating subject with data:', data)
  
  try {
    await setDoc(docRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    
    console.log('[createSubject] Subject created successfully with ID:', docRef.id)
    return docRef.id
  } catch (error) {
    console.error('[createSubject] Error creating subject:', error)
    throw error
  }
}

export async function updateSubject(id: string, data: Partial<Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>>) {
  const db = getFirestoreDb()
  const docRef = doc(db, 'subjects', id)
  
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteSubject(id: string) {
  const db = getFirestoreDb()
  await deleteDoc(doc(db, 'subjects', id))
}

// Category CRUD
export async function createCategory(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = getFirestoreDb()
  const docRef = doc(collection(db, 'categories'))
  
  await setDoc(docRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  
  return docRef.id
}

export async function updateCategory(id: string, data: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>) {
  const db = getFirestoreDb()
  const docRef = doc(db, 'categories', id)
  
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteCategory(id: string) {
  const db = getFirestoreDb()
  await deleteDoc(doc(db, 'categories', id))
}

// Subcategory CRUD
export async function createSubcategory(data: Omit<Subcategory, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = getFirestoreDb()
  const docRef = doc(collection(db, 'subcategories'))
  
  await setDoc(docRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  
  return docRef.id
}

export async function updateSubcategory(id: string, data: Partial<Omit<Subcategory, 'id' | 'createdAt' | 'updatedAt'>>) {
  const db = getFirestoreDb()
  const docRef = doc(db, 'subcategories', id)
  
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteSubcategory(id: string) {
  const db = getFirestoreDb()
  await deleteDoc(doc(db, 'subcategories', id))
}

// SubSubcategory CRUD
export async function createSubSubcategory(data: Omit<SubSubcategory, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = getFirestoreDb()
  const docRef = doc(collection(db, 'subSubcategories'))
  
  await setDoc(docRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  
  return docRef.id
}

export async function updateSubSubcategory(id: string, data: Partial<Omit<SubSubcategory, 'id' | 'createdAt' | 'updatedAt'>>) {
  const db = getFirestoreDb()
  const docRef = doc(db, 'subSubcategories', id)
  
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteSubSubcategory(id: string) {
  const db = getFirestoreDb()
  await deleteDoc(doc(db, 'subSubcategories', id))
}

// Note CRUD
export async function createNote(data: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = getFirestoreDb()
  const docRef = doc(collection(db, 'notes'))
  
  await setDoc(docRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  
  return docRef.id
}

export async function updateNote(id: string, data: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>) {
  const db = getFirestoreDb()
  const docRef = doc(db, 'notes', id)
  
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteNote(id: string) {
  const db = getFirestoreDb()
  await deleteDoc(doc(db, 'notes', id))
}
