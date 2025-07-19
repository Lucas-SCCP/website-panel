import { Navigate } from 'react-router-dom'
import { useUserStore } from '../stores/UseUserStore'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, token } = useUserStore()

  if (!user || !token) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
