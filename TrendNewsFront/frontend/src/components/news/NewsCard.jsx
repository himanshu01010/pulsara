import { useNavigate } from 'react-router-dom'
import { Clock, TrendingUp, ArrowRight } from 'lucide-react'

const fallbackImages = [
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80',
  'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600&q=80',
  'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&q=80',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
]

export default function NewsCard({ article, index = 0 }) {
  const navigate = useNavigate()
  const img = article.imageUrl || fallbackImages[index % fallbackImages.length]

  return (
    <article
      className="news-card group"
      style={{
        animationDelay: `${index * 80}ms`,
        animation: 'fadeUp 0.5s ease forwards',
        opacity: 0,
      }}
      onClick={() => navigate(`/article/${encodeURIComponent(article.tag)}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/article/${encodeURIComponent(article.tag)}`)}
    >
      <div className="relative h-48 overflow-hidden bg-ink-800">
        <img
          src={img}
          alt={article.headline}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onError={(e) => { e.target.src = fallbackImages[0] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent to-transparent" />

        <div className="absolute top-3 left-3">
          <span className="tag-badge">
            <TrendingUp size={10} />
            {article.tag}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-display text-base font-semibold text-white leading-snug line-clamp-2 group-hover:text-pulse-300 transition-colors duration-200 mb-3">
          {article.headline}
        </h3>

        <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 font-body">
          {article.summary}
        </p>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <Clock size={11} />
            <span>Trending now</span>
          </div>
          <span className="flex items-center gap-1 text-pulse-400 text-xs font-medium group-hover:gap-2 transition-all duration-200">
            Read more <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </article>
  )
}

export function NewsCardSkeleton() {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="skeleton h-48 w-full" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-4 w-1/3 rounded-full" />
        <div className="skeleton h-4 w-full rounded-lg" />
        <div className="skeleton h-4 w-4/5 rounded-lg" />
        <div className="skeleton h-3 w-full rounded-lg mt-2" />
        <div className="skeleton h-3 w-full rounded-lg" />
        <div className="skeleton h-3 w-2/3 rounded-lg" />
        <div className="flex justify-between mt-4 pt-4 border-t border-white/5">
          <div className="skeleton h-3 w-20 rounded-full" />
          <div className="skeleton h-3 w-16 rounded-full" />
        </div>
      </div>
    </div>
  )
}