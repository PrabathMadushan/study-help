import { Outlet, NavLink } from 'react-router-dom'
import { useAdmin } from '../hooks/useAdmin'
import { useAuth } from '../contexts/AuthContext'
import { LoadingScreen } from './LoadingScreen'
import { useNavigate } from 'react-router-dom'

export function AdminLayout() {
  const { isAdmin, loading } = useAdmin()
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  if (loading) {
    return <LoadingScreen />
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">You don't have permission to access the admin panel.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Admin Panel</h1>
            <div className="flex gap-4 items-center">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Back to App
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <nav className="mb-8 flex gap-4 flex-wrap">
          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`
            }
          >
            Categories
          </NavLink>
          <NavLink
            to="/admin/notes"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`
            }
          >
            Notes
          </NavLink>
          <NavLink
            to="/admin/validation"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`
            }
          >
            Validation
          </NavLink>
        </nav>

        <Outlet />
      </div>
    </div>
  )
}
