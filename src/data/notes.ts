import { notesMeta, type NoteMeta } from './notesMeta'

export type Note = NoteMeta

export const notes: Note[] = notesMeta

export function getNotesByCategoryId(
  categoryId: string,
  subcategoryId?: string,
  subSubcategoryId?: string
): Note[] {
  return notes
    .filter(
      (n) =>
        n.categoryId === categoryId &&
        (subcategoryId == null || n.subcategoryId === subcategoryId) &&
        (subSubcategoryId == null || n.subSubcategoryId === subSubcategoryId)
    )
    .sort((a, b) => a.order - b.order)
}

export function getNoteById(id: string): Note | undefined {
  return notes.find((n) => n.id === id)
}
