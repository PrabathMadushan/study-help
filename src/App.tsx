import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { SubjectProvider } from './contexts/SubjectContext'
import { Layout } from './components/Layout'
import { AdminLayout } from './components/AdminLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { HomePage } from './pages/HomePage'
import { SubjectsPage } from './pages/SubjectsPage'
import { CategoryPage } from './pages/CategoryPage'
import { NotePage } from './pages/NotePage'
import { LoginPage } from './pages/LoginPage'
import { SignUpPage } from './pages/SignUpPage'
import { ReviewPage } from './pages/ReviewPage'
import { DashboardPage } from './pages/DashboardPage'
import { SubjectsManage } from './pages/admin/SubjectsManage'
import { CategoriesManage } from './pages/admin/CategoriesManage'
import { NotesManage } from './pages/admin/NotesManage'

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
      { path: 'subjects', element: <SubjectsPage /> },
      { path: 'review', element: <ReviewPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'category/:id', element: <CategoryPage /> },
      { path: 'category/:id/:subId', element: <CategoryPage /> },
      { path: 'category/:id/:subId/:subSubId', element: <CategoryPage /> },
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
      { path: 'subjects', element: <SubjectsManage /> },
      { path: 'categories', element: <CategoriesManage /> },
      { path: 'notes', element: <NotesManage /> },
    ],
  },
])

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SubjectProvider>
          <RouterProvider router={router} />
        </SubjectProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
