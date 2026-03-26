import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Bell, Shield, Save, Check, LogOut, Camera } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import LightOrbs from '../components/ui/LightOrbs'
import { useAuth } from '../context/AuthContext'

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 shrink-0 ${
        value ? 'bg-pulse-500' : 'bg-ink-600'
      }`}
    >
      <span
        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${
          value ? 'left-6' : 'left-1'
        }`}
      />
    </button>
  )
}

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuth()
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    notifications: true,
    aiSearch: true,
    trendAlerts: false,
    govtFilter: true,
  })

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSave = () => {
    updateUser({ name: form.name, email: form.email })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'

  return (
    <div className="min-h-screen bg-ink-950 relative overflow-x-hidden">
      <LightOrbs />
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(124,106,247,1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(124,106,247,1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      <Navbar />

      <main className="relative z-10 pt-20 pb-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-sm">Back</span>
          </button>

          <h1 className="font-display text-3xl font-bold text-white mb-8 animate-fade-up">
            Settings
          </h1>

          <div className="space-y-4 animate-fade-up" style={{ animationDelay: '100ms' }}>

            {/* ── Profile ─────────────────────────────────── */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-7 h-7 rounded-lg bg-pulse-500/20 flex items-center justify-center">
                  <User size={14} className="text-pulse-400" />
                </div>
                <h2 className="font-semibold text-white">Profile</h2>
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-5 mb-6">
                <div className="relative group">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pulse-500 to-pink-500 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-pulse-500/20 overflow-hidden">
                    {user?.avatar
                      ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                      : initials
                    }
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera size={16} className="text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-white font-semibold">{user?.name}</p>
                  <p className="text-slate-500 text-sm">{user?.email}</p>
                  <button className="text-pulse-400 text-xs mt-1.5 hover:text-pulse-300 transition-colors">
                    Change avatar
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-mono mb-2 block uppercase tracking-wider">
                    Display Name
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-mono mb-2 block uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="input-field"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* ── Notifications ────────────────────────────── */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-7 h-7 rounded-lg bg-pulse-500/20 flex items-center justify-center">
                  <Bell size={14} className="text-pulse-400" />
                </div>
                <h2 className="font-semibold text-white">Notifications</h2>
              </div>
              <div className="space-y-5">
                {[
                  { key: 'notifications', label: 'Push Notifications', desc: 'Get notified when new articles are generated' },
                  { key: 'trendAlerts', label: 'Trending Alerts', desc: 'Alert when a topic starts trending in India' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-white text-sm font-medium">{label}</p>
                      <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                    <Toggle value={form[key]} onChange={set(key)} />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Privacy & AI ─────────────────────────────── */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-7 h-7 rounded-lg bg-pulse-500/20 flex items-center justify-center">
                  <Shield size={14} className="text-pulse-400" />
                </div>
                <h2 className="font-semibold text-white">Privacy & AI</h2>
              </div>
              <div className="space-y-5">
                {[
                  { key: 'aiSearch', label: 'AI-Powered Search', desc: 'Use Claude AI for intelligent article search' },
                  { key: 'govtFilter', label: 'Government Compliance Filter', desc: 'Automatically filter content to meet PCI guidelines' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-white text-sm font-medium">{label}</p>
                      <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                    <Toggle value={form[key]} onChange={set(key)} />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Save button ──────────────────────────────── */}
            <button
              onClick={handleSave}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
            >
              {saved
                ? <><Check size={16} /> Changes saved!</>
                : <><Save size={16} /> Save Changes</>
              }
            </button>

            {/* ── Danger zone ──────────────────────────────── */}
            <div className="glass rounded-2xl p-6 border border-red-500/10">
              <h2 className="font-semibold text-red-400 mb-4 text-sm uppercase font-mono tracking-wider">
                Danger Zone
              </h2>
              <button
                onClick={() => { logout(); navigate('/login') }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 border border-red-400/20 hover:border-red-400/40 transition-all"
              >
                <LogOut size={15} />
                Sign out of Pulsara
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}