import { useQuery } from '@tanstack/react-query'
import { fetchNews } from '@/api/newsApi'
import type { NewsItem } from '@/types/news'
import { STALE_15MIN, CACHE_30MIN } from '@/lib/queryTimings'

export function useNewsFeeds() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
    staleTime: STALE_15MIN,
    gcTime: CACHE_30MIN,
  })

  const items: NewsItem[] = (data ?? [])
    .filter((item, idx, arr) => arr.findIndex((x) => x.title === item.title) === idx)

  return { items, isLoading, isError }
}
