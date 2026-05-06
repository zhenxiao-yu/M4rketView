import { useQuery } from '@tanstack/react-query'
import { fetchNews } from '@/api/newsApi'
import type { NewsItem } from '@/types/news'

export function useNewsFeeds() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })

  const items: NewsItem[] = (data ?? [])
    .filter((item, idx, arr) => arr.findIndex((x) => x.title === item.title) === idx)

  return { items, isLoading, isError }
}
