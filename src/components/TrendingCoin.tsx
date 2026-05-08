import { useNavigate } from 'react-router-dom'
import type { TrendingCoinItem } from '@/types/coingecko'

interface TrendingCoinProps {
  data: TrendingCoinItem
}

const TrendingCoin = ({ data }: TrendingCoinProps) => {
  const navigate = useNavigate()

  return (
    <div
      className="w-full bg-gray-200 rounded-lg p-5 sm:p-6 relative overflow-hidden cursor-pointer transition-transform transform hover:scale-[1.02] hover:bg-gray-100 hover:bg-opacity-60 shadow-md"
      onClick={() => navigate(`/coin/${data.id}`)}
    >
      <h3 className="text-base flex items-center my-1">
        <span className="text-gray-100 font-medium capitalize">Name:&nbsp;</span>
        <span className="text-cyan font-bold">{data.name}</span>
        <img src={data.small} alt={data.name} className="w-6 h-6 mx-2 rounded-full border border-gray-100" />
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
        className="w-20 sm:w-[25%] lg:w-[20%] h-auto rounded-full absolute top-1/2 -right-4 sm:-right-6 transform -translate-y-1/2 shadow-lg opacity-90 pointer-events-none"
      />
    </div>
  )
}

export default TrendingCoin
