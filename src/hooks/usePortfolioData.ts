import { useQuery } from '@tanstack/react-query'
import { fetchCryptoMarkets } from '@/api/coinGecko'
import { usePortfolioStore } from '@/store/portfolioStore'
import { useMarketStore } from '@/store/marketStore'

export function usePortfolioData() {
  const { entries } = usePortfolioStore()
  const { currency } = useMarketStore()
  const ids = entries.map((e) => e.coinId).join(',')

  return useQuery({
    queryKey: ['portfolio-prices', ids, currency],
    queryFn: () =>
      fetchCryptoMarkets({
        currency,
        sortBy: 'market_cap_desc',
        page: 1,
        perPage: 250,
        ids,
      }),
    enabled: entries.length > 0,
    staleTime: 3 * 60 * 1000,   // 3 min — removed 30s refetchInterval
  })
}
