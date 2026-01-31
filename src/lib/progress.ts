const STORAGE_KEY = 'study-progress'

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed'

export type NoteProgress = {
  status: ProgressStatus
  lastViewedAt?: string
  completedAt?: string
  nextReviewAt?: string
  lastReviewedAt?: string
  reviewCount?: number
}

const REVIEW_INTERVAL_DAYS = [3, 7, 7] // first review +3d, second +7d, then +7d

function addDays(date: Date, days: number): string {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

function isDue(p: NoteProgress): boolean {
  if (p.status !== 'completed') return false
  const now = Date.now()
  if (p.nextReviewAt) {
    return new Date(p.nextReviewAt).getTime() <= now
  }
  if (p.completedAt) {
    const completedMs = new Date(p.completedAt).getTime()
    return completedMs + 24 * 60 * 60 * 1000 <= now
  }
  return false
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
    next.nextReviewAt = addDays(new Date(), 1)
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

/**
 * Returns note IDs that are completed and due for review (nextReviewAt <= now, or no nextReviewAt and completedAt + 1 day <= now).
 */
export function getNotesDueForReview(noteIds: string[], store: ProgressStore): string[] {
  return noteIds.filter((id) => {
    const p = store[id]
    return p != null && isDue(p)
  })
}

/**
 * Record that a note was reviewed. Advances fixed-interval ladder: first review +3d, second +7d, then +7d.
 */
export function recordReview(noteId: string): void {
  const store = load()
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
  save(newStore)
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
