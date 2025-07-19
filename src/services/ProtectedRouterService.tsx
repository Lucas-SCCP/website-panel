import { Navigate } from 'react-router-dom'
import { useUserStore } from '../stores/UseUserStore'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, token } = useUserStore();

  if (!user || !token) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
