import { useQuery } from '@tanstack/react-query'
import { fetchSearch } from '@/api/coinGecko'

export function useSearchCoins(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => fetchSearch(query),
    enabled: query.trim().length >= 2,
    staleTime: 30 * 1000,
  })
}
