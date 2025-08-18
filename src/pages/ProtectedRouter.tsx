import { Navigate } from 'react-router-dom'
import { UseUserStore } from '../stores/UseUserStore'
import type { JSX } from 'react'

export function ProtectedRouter({ children }: { children: JSX.Element }) {
  const { user, token } = UseUserStore()

  if (!user || !token) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
