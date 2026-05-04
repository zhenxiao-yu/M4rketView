import { RefreshCw } from 'lucide-react'
import { useTrending } from '@/hooks/useTrending'
import TrendingCoin from '@/components/TrendingCoin'
import { useQueryClient } from '@tanstack/react-query'

const TrendingSkeleton = () => (
  <>
    {Array.from({ length: 7 }).map((_, i) => (
      <div key={i} className="w-full sm:w-[48%] lg:w-[30%] bg-gray-200 mb-6 rounded-lg p-6 animate-pulse">
        <div className="h-4 bg-gray-100/30 rounded w-3/4 mb-3" />
        <div className="h-4 bg-gray-100/30 rounded w-1/2 mb-3" />
        <div className="h-4 bg-gray-100/30 rounded w-2/3 mb-3" />
        <div className="h-4 bg-gray-100/30 rounded w-1/3" />
      </div>
    ))}
  </>
)

const Trending = () => {
  const { data, isLoading, error } = useTrending()
  const queryClient = useQueryClient()

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['trending'] })

  return (
    <section className="w-full mt-8 mb-24 relative">
      <button
        className="absolute right-0 -top-10 text-cyan hover:scale-110 transition-transform"
        onClick={refresh}
        title="Refresh trending"
      >
        <RefreshCw size={20} />
      </button>

      <div className="w-full min-h-[60vh] py-8 flex flex-wrap justify-evenly border border-gray-100 rounded-xl">
        {error ? (
          <p className="text-red text-lg self-center">{error.message}</p>
        ) : isLoading ? (
          <TrendingSkeleton />
        ) : (
          data?.map((coin) => (
            <TrendingCoin key={coin.item.coin_id} data={coin.item} />
          ))
        )}
      </div>
    </section>
  )
}

export default Trending
