export type Category = {
  id: string
  name: string
  description?: string
}

export const categories: Category[] = [
  { id: 'front-end', name: 'Front end', description: 'React, JavaScript, TypeScript, Tailwind, CSS and more' },
  { id: 'back-end', name: 'Back-end', description: 'APIs, databases, server-side' },
  { id: 'devops', name: 'DevOps', description: 'CI/CD, Docker, cloud, deployment' },
  { id: 'design-patterns', name: 'Design Patterns', description: 'Reusable solutions and best practices' },
  { id: 'data-structures', name: 'Data Structures', description: 'Arrays, trees, graphs, hash maps' },
  { id: 'algorithms', name: 'Algorithms', description: 'Sorting, searching, complexity' },
  { id: 'behavior-questions', name: 'Behavior questions', description: 'STAR method and interview prep' },
  { id: 'more', name: 'More', description: 'General notes and resources' },
]

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id)
}
