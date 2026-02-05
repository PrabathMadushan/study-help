import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

type SubjectContextValue = {
  currentSubjectId: string | null
  setCurrentSubjectId: (id: string) => void
  clearSubject: () => void
}

const SubjectContext = createContext<SubjectContextValue | null>(null)

export function SubjectProvider({ children }: { children: ReactNode }) {
  const [currentSubjectId, setCurrentSubjectId] = useState<string | null>(() => {
    return localStorage.getItem('selectedSubject')
  })

  const setSubject = useCallback((id: string) => {
    setCurrentSubjectId(id)
    localStorage.setItem('selectedSubject', id)
  }, [])

  const clearSubject = useCallback(() => {
    setCurrentSubjectId(null)
    localStorage.removeItem('selectedSubject')
  }, [])

  return (
    <SubjectContext.Provider 
      value={{ 
        currentSubjectId, 
        setCurrentSubjectId: setSubject, 
        clearSubject 
      }}
    >
      {children}
    </SubjectContext.Provider>
  )
}

export function useSubject() {
  const context = useContext(SubjectContext)
  if (!context) {
    throw new Error('useSubject must be used within SubjectProvider')
  }
  return context
}
