import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { Layout } from './components/Layout'
import { AdminLayout } from './components/AdminLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { HomePage } from './pages/HomePage'
import { GraphPage } from './pages/GraphPage'
import { NotePage } from './pages/NotePage'
import { LoginPage } from './pages/LoginPage'
import { SignUpPage } from './pages/SignUpPage'
import { ReviewPage } from './pages/ReviewPage'
import { DashboardPage } from './pages/DashboardPage'
import { CategoriesTreeManage } from './pages/admin/CategoriesTreeManage'
import { NotesManage } from './pages/admin/NotesManage'
import { ValidationTools } from './pages/admin/ValidationTools'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'graph', element: <GraphPage /> },
      { path: 'graph/:categoryId', element: <GraphPage /> },
      { path: 'review', element: <ReviewPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'note/:id', element: <NotePage /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'categories', element: <CategoriesTreeManage /> },
      { path: 'notes', element: <NotesManage /> },
      { path: 'validation', element: <ValidationTools /> },
    ],
  },
])

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
