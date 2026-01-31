import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { CategoryPage } from './pages/CategoryPage'
import { NotePage } from './pages/NotePage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'category/:id', element: <CategoryPage /> },
      { path: 'category/:id/:subId', element: <CategoryPage /> },
      { path: 'note/:id', element: <NotePage /> },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
