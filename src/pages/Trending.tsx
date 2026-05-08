import { RefreshCw } from 'lucide-react'
import { useTrending } from '@/hooks/useTrending'
import TrendingCoin from '@/components/TrendingCoin'
import { useQueryClient } from '@tanstack/react-query'

const TrendingSkeleton = () => (
  <>
    {Array.from({ length: 7 }).map((_, i) => (
      <div key={i} className="bg-gray-200 rounded-lg p-6 animate-pulse">
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
    <section className="w-full mt-8 mb-24">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-bold">Trending</h1>
        <button
          className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-cyan hover:scale-110 transition-transform"
          onClick={refresh}
          aria-label="Refresh trending"
          title="Refresh trending"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="w-full min-h-[60vh] p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border border-gray-100 rounded-xl">
        {error ? (
          <p className="text-red text-lg col-span-full self-center text-center">{error.message}</p>
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
