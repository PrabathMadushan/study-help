import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { getFirestoreDb } from './firebase'
import {
  getNotesDueForReview as getNotesDueForReviewFromProgress,
  type NoteProgress,
  type ProgressStore,
} from './progress'

const cache = new Map<string, ProgressStore>()
const listeners = new Map<string, Set<() => void>>()

/** Stable empty store reference so useSyncExternalStore doesn't re-render infinitely when cache is empty. */
const EMPTY_STORE: ProgressStore = Object.freeze({})

function getProgressRef(uid: string) {
  return doc(getFirestoreDb(), 'users', uid, 'progress', 'state')
}

function notify(uid: string) {
  listeners.get(uid)?.forEach((cb) => cb())
}

/**
 * Subscribe to progress changes for a user. Returns unsubscribe.
 */
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
  return store[noteId] ?? { status: 'not_started' }
}

function addDays(date: Date, days: number): string {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

function applyUpdate(current: NoteProgress, update: Partial<NoteProgress>): NoteProgress {
  const next: NoteProgress = {
    ...current,
    ...update,
  }
  if (update.status === 'completed' && !next.completedAt) {
    next.completedAt = new Date().toISOString()
    next.nextReviewAt = addDays(new Date(), 1)
  }
  if (update.lastViewedAt === undefined && (update.status === 'in_progress' || update.status === 'completed')) {
    next.lastViewedAt = new Date().toISOString()
  }
  return next
}

export async function setProgress(uid: string, noteId: string, update: Partial<NoteProgress>): Promise<void> {
  const store = getSnapshot(uid)
  const current = store[noteId] ?? { status: 'not_started' }
  const next = applyUpdate(current, update)
  const newStore = { ...store, [noteId]: next }
  cache.set(uid, newStore)
  await setDoc(getProgressRef(uid), { notes: newStore }, { merge: true })
  notify(uid)
}

export async function markViewed(uid: string, noteId: string): Promise<void> {
  const current = getProgress(uid, noteId)
  if (current.status === 'not_started') {
    await setProgress(uid, noteId, { status: 'in_progress', lastViewedAt: new Date().toISOString() })
  } else {
    await setProgress(uid, noteId, { lastViewedAt: new Date().toISOString() })
  }
}

export async function markCompleted(uid: string, noteId: string): Promise<void> {
  await setProgress(uid, noteId, { status: 'completed' })
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
  let score = 0
  for (const id of noteIds) {
    const p = store[id]
    if (!p || p.status === 'not_started') continue
    if (p.status === 'completed') score += 1
    else if (p.status === 'in_progress') score += 0.5
  }
  return Math.round((score / noteIds.length) * 100)
}

export function computeOverallProgressPercent(allNoteIds: string[], store: ProgressStore): number {
  return computeProgressPercent(allNoteIds, store)
}

const REVIEW_INTERVAL_DAYS = [3, 7, 7]

export function getNotesDueForReview(noteIds: string[], store: ProgressStore): string[] {
  return getNotesDueForReviewFromProgress(noteIds, store)
}

export async function recordReview(uid: string, noteId: string): Promise<void> {
  const store = getSnapshot(uid)
  const current = store[noteId]
  if (!current || current.status !== 'completed') return
  const count = current.reviewCount ?? 0
  const intervalIndex = Math.min(count, REVIEW_INTERVAL_DAYS.length - 1)
  const days = REVIEW_INTERVAL_DAYS[intervalIndex]
  const next: NoteProgress = {
    ...current,
    nextReviewAt: addDays(new Date(), days),
    lastReviewedAt: new Date().toISOString(),
    reviewCount: count + 1,
  }
  const newStore = { ...store, [noteId]: next }
  cache.set(uid, newStore)
  await setDoc(getProgressRef(uid), { notes: newStore }, { merge: true })
  notify(uid)
}
