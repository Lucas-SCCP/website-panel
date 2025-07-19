import { Navigate } from 'react-router-dom'
import { UseUserStore } from '../stores/UseUserStore'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, token } = UseUserStore()

  if (!user || !token) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
