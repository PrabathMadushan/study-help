import { useState, useEffect } from 'react'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { getFirestoreDb } from '../lib/firebase'
import type { Subject } from '../types/firestore'

export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(
      collection(getFirestoreDb(), 'subjects'),
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
        })) as Subject[]

        setSubjects(data)
        setLoading(false)
      },
      (error) => {
        console.error('Error fetching subjects:', error)
        setSubjects([])
        setLoading(false)
      }
    )

    return unsubscribe
  }, [])

  return { subjects, loading }
}
