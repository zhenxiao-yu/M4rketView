import { useQueries } from '@tanstack/react-query'
import { fetchNewsFeed } from '@/api/newsApi'
import type { NewsItem, NewsSource } from '@/types/news'

const SOURCES: NewsSource[] = ['coindesk', 'cointelegraph', 'decrypt']

export function useNewsFeeds() {
  const results = useQueries({
    queries: SOURCES.map((source) => ({
      queryKey: ['news', source],
      queryFn: () => fetchNewsFeed(source),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    })),
  })

  const isLoading = results.some((r) => r.isLoading)
  const isError = results.every((r) => r.isError)

  const items: NewsItem[] = results
    .flatMap((r) => r.data ?? [])
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .filter((item, idx, arr) => arr.findIndex((x) => x.title === item.title) === idx)

  return { items, isLoading, isError }
}
