import { useQuery } from '@tanstack/react-query'
import { fetchGlobalData } from '@/api/coinGecko'

export function useGlobalData() {
  return useQuery({
    queryKey: ['global'],
    queryFn: fetchGlobalData,
    staleTime: 5 * 60 * 1000,
  })
}
