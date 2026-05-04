import { useQuery } from '@tanstack/react-query'
import { fetchTrending } from '@/api/coinGecko'

export function useTrending() {
  return useQuery({
    queryKey: ['trending'],
    queryFn: fetchTrending,
    staleTime: 5 * 60 * 1000,
  })
}
