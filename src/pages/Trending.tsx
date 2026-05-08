import { motion } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { useTrending } from '@/hooks/useTrending'
import TrendingCoin from '@/components/TrendingCoin'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { staggerContainer, staggerChild } from '@/lib/motion'

const TrendingSkeleton = () => (
  <>
    {Array.from({ length: 7 }).map((_, i) => (
      <div key={i} className="bg-gray-200 rounded-lg p-6 flex flex-col gap-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
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
        <Button variant="ghost" size="icon" onClick={refresh} aria-label="Refresh trending" className="text-cyan">
          <RefreshCw size={20} />
        </Button>
      </div>

      {error ? (
        <div className="w-full min-h-[60vh] p-4 sm:p-6 flex items-center justify-center border border-gray-100 rounded-xl">
          <p className="text-red text-lg text-center">{error.message}</p>
        </div>
      ) : isLoading ? (
        <div className="w-full min-h-[60vh] p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border border-gray-100 rounded-xl">
          <TrendingSkeleton />
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="w-full min-h-[60vh] p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border border-gray-100 rounded-xl"
        >
          {data?.map((coin) => (
            <motion.div key={coin.item.coin_id} variants={staggerChild}>
              <TrendingCoin data={coin.item} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  )
}

export default Trending
