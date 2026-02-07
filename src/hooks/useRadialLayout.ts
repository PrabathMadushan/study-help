import { useMemo } from 'react'
import type { Node, Edge } from '@xyflow/react'
import type { Category, Note } from '../types/firestore'

interface RadialLayoutOptions {
  radius?: number
  centerX?: number
  centerY?: number
}

/**
 * Custom hook to create radial layout for React Flow graph
 * Positions nodes in a circle around a center node
 */
export function useRadialLayout(
  centerCategory: Category | null,
  childCategories: Category[],
  notes: Note[],
  options: RadialLayoutOptions = {}
) {
  const { radius = 300, centerX = 400, centerY = 300 } = options

  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = []
    const edges: Edge[] = []

    // If no center category, show root categories in a grid-like circle
    if (!centerCategory) {
      const totalItems = childCategories.length
      
      childCategories.forEach((category, index) => {
        const angle = (360 / totalItems) * index * (Math.PI / 180)
        const x = centerX + radius * Math.cos(angle)
        const y = centerY + radius * Math.sin(angle)

        nodes.push({
          id: category.id,
          type: 'category',
          position: { x, y },
          data: {
            category,
            isCenter: false,
            childrenCount: 0, // Will be computed by component
            noteCount: 0,
          },
        })
      })

      return { nodes, edges }
    }

    // Add center node
    nodes.push({
      id: centerCategory.id,
      type: 'category',
      position: { x: centerX, y: centerY },
      data: {
        category: centerCategory,
        isCenter: true,
        childrenCount: childCategories.length,
        noteCount: notes.length,
      },
    })

    // Combine children categories and notes for circular layout
    const allChildren = [
      ...childCategories.map(cat => ({ type: 'category' as const, item: cat })),
      ...notes.map(note => ({ type: 'note' as const, item: note })),
    ]

    const totalItems = allChildren.length

    // Position children in a circle around center
    allChildren.forEach((child, index) => {
      // Calculate angle for this item (evenly distributed)
      const angle = (360 / totalItems) * index * (Math.PI / 180)
      
      // Calculate position
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      if (child.type === 'category') {
        const category = child.item as Category
        nodes.push({
          id: category.id,
          type: 'category',
          position: { x, y },
          data: {
            category,
            isCenter: false,
            childrenCount: 0,
            noteCount: 0,
          },
        })

        // Create edge from center to this category
        edges.push({
          id: `${centerCategory.id}-${category.id}`,
          source: centerCategory.id,
          target: category.id,
          type: 'smoothstep',
          animated: false,
          style: { stroke: '#94a3b8', strokeWidth: 2 },
        })
      } else {
        const note = child.item as Note
        nodes.push({
          id: note.id,
          type: 'note',
          position: { x, y },
          data: {
            note,
            progress: 0, // Will be loaded from progress tracking
          },
        })

        // Create edge from center to this note
        edges.push({
          id: `${centerCategory.id}-${note.id}`,
          source: centerCategory.id,
          target: note.id,
          type: 'smoothstep',
          animated: false,
          style: { stroke: '#86efac', strokeWidth: 2 },
        })
      }
    })

    return { nodes, edges }
  }, [centerCategory, childCategories, notes, radius, centerX, centerY])

  return { nodes, edges }
}
