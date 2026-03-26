import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search, X, Zap, Loader2, Sparkles, Bell,
  Settings, LogOut, ChevronDown, TrendingUp
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useAiSearch } from '../../hooks/useNews'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const searchRef = useRef(null)
  const profileRef = useRef(null)
  const aiSearch = useAiSearch()

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 100)
  }, [searchOpen])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    aiSearch.mutate(query)
  }

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div
          className="glass border-b border-white/5"
          style={{ boxShadow: '0 1px 40px rgba(0,0,0,0.4)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16 gap-3">

              <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pulse-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pulse-500/30 group-hover:shadow-pulse-500/50 transition-shadow">
                  <Zap size={15} className="text-white" />
                </div>
                <span className="font-display text-lg font-bold text-white hidden sm:block">
                  Pulsara
                </span>
                <span
                  className="hidden md:flex items-center gap-1 font-mono text-[9px] text-green-400 mt-0.5"
                >
                  <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                  LIVE
                </span>
              </Link>

              <div className="flex-1" />

              {!searchOpen && (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex items-center gap-2 glass-light rounded-xl px-3 py-2 text-sm text-slate-400 hover:text-white transition-all hover:border-white/20 group"
                >
                  <Sparkles size={14} className="text-pulse-400" />
                  <span className="hidden md:block text-sm">AI Search</span>
                  <span className="hidden md:flex items-center gap-0.5 font-mono text-[10px] bg-ink-700 px-1.5 py-0.5 rounded text-slate-500">
                    ⌘K
                  </span>
                </button>
              )}

              <button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pulse-500 rounded-full animate-pulse" />
              </button>

              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 glass-light rounded-xl px-2.5 py-1.5 hover:border-white/20 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-pulse-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white shadow-md overflow-hidden">
                    {user?.avatar
                      ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                      : initials
                    }
                  </div>
                  <span className="text-sm text-white hidden sm:block max-w-[100px] truncate font-medium">
                    {user?.name || 'Account'}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform duration-200 hidden sm:block ${profileOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-12 w-60 glass rounded-2xl p-2 shadow-2xl z-50 animate-fade-up border border-white/10">
                    <div className="flex items-center gap-3 px-3 py-3 mb-1 border-b border-white/5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pulse-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white shrink-0 overflow-hidden">
                        {user?.avatar
                          ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                          : initials
                        }
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => { navigate('/settings'); setProfileOpen(false) }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <Settings size={15} className="text-slate-500" />
                        Settings
                      </button>

                      <div className="my-1 border-t border-white/5" />

                      <button
                        onClick={() => { logout(); navigate('/login'); setProfileOpen(false) }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all"
                      >
                        <LogOut size={15} />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-20 sm:pt-24 px-4">
          <div
            className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm"
            onClick={() => { setSearchOpen(false); setQuery('') }}
          />

          <div className="relative w-full max-w-2xl glass rounded-2xl shadow-2xl border border-white/10 animate-fade-up overflow-hidden">
            <form onSubmit={handleSearch}>
              <div className="flex items-center gap-3 p-4 border-b border-white/5">
                <Sparkles size={18} className="text-pulse-400 shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask AI to find news… e.g. 'latest cricket updates'"
                  className="flex-1 bg-transparent text-white text-base outline-none placeholder-slate-500"
                />
                {aiSearch.isPending
                  ? <Loader2 size={18} className="text-pulse-400 animate-spin shrink-0" />
                  : query
                    ? <button type="button" onClick={() => setQuery('')} className="text-slate-500 hover:text-white transition-colors">
                        <X size={18} />
                      </button>
                    : null
                }
              </div>

              <div className="flex items-center justify-between px-4 py-2.5 bg-ink-800/50">
                <span className="text-xs text-slate-500 font-mono">Press Enter to search with AI</span>
                <button
                  type="submit"
                  disabled={!query.trim() || aiSearch.isPending}
                  className="btn-primary py-1.5 px-4 text-xs flex items-center gap-1.5 disabled:opacity-40"
                >
                  <Search size={12} />
                  Search
                </button>
              </div>
            </form>

            {aiSearch.isPending && (
              <div className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 text-slate-400">
                  <Loader2 size={16} className="animate-spin text-pulse-400" />
                  <span className="text-sm">AI is searching Pulsara…</span>
                </div>
              </div>
            )}

            {aiSearch.isError && (
              <div className="p-4 text-center text-red-400 text-sm">
                Search failed. Make sure the backend is running.
              </div>
            )}

            {aiSearch.data && !aiSearch.isPending && (
              <div className="max-h-80 overflow-y-auto p-2">
                <p className="text-xs text-slate-500 px-3 py-2 font-mono flex items-center gap-1.5">
                  <TrendingUp size={11} className="text-pulse-400" />
                  {aiSearch.data?.articles?.length || 0} results found
                </p>
                {aiSearch.data?.articles?.length === 0 && (
                  <p className="text-center text-slate-500 text-sm py-6">No articles found for "{query}"</p>
                )}
                {aiSearch.data?.articles?.map((a, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      navigate(`/article/${encodeURIComponent(a.tag)}`)
                      setSearchOpen(false)
                      setQuery('')
                    }}
                    className="w-full text-left p-3 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="tag-badge mt-0.5 shrink-0">{a.tag}</span>
                      <div>
                        <p className="text-sm font-medium text-white group-hover:text-pulse-300 transition-colors line-clamp-1">
                          {a.headline}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{a.summary}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!aiSearch.data && !aiSearch.isPending && !query && (
              <div className="p-4">
                <p className="text-xs text-slate-500 mb-3 font-mono uppercase tracking-wider">Try asking</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Latest cricket news',
                    'IPL 2026 updates',
                    'Champions League',
                    'Tech news India',
                  ].map((hint) => (
                    <button
                      key={hint}
                      onClick={() => setQuery(hint)}
                      className="glass-light rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-all hover:border-white/20"
                    >
                      {hint}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
