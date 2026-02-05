import { useCallback, useSyncExternalStore } from 'react'
import {
  load,
  markViewed,
  markNotStarted,
  computeProgressPercent,
  computeOverallProgressPercent,
  setNoteScore as setNoteScoreLocal,
  type NoteProgress,
  type ProgressStore,
} from '../lib/progress'
import {
  subscribe as firestoreSubscribe,
  getSnapshot as firestoreGetSnapshot,
  markViewed as firestoreMarkViewed,
  markNotStarted as firestoreMarkNotStarted,
  computeProgressPercent as firestoreComputeProgressPercent,
  computeOverallProgressPercent as firestoreComputeOverallProgressPercent,
  setNoteScore as setNoteScoreFirestore,
} from '../lib/progressFirestore'
import { useAuth } from '../contexts/AuthContext'
import { useSubject } from '../contexts/SubjectContext'
import { notes } from '../data/notes'

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

export function notifyProgress(): void {
  progressListeners.forEach((cb) => cb())
}

export function useProgress() {
  const { user } = useAuth()
  const { currentSubjectId } = useSubject()

  const subscribeStore = useCallback(
    (callback: () => void) => {
      if (!user || !currentSubjectId) return subscribeLocal(callback)
      return firestoreSubscribe(user.uid, currentSubjectId, callback)
    },
    [user, currentSubjectId]
  )

  const getSnapshotStore = useCallback((): ProgressStore => {
    if (!user || !currentSubjectId) return getLocalSnapshot()
    return firestoreGetSnapshot(user.uid, currentSubjectId)
  }, [user, currentSubjectId])

  const store = useSyncExternalStore(subscribeStore, getSnapshotStore, getSnapshotStore)

  const setNoteViewed = useCallback(
    (noteId: string) => {
      if (user && currentSubjectId) {
        firestoreMarkViewed(user.uid, currentSubjectId, noteId)
      } else {
        markViewed(noteId)
        notifyProgress()
      }
    },
    [user, currentSubjectId]
  )

  const setNoteScore = useCallback(
    (noteId: string, score: number) => {
      if (user && currentSubjectId) {
        setNoteScoreFirestore(user.uid, currentSubjectId, noteId, score)
      } else {
        setNoteScoreLocal(noteId, score)
        notifyProgress()
      }
    },
    [user, currentSubjectId]
  )

  const setNoteNotStarted = useCallback(
    (noteId: string) => {
      if (user && currentSubjectId) {
        firestoreMarkNotStarted(user.uid, currentSubjectId, noteId)
      } else {
        markNotStarted(noteId)
        notifyProgress()
      }
    },
    [user, currentSubjectId]
  )

  const getNoteProgress = useCallback(
    (noteId: string): NoteProgress => {
      return store[noteId] ?? {}
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

  const getSubSubcategoryProgress = useCallback(
    (categoryId: string, subcategoryId: string, subSubcategoryId: string): number => {
      const noteIds = notes
        .filter(
          (n) =>
            n.categoryId === categoryId &&
            n.subcategoryId === subcategoryId &&
            n.subSubcategoryId === subSubcategoryId
        )
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

  return {
    getNoteProgress,
    setNoteViewed,
    setNoteScore,
    setNoteNotStarted,
    getCategoryProgress,
    getSubcategoryProgress,
    getSubSubcategoryProgress,
    getOverallProgress,
  }
}
