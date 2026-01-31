import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import type { FirebaseApp } from 'firebase/app'
import type { Auth } from 'firebase/auth'
import type { Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? 'AIzaSyC9oQI-rNWbOH-McKifYfInGoPsLGkaneM',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'study-help-22de8.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'study-help-22de8',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'study-help-22de8.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '438379654749',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '1:438379654749:web:c9a6c2281f0ba41f5267b4',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? 'G-NKWCKBQEMV',
}

let app: FirebaseApp | null = null

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = initializeApp(firebaseConfig)
  }
  return app
}

let auth: Auth | null = null

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp())
  }
  return auth
}

let db: Firestore | null = null

export function getFirestoreDb(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseApp())
  }
  return db
}

export { firebaseConfig }
