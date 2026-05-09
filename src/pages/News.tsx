import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Newspaper, Search } from 'lucide-react'
import { useNewsFeeds } from '@/hooks/useNewsFeeds'
import ErrorCard from '@/components/ui/ErrorCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { staggerContainer, staggerChild } from '@/lib/motion'
import type { NewsItem } from '@/types/news'

const SOURCE_PALETTE = [
  'bg-blue-500/20 text-blue-300',
  'bg-purple-500/20 text-purple-300',
  'bg-orange-500/20 text-orange-300',
  'bg-emerald-500/20 text-emerald-300',
  'bg-pink-500/20 text-pink-300',
  'bg-yellow-500/20 text-yellow-300',
]

function sourceColor(source: string, sources: string[]): string {
  const idx = sources.indexOf(source)
  return SOURCE_PALETTE[idx % SOURCE_PALETTE.length] ?? SOURCE_PALETTE[0]
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

const SkeletonCard = () => (
  <Card padding="none" className="overflow-hidden">
    <Skeleton className="w-full h-36 rounded-none" />
    <div className="p-4 flex flex-col gap-2">
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  </Card>
)

const NewsCard = ({ item, sources }: { item: NewsItem; sources: string[] }) => {
  const hasThumbnail = item.thumbnail && item.thumbnail.startsWith('http')
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-surface/40 rounded-xl border border-border/20 overflow-hidden flex flex-col hover:border-accent/40 transition-colors group"
    >
      {hasThumbnail ? (
        <img
          src={item.thumbnail}
          alt=""
          aria-hidden="true"
          className="w-full h-36 object-cover"
          loading="lazy"
          onError={(e) => {
            const parent = (e.target as HTMLImageElement).parentElement
            if (parent) {
              ;(e.target as HTMLImageElement).remove()
              const div = document.createElement('div')
              div.className = 'w-full h-36 bg-gradient-to-br from-accent/20 to-purple-500/20'
              parent.insertBefore(div, parent.firstChild)
            }
          }}
        />
      ) : (
        <div className="w-full h-36 bg-gradient-to-br from-accent/20 to-purple-500/20" />
      )}

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sourceColor(item.source, sources)}`}>
            {item.source}
          </span>
          <span className="text-xs text-muted">{timeAgo(item.pubDate)}</span>
        </div>

        <h3 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-accent transition-colors">
          {item.title}
        </h3>

        {item.description && (
          <p className="text-xs text-muted line-clamp-3 leading-relaxed">{item.description}</p>
        )}

        <div className="mt-auto pt-1 flex items-center gap-1 text-xs text-accent font-medium">
          Read <ExternalLink size={11} />
        </div>
      </div>
    </a>
  )
}

const News = () => {
  const { items, isLoading, isError } = useNewsFeeds()
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  const sources = useMemo(
    () => Array.from(new Set(items.map((i) => i.source))).sort(),
    [items],
  )

  const filtered = items.filter((item) => {
    if (sourceFilter !== 'all' && item.source !== sourceFilter) return false
    if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <section className="w-full mt-8 mb-24">
      <h1 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Newspaper size={20} className="text-accent" />
        Crypto News
      </h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={sourceFilter === 'all' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSourceFilter('all')}
          >
            All
          </Button>
          {sources.map((s) => (
            <Button
              key={s}
              variant={sourceFilter === s ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSourceFilter(s)}
            >
              {s}
            </Button>
          ))}
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted z-10 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 py-1.5 min-h-[36px]"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : isError ? (
        <ErrorCard error={new Error('Failed to load news. Please try again later.')} minHeight="min-h-[30vh]" />
      ) : filtered.length === 0 ? (
        <p className="text-muted text-sm text-center py-16">No articles found.</p>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filtered.map((item) => (
            <motion.div key={item.guid} variants={staggerChild}>
              <NewsCard item={item} sources={sources} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  )
}

export default News
