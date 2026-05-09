import { Link } from 'react-router-dom'
import { hoverScale } from '@/lib/motion'
import { cn } from '@/lib/utils'
import type { TrendingCoinItem } from '@/types/coingecko'

interface TrendingCoinProps {
  data: TrendingCoinItem
}

const TrendingCoin = ({ data }: TrendingCoinProps) => {
  return (
    <Link
      to={`/coin/${data.id}`}
      className={cn(
        'block w-full bg-gray-200 rounded-lg p-5 sm:p-6 pr-20 sm:pr-24 relative shadow-md',
        'hover:bg-gray-100 hover:bg-opacity-60',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60',
        hoverScale,
      )}
      aria-label={`View details for ${data.name}`}
    >
      <h3 className="text-base flex items-center my-1">
        <span className="text-gray-100 font-medium capitalize">Name:&nbsp;</span>
        <span className="text-cyan font-bold">{data.name}</span>
        <img src={data.small} alt="" aria-hidden="true" className="w-6 h-6 mx-2 rounded-full border border-gray-100" />
      </h3>

      <h3 className="text-base flex items-center my-1">
        <span className="text-gray-100 font-medium capitalize">Market Cap Rank:&nbsp;</span>
        <span className="text-cyan font-bold">{data.market_cap_rank}</span>
      </h3>

      <h3 className="text-base flex items-center my-1">
        <span className="text-gray-100 font-medium capitalize">Price (BTC):&nbsp;</span>
        <span className="text-cyan font-bold">
          ₿ {Number(data.price_btc).toExponential(4)}
        </span>
      </h3>

      <h3 className="text-base flex items-center my-1">
        <span className="text-gray-100 font-medium capitalize">Score:&nbsp;</span>
        <span className="text-cyan font-bold">{data.score}</span>
      </h3>

      <img
        src={data.large}
        alt=""
        aria-hidden="true"
        className="w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 rounded-full absolute top-1/2 right-3 sm:right-4 -translate-y-1/2 shadow-lg opacity-90 pointer-events-none object-cover"
      />
    </Link>
  )
}

export default TrendingCoin
