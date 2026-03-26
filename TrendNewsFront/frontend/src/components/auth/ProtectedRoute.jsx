import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-pulse-500/30 border-t-pulse-500 rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-mono">Loading Pulsara…</p>
        </div>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}