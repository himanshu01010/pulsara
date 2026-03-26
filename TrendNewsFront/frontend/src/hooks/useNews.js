import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { articlesApi, trendsApi, searchApi } from '../services/api'

// ── Query Keys ────────────────────────────────────────────
export const keys = {
  articles: ['articles'],
  articlesByTag: (tag) => ['articles', 'tag', tag],
  trends: ['trends'],
}

// ── Fetch all articles ────────────────────────────────────
export function useArticles() {
  return useQuery({
    queryKey: keys.articles,
    queryFn: articlesApi.getAll,
    staleTime: 1000 * 60 * 5,   // 5 min — matches Valkey TTL
    retry: 2,
  })
}

// ── Fetch articles by tag ─────────────────────────────────
export function useArticlesByTag(tag) {
  return useQuery({
    queryKey: keys.articlesByTag(tag),
    queryFn: () => articlesApi.getByTag(tag),
    enabled: !!tag,
    staleTime: 1000 * 60 * 5,
  })
}

// ── Fetch raw trend list ──────────────────────────────────
export function useTrends() {
  return useQuery({
    queryKey: keys.trends,
    queryFn: trendsApi.getRawTrends,
    staleTime: 1000 * 60 * 30,  // 30 min — matches Valkey TTL
  })
}

// ── Trigger full pipeline (scrape → Claude → save) ───────
export function useGenerateArticles() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: trendsApi.generateAndSave,
    onSuccess: () => {
      // Invalidate articles cache so fresh data loads
      qc.invalidateQueries({ queryKey: keys.articles })
    },
  })
}

// ── Refresh trends cache ──────────────────────────────────
export function useRefreshCache() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: trendsApi.refreshCache,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.trends })
    },
  })
}

// ── AI Search ─────────────────────────────────────────────
export function useAiSearch() {
  return useMutation({
    mutationFn: (query) => searchApi.aiSearch(query),
  })
}