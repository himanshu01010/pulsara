import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, RefreshCw, Sparkles, Zap, ArrowRight, Clock } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import NewsCard, { NewsCardSkeleton } from '../components/news/NewsCard'
import LightOrbs from '../components/ui/LightOrbs'
import { useArticles, useArticlesByTag, useGenerateArticles } from '../hooks/useNews'

const FEATURED_TAGS = ['Liverpool', 'IPL 2026', 'Champions League', 'Meta', 'Bangladesh', 'Pant']
const fallbackImages = [
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80',
  'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600&q=80',
]

function FeaturedCard({ article }) {
  const navigate = useNavigate()
  const img = article.imageUrl || fallbackImages[0]

  return (
    <article
      className="relative rounded-2xl overflow-hidden cursor-pointer group h-72 sm:h-96"
      onClick={() => navigate(`/article/${encodeURIComponent(article.tag)}`)}
      style={{ border: '1px solid rgba(124,106,247,0.2)' }}
    >
      <img
        src={img}
        alt={article.headline}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        onError={(e) => { e.target.src = fallbackImages[0] }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
        <span className="tag-badge mb-3 inline-flex">
          <TrendingUp size={10} />
          {article.tag}
        </span>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight mb-2 group-hover:text-pulse-300 transition-colors max-w-2xl">
          {article.headline}
        </h2>
        <p className="text-slate-300 text-sm line-clamp-2 max-w-2xl mb-4">{article.summary}</p>
        <span className="flex items-center gap-1.5 text-pulse-400 text-sm font-medium group-hover:gap-3 transition-all">
          Read full story <ArrowRight size={14} />
        </span>
      </div>
    </article>
  )
}

export default function HomePage() {
  const [activeTag, setActiveTag] = useState(null)
  const allArticles = useArticles()
  const tagArticles = useArticlesByTag(activeTag)
  const generate = useGenerateArticles()

  const articles = activeTag ? (tagArticles.data || []) : (allArticles.data || [])
  const isLoading = activeTag ? tagArticles.isLoading : allArticles.isLoading
  const isError = activeTag ? tagArticles.isError : allArticles.isError

  return (
    <div className="min-h-screen bg-ink-950 relative overflow-x-hidden">
      <LightOrbs />
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(124,106,247,1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(124,106,247,1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      <Navbar />
      <main className="relative z-10 pt-20">

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 glass-light rounded-full px-4 py-2 mb-6 text-xs text-pulse-300 font-mono animate-fade-up">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live trending now from India
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 animate-fade-up" style={{ animationDelay: '100ms' }}>
              The live{' '}
              <span className="gradient-text text-shadow-glow">pulse</span>
              {' '}of what&apos;s happening
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: '200ms' }}>
              AI-powered news from trending topics — generated, verified, and delivered in real time.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-up" style={{ animationDelay: '300ms' }}>
              <button onClick={() => generate.mutate()} disabled={generate.isPending} className="btn-primary flex items-center gap-2">
                {generate.isPending
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating…</>
                  : <><Sparkles size={15} /> Generate Latest News</>
                }
              </button>
              <button onClick={() => allArticles.refetch()} className="glass-light rounded-xl px-5 py-3 text-sm text-slate-300 hover:text-white flex items-center gap-2 transition-all hover:border-white/20">
                <RefreshCw size={14} className={allArticles.isFetching ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
            {generate.isSuccess && (
              <p className="mt-4 text-green-400 text-sm animate-fade-up">✓ {generate.data?.articles_saved} new articles saved!</p>
            )}
          </div>
        </section>

        {/* Tag Filters */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} className="text-pulse-400" />
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Trending</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveTag(null)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${!activeTag ? 'bg-pulse-500 text-white shadow-lg shadow-pulse-500/30' : 'glass-light text-slate-400 hover:text-white'}`}
            >All</button>
            {FEATURED_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${activeTag === tag ? 'bg-pulse-500 text-white shadow-lg shadow-pulse-500/30' : 'glass-light text-slate-400 hover:text-white'}`}
              >{tag}</button>
            ))}
          </div>
        </section>

        {/* Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {isError && (
            <div className="glass rounded-2xl p-8 text-center">
              <p className="text-red-400 mb-2">Failed to load articles</p>
              <button onClick={() => allArticles.refetch()} className="text-pulse-400 text-sm hover:text-pulse-300">Try again</button>
            </div>
          )}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => <NewsCardSkeleton key={i} />)}
            </div>
          ) : articles.length === 0 ? (
            <div className="glass rounded-2xl p-16 text-center">
              <Zap size={40} className="text-pulse-500 mx-auto mb-4 opacity-50" />
              <p className="text-slate-400 mb-2">No articles yet</p>
              <p className="text-slate-500 text-sm mb-6">Click "Generate Latest News" to create AI news from current trends</p>
              <button onClick={() => generate.mutate()} className="btn-primary text-sm">Generate Now</button>
            </div>
          ) : (
            <>
              {!activeTag && articles.length > 0 && (
                <div className="mb-5"><FeaturedCard article={articles[0]} /></div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {(activeTag ? articles : articles.slice(1)).map((article, i) => (
                  <NewsCard key={article.id || i} article={article} index={i} />
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  )
}