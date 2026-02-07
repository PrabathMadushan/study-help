import { useParams, useNavigate } from 'react-router-dom'
import { CategoryGraphView } from '../components/graph/CategoryGraphView'
import { ReactFlowProvider } from '@xyflow/react'

export function GraphPage() {
  const { categoryId } = useParams<{ categoryId?: string }>()
  const navigate = useNavigate()

  const handleCategoryClick = (id: string) => {
    navigate(`/graph/${id}`)
  }

  const handleNoteClick = (id: string) => {
    navigate(`/note/${id}`)
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="h-screen flex flex-col">
      <ReactFlowProvider>
        <CategoryGraphView
          centerCategoryId={categoryId || null}
          onCategoryClick={handleCategoryClick}
          onNoteClick={handleNoteClick}
          onBack={handleBack}
        />
      </ReactFlowProvider>
    </div>
  )
}
