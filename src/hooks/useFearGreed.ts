import { useQuery } from '@tanstack/react-query'
import { fetchFearGreed } from '@/api/coinGecko'

export function useFearGreed() {
  return useQuery({
    queryKey: ['feargreed'],
    queryFn: fetchFearGreed,
    staleTime: 10 * 60 * 1000,
  })
}
