import { useCallback, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type NodeTypes,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { CategoryNode } from './CategoryNode'
import { NoteNode } from './NoteNode'
import { GraphControls } from './GraphControls'
import { useGraphNavigation } from '../../hooks/useGraphNavigation'
import { LoadingSpinner } from '../LoadingScreen'

interface CategoryGraphViewProps {
  centerCategoryId: string | null
  onCategoryClick: (categoryId: string) => void
  onNoteClick: (noteId: string) => void
  onBack?: () => void
}

export function CategoryGraphView({
  centerCategoryId,
  onCategoryClick,
  onNoteClick,
  onBack,
}: CategoryGraphViewProps) {
  const { nodes, edges, centerCategory, isLoading, hasChildren } = useGraphNavigation(centerCategoryId)

  // Define custom node types
  const nodeTypes: NodeTypes = useMemo(
    () => ({
      category: CategoryNode,
      note: NoteNode,
    }),
    []
  )

  // Handle node clicks
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: any) => {
      if (node.type === 'category') {
        onCategoryClick(node.id)
      } else if (node.type === 'note') {
        onNoteClick(node.id)
      }
    },
    [onCategoryClick, onNoteClick]
  )

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!hasChildren && centerCategory) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            {centerCategory.icon ? (
              <span className="text-4xl">{centerCategory.icon}</span>
            ) : (
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            )}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {centerCategory.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {centerCategory.isLeaf
              ? 'This is a leaf category. Add notes from the admin panel to see them here.'
              : 'This category is empty. Add child categories from the admin panel.'}
          </p>
          {onBack && centerCategory.parentId && (
            <button
              onClick={onBack}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 relative bg-gray-50 dark:bg-gray-900">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={{
          animated: false,
          style: { strokeWidth: 2 },
        }}
      >
        <Background color="#94a3b8" gap={16} />
        <MiniMap
          nodeStrokeWidth={3}
          zoomable
          pannable
          className="bg-white dark:bg-gray-800"
        />
        <Controls />
        <GraphControls centerCategory={centerCategory} onBack={onBack} />
      </ReactFlow>
    </div>
  )
}
