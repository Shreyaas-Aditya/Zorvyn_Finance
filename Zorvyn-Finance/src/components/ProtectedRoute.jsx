import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { user, loading, session } = useAuth()
  const location = useLocation()

  // Wait for auth to initialize
  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <div className="mx-auto mb-4 size-12 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600 dark:border-gray-800 dark:border-t-emerald-500"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Check for user OR session (session updates faster)
  if (!user && !session) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
