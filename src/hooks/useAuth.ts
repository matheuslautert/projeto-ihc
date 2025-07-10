import { useState, useEffect, useCallback } from 'react'

export function useAuth() {
  const [user, setUser] = useState<{ tipo: string; nome: string } | null>(null)

  const updateUser = useCallback(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        setUser(null)
      }
    } else {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    updateUser()
    
    // Listener para mudanças no localStorage
    const handleStorageChange = () => {
      updateUser()
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [updateUser])

  function logout() {
    localStorage.removeItem('user')
    setUser(null)
    window.location.href = '/login'
  }

  function login(userData: { tipo: string; nome: string }) {
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  return { user, logout, login, updateUser }
} 