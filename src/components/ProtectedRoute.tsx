import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'
import { ReactNode } from 'react'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  if (user === undefined) {
    return <div style={{color: 'white', textAlign: 'center', marginTop: '2rem'}}>Carregando autenticação...</div>
  }
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
} 