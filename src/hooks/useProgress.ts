import { useCallback, useSyncExternalStore } from 'react'
import {
  load,
  markViewed,
  markCompleted,
  markNotStarted,
  computeProgressPercent,
  computeOverallProgressPercent,
  getNotesDueForReview as getNotesDueForReviewLocal,
  recordReview as recordReviewLocal,
  type NoteProgress,
  type ProgressStore,
} from '../lib/progress'
import {
  subscribe as firestoreSubscribe,
  getSnapshot as firestoreGetSnapshot,
  markViewed as firestoreMarkViewed,
  markCompleted as firestoreMarkCompleted,
  markNotStarted as firestoreMarkNotStarted,
  computeProgressPercent as firestoreComputeProgressPercent,
  computeOverallProgressPercent as firestoreComputeOverallProgressPercent,
  getNotesDueForReview as getNotesDueForReviewFirestore,
  recordReview as recordReviewFirestore,
} from '../lib/progressFirestore'
import { useAuth } from '../contexts/AuthContext'
import { notes } from '../data/notes'
import { getNoteIdsWithFlashcards } from '../data/flashcards'

function getLocalSnapshot(): ProgressStore {
  return load()
}

function subscribeLocal(callback: () => void): () => void {
  progressListeners.add(callback)
  return () => {
    progressListeners.delete(callback)
  }
}

const progressListeners = new Set<() => void>()

function notifyProgress(): void {
  progressListeners.forEach((cb) => cb())
}

export function useProgress() {
  const { user } = useAuth()

  const subscribeStore = useCallback(
    (callback: () => void) => {
      if (!user) return subscribeLocal(callback)
      return firestoreSubscribe(user.uid, callback)
    },
    [user]
  )

  const getSnapshotStore = useCallback((): ProgressStore => {
    if (!user) return getLocalSnapshot()
    return firestoreGetSnapshot(user.uid)
  }, [user])

  const store = useSyncExternalStore(subscribeStore, getSnapshotStore, getSnapshotStore)

  const setNoteViewed = useCallback(
    (noteId: string) => {
      if (user) {
        firestoreMarkViewed(user.uid, noteId)
      } else {
        markViewed(noteId)
        notifyProgress()
      }
    },
    [user]
  )

  const setNoteCompleted = useCallback(
    (noteId: string) => {
      if (user) {
        firestoreMarkCompleted(user.uid, noteId)
      } else {
        markCompleted(noteId)
        notifyProgress()
      }
    },
    [user]
  )

  const setNoteNotStarted = useCallback(
    (noteId: string) => {
      if (user) {
        firestoreMarkNotStarted(user.uid, noteId)
      } else {
        markNotStarted(noteId)
        notifyProgress()
      }
    },
    [user]
  )

  const getNoteProgress = useCallback(
    (noteId: string): NoteProgress => {
      return store[noteId] ?? { status: 'not_started' }
    },
    [store]
  )

  const getCategoryProgress = useCallback(
    (categoryId: string): number => {
      const noteIds = notes.filter((n) => n.categoryId === categoryId).map((n) => n.id)
      return user
        ? firestoreComputeProgressPercent(noteIds, store)
        : computeProgressPercent(noteIds)
    },
    [store, user]
  )

  const getSubcategoryProgress = useCallback(
    (categoryId: string, subcategoryId: string): number => {
      const noteIds = notes
        .filter((n) => n.categoryId === categoryId && n.subcategoryId === subcategoryId)
        .map((n) => n.id)
      return user
        ? firestoreComputeProgressPercent(noteIds, store)
        : computeProgressPercent(noteIds)
    },
    [store, user]
  )

  const getOverallProgress = useCallback((): number => {
    const allIds = notes.map((n) => n.id)
    return user
      ? firestoreComputeOverallProgressPercent(allIds, store)
      : computeOverallProgressPercent(allIds)
  }, [store, user])

  const getNotesDueForReview = useCallback(
    (noteIds: string[]): string[] => {
      return user
        ? getNotesDueForReviewFirestore(noteIds, store)
        : getNotesDueForReviewLocal(noteIds, store)
    },
    [store, user]
  )

  const getDueCount = useCallback((): number => {
    const idsWithFlashcards = getNoteIdsWithFlashcards()
    return getNotesDueForReview(idsWithFlashcards).length
  }, [getNotesDueForReview])

  const recordReview = useCallback(
    (noteId: string) => {
      if (user) {
        recordReviewFirestore(user.uid, noteId)
      } else {
        recordReviewLocal(noteId)
      }
    },
    [user]
  )

  return {
    getNoteProgress,
    setNoteViewed,
    setNoteCompleted,
    setNoteNotStarted,
    getCategoryProgress,
    getSubcategoryProgress,
    getOverallProgress,
    getNotesDueForReview,
    getDueCount,
    recordReview,
  }
}
