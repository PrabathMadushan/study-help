import { useCallback, useSyncExternalStore } from 'react'
import {
  load,
  markViewed,
  markCompleted,
  markNotStarted,
  computeProgressPercent,
  computeOverallProgressPercent,
  type NoteProgress,
  type ProgressStore,
} from '../lib/progress'
import { notes } from '../data/notes'

function getSnapshot(): ProgressStore {
  return load()
}

function subscribe(callback: () => void): () => void {
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
  const store = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  const setNoteViewed = useCallback((noteId: string) => {
    markViewed(noteId)
    notifyProgress()
  }, [])

  const setNoteCompleted = useCallback((noteId: string) => {
    markCompleted(noteId)
    notifyProgress()
  }, [])

  const setNoteNotStarted = useCallback((noteId: string) => {
    markNotStarted(noteId)
    notifyProgress()
  }, [])

  const getNoteProgress = useCallback((noteId: string): NoteProgress => {
    return store[noteId] ?? { status: 'not_started' }
  }, [store])

  const getCategoryProgress = useCallback(
    (categoryId: string): number => {
      const noteIds = notes.filter((n) => n.categoryId === categoryId).map((n) => n.id)
      return computeProgressPercent(noteIds)
    },
    [store]
  )

  const getSubcategoryProgress = useCallback(
    (categoryId: string, subcategoryId: string): number => {
      const noteIds = notes
        .filter((n) => n.categoryId === categoryId && n.subcategoryId === subcategoryId)
        .map((n) => n.id)
      return computeProgressPercent(noteIds)
    },
    [store]
  )

  const getOverallProgress = useCallback((): number => {
    const allIds = notes.map((n) => n.id)
    return computeOverallProgressPercent(allIds)
  }, [store])

  return {
    getNoteProgress,
    setNoteViewed,
    setNoteCompleted,
    setNoteNotStarted,
    getCategoryProgress,
    getSubcategoryProgress,
    getOverallProgress,
  }
}
