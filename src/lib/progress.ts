const STORAGE_KEY = 'study-progress'

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed'

export type NoteProgress = {
  status: ProgressStatus
  lastViewedAt?: string
  completedAt?: string
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
  return store[noteId] ?? { status: 'not_started' }
}

export function setProgress(noteId: string, update: Partial<NoteProgress>): void {
  const store = load()
  const current = store[noteId] ?? { status: 'not_started' }
  const next: NoteProgress = {
    ...current,
    ...update,
  }
  if (update.status === 'completed' && !next.completedAt) {
    next.completedAt = new Date().toISOString()
  }
  if (update.lastViewedAt === undefined && (update.status === 'in_progress' || update.status === 'completed')) {
    next.lastViewedAt = new Date().toISOString()
  }
  const newStore = { ...store, [noteId]: next }
  save(newStore)
}

export function markViewed(noteId: string): void {
  const current = getProgress(noteId)
  if (current.status === 'not_started') {
    setProgress(noteId, { status: 'in_progress', lastViewedAt: new Date().toISOString() })
  } else {
    setProgress(noteId, { lastViewedAt: new Date().toISOString() })
  }
}

export function markCompleted(noteId: string): void {
  setProgress(noteId, { status: 'completed' })
}

export function markNotStarted(noteId: string): void {
  const store = load()
  const { [noteId]: _, ...rest } = store
  save(rest)
}

/**
 * Progress % for a set of note ids: (completed + 0.5 * in_progress) / total * 100
 */
export function computeProgressPercent(noteIds: string[]): number {
  if (noteIds.length === 0) return 0
  const store = load()
  let score = 0
  for (const id of noteIds) {
    const p = store[id]
    if (!p || p.status === 'not_started') continue
    if (p.status === 'completed') score += 1
    else if (p.status === 'in_progress') score += 0.5
  }
  return Math.round((score / noteIds.length) * 100)
}

/**
 * Overall progress % across all given note ids (same formula).
 */
export function computeOverallProgressPercent(allNoteIds: string[]): number {
  return computeProgressPercent(allNoteIds)
}
