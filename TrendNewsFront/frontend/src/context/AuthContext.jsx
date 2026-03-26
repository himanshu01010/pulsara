import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('pulsara_user')
      setUser(savedUser ? JSON.parse(savedUser) : null)
    } catch {
      setUser(null)
      localStorage.removeItem('pulsara_user')
    } finally {
      setLoading(false)
    }
  }, [])

 const login = (userData) => {
  setUser(userData)
  localStorage.setItem('pulsara_user', JSON.stringify(userData))
}

  const loginWithGoogle = () => {
    // Redirect to Spring Boot Google OAuth2
    window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/oauth2/authorization/google`
  }

  const logout = async () => {
  try {
    await authApi.logout()
  } catch {}
  setUser(null)
  localStorage.removeItem('pulsara_user')
}

  const updateUser = (updates) => {
    const updated = { ...user, ...updates }
    setUser(updated)
    localStorage.setItem('pulsara_user', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
