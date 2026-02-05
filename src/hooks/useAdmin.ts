import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { useAuth } from '../contexts/AuthContext'
import { getFirestoreDb } from '../lib/firebase'

export function useAdmin() {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      console.log('[useAdmin] No user, setting isAdmin to false')
      setIsAdmin(false)
      setLoading(false)
      return
    }

    console.log('[useAdmin] Checking admin status for user:', user.uid)
    const docRef = doc(getFirestoreDb(), 'admins', user.uid)
    const unsubscribe = onSnapshot(
      docRef,
      (snap) => {
        const exists = snap.exists()
        const data = snap.data()
        const role = data?.role
        const adminStatus = exists && role === 'admin'
        
        console.log('[useAdmin] Admin check:', {
          exists,
          data,
          role,
          adminStatus
        })
        
        setIsAdmin(adminStatus)
        setLoading(false)
      },
      (error) => {
        console.error('[useAdmin] Error checking admin status:', error)
        setIsAdmin(false)
        setLoading(false)
      }
    )

    return unsubscribe
  }, [user])

  return { isAdmin, loading }
}
