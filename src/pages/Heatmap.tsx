import { useCryptoMarkets } from '@/hooks/useCryptoMarkets'
import MarketHeatmap from '@/components/MarketHeatmap'
import ErrorCard from '@/components/ui/ErrorCard'

const Heatmap = () => {
  const { data: coins = [], error, refetch } = useCryptoMarkets()

  if (error) {
    return (
      <section className="w-full mt-8 mb-24">
        <ErrorCard error={error as Error} onRetry={() => refetch()} />
      </section>
    )
  }

  return (
    <section className="w-full mt-8 mb-24">
      <MarketHeatmap coins={coins} />
    </section>
  )
}

export default Heatmap
