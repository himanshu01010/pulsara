import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, TrendingUp, Clock, Share2,
  Bookmark, CheckCheck, AlertCircle
} from 'lucide-react'
import { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import LightOrbs from '../components/ui/LightOrbs'
import { useArticlesByTag } from '../hooks/useNews'

const fallback = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80'

function ArticleSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="skeleton h-5 w-32 rounded-full" />
      <div className="skeleton h-10 w-full rounded-xl" />
      <div className="skeleton h-8 w-4/5 rounded-xl" />
      <div className="glass rounded-2xl p-5">
        <div className="skeleton h-4 w-full rounded-lg mb-2" />
        <div className="skeleton h-4 w-5/6 rounded-lg" />
      </div>
      <div className="skeleton h-72 sm:h-96 w-full rounded-2xl" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="skeleton h-4 w-full rounded-lg" />
          <div className="skeleton h-4 w-full rounded-lg" />
          <div className="skeleton h-4 w-3/4 rounded-lg" />
        </div>
      ))}
    </div>
  )
}

export default function ArticlePage() {
  const { tag } = useParams()
  const navigate = useNavigate()
  const decodedTag = decodeURIComponent(tag)
  const [bookmarked, setBookmarked] = useState(false)
  const [copied, setCopied] = useState(false)

  const { data: articles, isLoading, isError, refetch } = useArticlesByTag(decodedTag)
  const article = articles?.[0]

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      
    }
  }

  const paragraphs = article?.body
    ?.split(/\n\n|\n/)
    .map((p) => p.trim())
    .filter(Boolean) || []

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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-sm">Back to feed</span>
          </button>

          {isLoading && <ArticleSkeleton />}

          {isError && (
            <div className="glass rounded-2xl p-12 text-center">
              <AlertCircle size={40} className="text-red-400 mx-auto mb-4 opacity-70" />
              <p className="text-red-400 font-medium mb-2">Failed to load article</p>
              <p className="text-slate-500 text-sm mb-6">Could not fetch articles for "{decodedTag}"</p>
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => refetch()} className="btn-primary text-sm">Try again</button>
                <button onClick={() => navigate('/')} className="glass-light rounded-xl px-4 py-2 text-sm text-slate-300 hover:text-white transition-all">
                  Go home
                </button>
              </div>
            </div>
          )}

          {article && !isLoading && (
            <article className="animate-fade-up">

              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="tag-badge">
                  <TrendingUp size={10} />
                  {article.tag}
                </span>
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-mono">
                  <Clock size={11} />
                  <span>Published just now</span>
                </div>
                <div className="ml-auto flex items-center gap-1.5 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="text-green-400 font-mono text-[10px] uppercase tracking-wider">
                    Govt. Compliant
                  </span>
                </div>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight mb-6">
                {article.headline}
              </h1>

              <div
                className="rounded-2xl p-5 mb-8"
                style={{
                  background: 'rgba(98, 83, 225, 0.08)',
                  borderLeft: '3px solid #6253e1',
                  border: '1px solid rgba(98,83,225,0.2)',
                  borderLeftWidth: '3px',
                }}
              >
                <p className="text-slate-300 text-base leading-relaxed font-body italic">
                  {article.summary}
                </p>
              </div>

              <div className="relative rounded-2xl overflow-hidden mb-10 h-56 sm:h-80 lg:h-96 bg-ink-800">
                <img
                  src={article.imageUrl || fallback}
                  alt={article.headline}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = fallback }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/40 to-transparent" />
                {article.imageQuery && (
                  <div className="absolute bottom-3 right-3 text-[10px] text-white/40 font-mono bg-black/30 backdrop-blur-sm px-2 py-1 rounded-lg">
                    📷 {article.imageQuery}
                  </div>
                )}
              </div>

              <div className="space-y-5 mb-10">
                {paragraphs.map((para, i) => (
                  <p
                    key={i}
                    className="text-slate-300 text-base sm:text-lg leading-relaxed font-body"
                    style={{
                      animationDelay: `${i * 60}ms`,
                      animation: 'fadeUp 0.4s ease forwards',
                      opacity: 0,
                    }}
                  >
                    {para}
                  </p>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/5">
                <button
                  onClick={() => setBookmarked(!bookmarked)}
                  className={`glass-light rounded-xl px-4 py-2.5 text-sm flex items-center gap-2 transition-all hover:border-white/20 ${
                    bookmarked ? 'text-pulse-300 border-pulse-500/30' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Bookmark size={15} className={bookmarked ? 'fill-pulse-400 text-pulse-400' : ''} />
                  {bookmarked ? 'Saved' : 'Save'}
                </button>

                <button
                  onClick={handleShare}
                  className="glass-light rounded-xl px-4 py-2.5 text-sm text-slate-300 hover:text-white flex items-center gap-2 transition-all hover:border-white/20"
                >
                  {copied
                    ? <><CheckCheck size={15} className="text-green-400" /> Copied!</>
                    : <><Share2 size={15} /> Share</>
                  }
                </button>
              </div>

              {articles.length > 1 && (
                <section className="mt-16">
                  <h2 className="font-display text-xl font-semibold text-white mb-5 flex items-center gap-2">
                    <TrendingUp size={18} className="text-pulse-400" />
                    More on &quot;{decodedTag}&quot;
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {articles.slice(1, 3).map((a, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          navigate(`/article/${encodeURIComponent(a.tag)}`)
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                        className="glass rounded-xl p-4 text-left hover:border-pulse-500/40 transition-all group"
                      >
                        <p className="text-sm font-semibold text-white group-hover:text-pulse-300 transition-colors line-clamp-2 mb-2 font-display">
                          {a.headline}
                        </p>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{a.summary}</p>
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </article>
          )}

          {!isLoading && !isError && !article && (
            <div className="glass rounded-2xl p-16 text-center">
              <TrendingUp size={40} className="text-pulse-500/40 mx-auto mb-4" />
              <p className="text-white font-medium mb-2">No article found</p>
              <p className="text-slate-500 text-sm mb-6">
                No articles have been generated for &quot;{decodedTag}&quot; yet.
              </p>
              <button onClick={() => navigate('/')} className="btn-primary text-sm">
                ← Back to feed
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}