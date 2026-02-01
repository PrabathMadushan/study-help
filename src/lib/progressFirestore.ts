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

function getProgressRef(uid: string) {
  return doc(getFirestoreDb(), 'users', uid, 'progress', 'state')
}

function notify(uid: string) {
  listeners.get(uid)?.forEach((cb) => cb())
}

export function subscribe(uid: string, callback: () => void): () => void {
  if (!listeners.has(uid)) {
    listeners.set(uid, new Set())
    const ref = getProgressRef(uid)
    const unsubSnapshot = onSnapshot(
      ref,
      (snap) => {
        const data = snap.data()
        const notes = (data?.notes as ProgressStore | undefined) ?? {}
        const store =
          typeof notes === 'object' && notes !== null && Object.keys(notes).length > 0
            ? notes
            : EMPTY_STORE
        cache.set(uid, store)
        notify(uid)
      },
      () => {
        cache.set(uid, EMPTY_STORE)
        notify(uid)
      }
    )
    ;(listeners.get(uid) as Set<() => void> & { _unsub?: Unsubscribe })._unsub = unsubSnapshot
  }
  listeners.get(uid)!.add(callback)
  return () => {
    listeners.get(uid)?.delete(callback)
  }
}

export function getSnapshot(uid: string): ProgressStore {
  return cache.get(uid) ?? EMPTY_STORE
}

export async function load(uid: string): Promise<ProgressStore> {
  const snap = await getDoc(getProgressRef(uid))
  const data = snap.data()
  const notes = (data?.notes as ProgressStore | undefined) ?? {}
  const store =
    typeof notes === 'object' && notes !== null && Object.keys(notes).length > 0
      ? notes
      : EMPTY_STORE
  cache.set(uid, store)
  return store
}

export function getProgress(uid: string, noteId: string): NoteProgress {
  const store = getSnapshot(uid)
  return store[noteId] ?? {}
}

export async function setProgress(uid: string, noteId: string, update: Partial<NoteProgress>): Promise<void> {
  const store = getSnapshot(uid)
  const current = store[noteId] ?? {}
  const next: NoteProgress = { ...current, ...update }
  const newStore = { ...store, [noteId]: next }
  cache.set(uid, newStore)
  await setDoc(getProgressRef(uid), { notes: newStore }, { merge: true })
  notify(uid)
}

export async function setNoteScore(uid: string, noteId: string, score: number): Promise<void> {
  const s = Math.min(100, Math.max(0, Math.round(score)))
  await setProgress(uid, noteId, { score: s })
}

export async function markViewed(_uid: string, _noteId: string): Promise<void> {
  // No-op; kept for API compatibility.
}

export async function markNotStarted(uid: string, noteId: string): Promise<void> {
  const store = getSnapshot(uid)
  const { [noteId]: _, ...rest } = store
  const newStore = rest
  cache.set(uid, newStore)
  await setDoc(getProgressRef(uid), { notes: newStore }, { merge: true })
  notify(uid)
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
