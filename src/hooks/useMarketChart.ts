import { useQuery } from '@tanstack/react-query'
import { fetchMarketChart } from '@/api/coinGecko'
import type { ChartDays } from '@/types/coingecko'
import { STALE_10MIN } from '@/lib/queryTimings'

export function useMarketChart(id: string | undefined, currency: string, days: ChartDays) {
  return useQuery({
    queryKey: ['chart', id, currency, days],
    queryFn: () => fetchMarketChart(id!, currency, days),
    enabled: !!id,
    staleTime: STALE_10MIN,
  })
}
