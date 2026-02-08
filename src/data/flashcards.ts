/**
 * Legacy flashcard type (static data). Practice mode now uses Firestore
 * collection `flashcards` per leaf category. See useFlashcards and ReviewPage.
 */
export type FlashcardData = {
  interviewAnswer: string
  keyTerms?: { term: string; definition: string }[]
}

/** @deprecated Practice uses Firestore flashcards. Kept for type compatibility. */
export const flashcardData: Record<string, FlashcardData> = {}

/** @deprecated Use useAllFlashcards() / useFlashcards(categoryId) instead. */
export function getNoteIdsWithFlashcards(): string[] {
  return []
}

/** @deprecated Use Firestore-based practice. */
export function filterNoteIdsWithFlashcards(_noteIds: string[]): string[] {
  return []
}

/** Fisher–Yates shuffle. Use for any string[] or Flashcard[]. */
export function shuffleNoteIds<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
