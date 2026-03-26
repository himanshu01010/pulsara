import axios from 'axios'
import { clearStoredToken, clearStoredUser, getStoredToken } from '../utils/authStorage'

// ── Axios Instance ────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials:true
})

api.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      clearStoredToken()
      clearStoredUser()
      window.location.href = '/login'
    }

    return Promise.reject(err)
  }
)
export default api

// ── Trends API ────────────────────────────────────────────

export const trendsApi = {
  // GET /api/trends — raw trend list
  getRawTrends: () =>
    api.get('/api/trends').then((r) => r.data),

  // POST /api/trends/generate-and-save — full pipeline
  generateAndSave: () =>
    api.post('/api/trends/generate-and-save', {}, { timeout: 180000 }).then((r) => r.data),

  // POST /api/trends/refresh-cache — force fresh scrape
  refreshCache: () =>
    api.post('/api/trends/refresh-cache').then((r) => r.data),
}

// ── Articles API ──────────────────────────────────────────

export const articlesApi = {
  // GET /api/trends/articles — all articles (cached in Valkey)
  getAll: () =>
    api.get('/api/trends/articles').then((r) => r.data),

  // GET /api/trends/articles/:tag — articles by tag
  getByTag: (tag) =>
    api.get(`/api/trends/articles/${encodeURIComponent(tag)}`).then((r) => r.data),
}

// ── AI Search API (calls Python FastAPI directly for AI search) ──

export const searchApi = {
  
  aiSearch: (query) =>
    axios
      .post(
        `${import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:8000'}/api/search`,
        { query }
      )
      .then((r) => r.data),
}

// Auth 
export const authApi = {
  login: (data) =>
    api.post('/api/auth/login', data).then((res) => res.data),

  signup: (data) =>
    api.post('/api/auth/signup', data).then((res) => res.data),
  logout: () => 
    api.post('/api/auth/logout'),
}
