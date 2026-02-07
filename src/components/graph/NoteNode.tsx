import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import type { Note } from '../../types/firestore'

interface NoteNodeData {
  note: Note
  progress?: number
}

export const NoteNode = memo(({ data }: any) => {
  const { note, progress = 0 } = data

  return (
    <div
      className="relative flex flex-col items-center justify-center px-3 py-2 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
      style={{
        width: 100,
        minHeight: 60,
      }}
    >
      {/* Title */}
      <div
        className="text-xs font-semibold text-center leading-tight"
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {note.title}
      </div>

      {/* Progress Badge */}
      {progress > 0 && (
        <div className="absolute -top-2 -right-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              progress >= 80
                ? 'bg-green-600 text-white'
                : progress >= 50
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-400 text-white'
            }`}
          >
            {progress}
          </div>
        </div>
      )}

      {/* Note Icon */}
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
        <span className="text-xs">📝</span>
      </div>

      {/* Handle for connection */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ opacity: 0 }}
      />
    </div>
  )
})

NoteNode.displayName = 'NoteNode'
