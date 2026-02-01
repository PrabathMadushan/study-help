const STORAGE_KEY = 'study-progress'

export type NoteProgress = {
  score?: number // 0–100 from Gemini validation
}

export type ProgressStore = Record<string, NoteProgress>

let cachedStore: ProgressStore | null = null

function readFromStorage(): ProgressStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as ProgressStore
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

export function load(): ProgressStore {
  if (cachedStore !== null) return cachedStore
  cachedStore = readFromStorage()
  return cachedStore
}

function save(store: ProgressStore): void {
  try {
    cachedStore = store
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch (e) {
    console.error('Failed to save progress', e)
  }
}

export function getProgress(noteId: string): NoteProgress {
  const store = load()
  return store[noteId] ?? {}
}

export function setProgress(noteId: string, update: Partial<NoteProgress>): void {
  const store = load()
  const current = store[noteId] ?? {}
  const next: NoteProgress = { ...current, ...update }
  const newStore = { ...store, [noteId]: next }
  save(newStore)
}

export function setNoteScore(noteId: string, score: number): void {
  const s = Math.min(100, Math.max(0, Math.round(score)))
  setProgress(noteId, { score: s })
}

export function markViewed(_noteId: string): void {
  // No-op; we no longer track viewed separately. Kept for API compatibility.
}

export function markNotStarted(noteId: string): void {
  const store = load()
  const { [noteId]: _, ...rest } = store
  save(rest)
}

/**
 * Progress % for a set of note ids: average of scores (unscored = 0).
 */
export function computeProgressPercent(noteIds: string[]): number {
  if (noteIds.length === 0) return 0
  const store = load()
  let sum = 0
  for (const id of noteIds) {
    const p = store[id]
    sum += p?.score ?? 0
  }
  return Math.round(sum / noteIds.length)
}

export function computeOverallProgressPercent(allNoteIds: string[]): number {
  return computeProgressPercent(allNoteIds)
}
