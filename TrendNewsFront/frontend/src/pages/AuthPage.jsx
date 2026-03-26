import { useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Zap } from 'lucide-react'
import LightOrbs from '../components/ui/LightOrbs';
import { authApi } from '../services/api';
import { storeToken } from '../utils/authStorage';

const AuthPage= ()=> {
    const [mode,setMode] = useState('login');
    const[showPass, setShowPass]= useState(false);
    const[form, setForm] = useState({name:'',email:'',password:''});
    const[loading, setLoading] = useState(false);
    const[error, setError]= useState('');
    const{login, loginWithGoogle}= useAuth();
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')
  setLoading(true)

  try {
    if (mode === 'login') {
      const response = await authApi.login({
        email: form.email,
        password: form.password,
      })

      if (response?.token) {
        storeToken(response.token)
      }
    } else {
      await authApi.signup({
        fullname: form.name,
        email: form.email,
        password: form.password,
      })
    }

    // Since backend uses cookies, no token needed
    login(
      {
        name: form.name || form.email.split('@')[0],
        email: form.email,
      },
      null
    )

    navigate('/')
  } catch (err) {
    setError(
      err.response?.data || 'Something went wrong. Try again.'
    )
  } finally {
    setLoading(false)
  }
}

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
    
  return (
        <div className="min-h-screen bg-ink-950 flex items-center justify-center p-4 relative overflow-hidden">
      <LightOrbs />
 
      {/* Grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(124,106,247,1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(124,106,247,1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
 
      <div className="relative z-10 w-full max-w-md animate-fade-up">
 
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pulse-500 to-purple-600 flex items-center justify-center shadow-xl shadow-pulse-500/30">
              <Zap size={22} className="text-white" />
            </div>
            <span className="font-display text-3xl font-bold text-white tracking-tight">
              Pulsara
            </span>
          </div>
          <p className="text-slate-400 text-sm">
            {mode === 'login'
              ? 'Welcome back — stay ahead of the pulse'
              : 'Join millions reading smarter news'}
          </p>
        </div>
 
        {/* Card */}
        <div className="glass rounded-2xl p-8 border-glow">
 
          {/* Tabs */}
          <div className="flex bg-ink-800 rounded-xl p-1 mb-7">
            {['login', 'signup'].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 capitalize ${
                  mode === m
                    ? 'bg-pulse-500 text-white shadow-lg shadow-pulse-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>
 
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="relative animate-slide-in">
                <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Full name"
                  className="input-field pl-11"
                  value={form.name}
                  onChange={set('name')}
                  required
                />
              </div>
            )}
 
            <div className="relative">
              <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type="email"
                placeholder="Email address"
                className="input-field pl-11"
                value={form.email}
                onChange={set('email')}
                required
              />
            </div>
 
            <div className="relative">
              <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                className="input-field pl-11 pr-11"
                value={form.password}
                onChange={set('password')}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
 
            {error && (
              <div className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                {error}
              </div>
            )}
 
            {mode === 'login' && (
              <div className="text-right">
                <button type="button" className="text-xs text-slate-500 hover:text-pulse-400 transition-colors">
                  Forgot password?
                </button>
              </div>
            )}
 
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-60"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {mode === 'login' ? 'Sign In to Pulsara' : 'Create Your Account'}
            </button>
          </form>
 
          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-ink-600" />
            <span className="text-slate-500 text-xs font-mono">OR</span>
            <div className="flex-1 h-px bg-ink-600" />
          </div>
 
          {/* Google */}
          <button
            onClick={loginWithGoogle}
            className="w-full glass-light rounded-xl py-3 px-4 flex items-center justify-center gap-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
              <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>
        </div>
 
        <p className="text-center text-slate-600 text-xs mt-6">
          By continuing you agree to our{' '}
          <span className="text-slate-500 hover:text-white cursor-pointer transition-colors">Terms</span>
          {' & '}
          <span className="text-slate-500 hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
        </p>
      </div>
    </div>
  )
}

export default AuthPage
