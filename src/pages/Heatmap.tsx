import { useCryptoMarkets } from '@/hooks/useCryptoMarkets'
import MarketHeatmap from '@/components/MarketHeatmap'

const Heatmap = () => {
  const { data: coins = [] } = useCryptoMarkets()
  return (
    <section className="w-full mt-8 mb-24">
      <MarketHeatmap coins={coins} />
    </section>
  )
}

export default Heatmap
