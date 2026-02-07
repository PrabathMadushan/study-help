import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import type { Category } from '../../types/firestore'

interface CategoryNodeData {
  category: Category
  isCenter: boolean
  childrenCount: number
  noteCount: number
}

export const CategoryNode = memo(({ data }: any) => {
  const { category, isCenter, childrenCount, noteCount } = data
  const size = isCenter ? 120 : 80

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-full transition-all ${
        isCenter
          ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-2xl ring-4 ring-violet-300 dark:ring-violet-700 animate-pulse'
          : 'bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-110'
      }`}
      style={{
        width: size,
        height: size,
        cursor: 'pointer',
      }}
    >
      {/* Icon */}
      {category.icon && (
        <div className={`${isCenter ? 'text-3xl' : 'text-xl'} mb-1`}>
          {category.icon}
        </div>
      )}

      {/* Name */}
      <div
        className={`${
          isCenter ? 'text-sm font-bold' : 'text-xs font-semibold'
        } text-center px-2 leading-tight`}
        style={{
          maxWidth: size - 20,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {category.name}
      </div>

      {/* Badge */}
      {!isCenter && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
              category.isLeaf
                ? 'bg-green-500 text-white'
                : 'bg-blue-500 text-white'
            }`}
          >
            {category.isLeaf ? '📄' : `${childrenCount}`}
          </span>
        </div>
      )}

      {/* Handles for connections */}
      {!isCenter && (
        <Handle
          type="target"
          position={Position.Top}
          style={{ opacity: 0 }}
        />
      )}
      {isCenter && (
        <>
          <Handle type="source" position={Position.Top} style={{ opacity: 0 }} />
          <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
          <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
          <Handle type="source" position={Position.Left} style={{ opacity: 0 }} />
        </>
      )}
    </div>
  )
})

CategoryNode.displayName = 'CategoryNode'
