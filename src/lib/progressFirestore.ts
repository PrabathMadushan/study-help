import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { getFirestoreDb } from './firebase'
import type { NoteProgress, ProgressStore } from './progress'

const cache = new Map<string, ProgressStore>()
const listeners = new Map<string, Set<() => void>>()

const EMPTY_STORE: ProgressStore = Object.freeze({})

function getCacheKey(uid: string, subjectId: string): string {
  return `${uid}:${subjectId}`
}

function getProgressRef(uid: string, subjectId: string) {
  return doc(getFirestoreDb(), 'users', uid, 'progress', subjectId)
}

function notify(uid: string, subjectId: string) {
  const key = getCacheKey(uid, subjectId)
  listeners.get(key)?.forEach((cb) => cb())
}

export function subscribe(uid: string, subjectId: string, callback: () => void): () => void {
  const key = getCacheKey(uid, subjectId)
  if (!listeners.has(key)) {
    listeners.set(key, new Set())
    const ref = getProgressRef(uid, subjectId)
    const unsubSnapshot = onSnapshot(
      ref,
      (snap) => {
        const data = snap.data()
        const notes = (data?.notes as ProgressStore | undefined) ?? {}
        const store =
          typeof notes === 'object' && notes !== null && Object.keys(notes).length > 0
            ? notes
            : EMPTY_STORE
        cache.set(key, store)
        notify(uid, subjectId)
      },
      () => {
        cache.set(key, EMPTY_STORE)
        notify(uid, subjectId)
      }
    )
    ;(listeners.get(key) as Set<() => void> & { _unsub?: Unsubscribe })._unsub = unsubSnapshot
  }
  listeners.get(key)!.add(callback)
  return () => {
    listeners.get(key)?.delete(callback)
  }
}

export function getSnapshot(uid: string, subjectId: string): ProgressStore {
  const key = getCacheKey(uid, subjectId)
  return cache.get(key) ?? EMPTY_STORE
}

export async function load(uid: string, subjectId: string): Promise<ProgressStore> {
  const key = getCacheKey(uid, subjectId)
  const snap = await getDoc(getProgressRef(uid, subjectId))
  const data = snap.data()
  const notes = (data?.notes as ProgressStore | undefined) ?? {}
  const store =
    typeof notes === 'object' && notes !== null && Object.keys(notes).length > 0
      ? notes
      : EMPTY_STORE
  cache.set(key, store)
  return store
}

export function getProgress(uid: string, subjectId: string, noteId: string): NoteProgress {
  const store = getSnapshot(uid, subjectId)
  return store[noteId] ?? {}
}

export async function setProgress(uid: string, subjectId: string, noteId: string, update: Partial<NoteProgress>): Promise<void> {
  const key = getCacheKey(uid, subjectId)
  const store = getSnapshot(uid, subjectId)
  const current = store[noteId] ?? {}
  const next: NoteProgress = { ...current, ...update }
  const newStore = { ...store, [noteId]: next }
  cache.set(key, newStore)
  await setDoc(getProgressRef(uid, subjectId), { notes: newStore }, { merge: true })
  notify(uid, subjectId)
}

export async function setNoteScore(uid: string, subjectId: string, noteId: string, score: number): Promise<void> {
  const store = getSnapshot(uid, subjectId)
  const current = store[noteId]
  const oldScore = typeof current?.score === 'number' ? current.score : null
  const newScoreRaw = oldScore != null ? (oldScore + score) / 2 : score
  const s = Math.min(100, Math.max(0, Math.round(newScoreRaw)))
  await setProgress(uid, subjectId, noteId, { score: s })
}

export async function markViewed(_uid: string, _subjectId: string, _noteId: string): Promise<void> {
  // No-op; kept for API compatibility.
}

export async function markNotStarted(uid: string, subjectId: string, noteId: string): Promise<void> {
  const key = getCacheKey(uid, subjectId)
  const store = getSnapshot(uid, subjectId)
  const { [noteId]: _, ...rest } = store
  const newStore = rest
  cache.set(key, newStore)
  await setDoc(getProgressRef(uid, subjectId), { notes: newStore }, { merge: true })
  notify(uid, subjectId)
}

export function computeProgressPercent(noteIds: string[], store: ProgressStore): number {
  if (noteIds.length === 0) return 0
  let sum = 0
  for (const id of noteIds) {
    const p = store[id]
    sum += p?.score ?? 0
  }
  return Math.round(sum / noteIds.length)
}

export function computeOverallProgressPercent(allNoteIds: string[], store: ProgressStore): number {
  return computeProgressPercent(allNoteIds, store)
}
