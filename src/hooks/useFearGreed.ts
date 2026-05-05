import { useQuery } from '@tanstack/react-query'
import { fetchFearGreed } from '@/api/coinGecko'

export function useFearGreed() {
  return useQuery({
    queryKey: ['feargreed'],
    queryFn: fetchFearGreed,
    staleTime: 60 * 60 * 1000,   // updates once per day
  })
}
