import { useQuery } from '@tanstack/react-query'
import { fetchMarketChart } from '@/api/coinGecko'
import type { ChartDays } from '@/types/coingecko'

export function useMarketChart(id: string | undefined, currency: string, days: ChartDays) {
  return useQuery({
    queryKey: ['chart', id, currency, days],
    queryFn: () => fetchMarketChart(id!, currency, days),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}
