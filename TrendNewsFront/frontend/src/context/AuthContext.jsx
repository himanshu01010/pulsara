import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../services/api'
import { clearStoredToken, clearStoredUser, getStoredUser, storeUser } from '../utils/authStorage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser(getStoredUser())
    setLoading(false)
  }, [])

 const login = (userData) => {
  setUser(userData)
  storeUser(userData)
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
  clearStoredUser()
  clearStoredToken()
}

  const updateUser = (updates) => {
    const updated = { ...user, ...updates }
    setUser(updated)
    storeUser(updated)
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
