import { useState } from 'react'
import { ExternalLink, Newspaper, Search } from 'lucide-react'
import { useNewsFeeds } from '@/hooks/useNewsFeeds'
import ErrorCard from '@/components/ui/ErrorCard'
import type { NewsItem, NewsSource } from '@/types/news'

const SOURCE_LABELS: Record<NewsSource | 'all', string> = {
  all: 'All',
  coindesk: 'CoinDesk',
  cointelegraph: 'CoinTelegraph',
  decrypt: 'Decrypt',
}

const SOURCE_COLORS: Record<NewsSource, string> = {
  coindesk: 'bg-blue-500/20 text-blue-300',
  cointelegraph: 'bg-purple-500/20 text-purple-300',
  decrypt: 'bg-orange-500/20 text-orange-300',
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
  <div className="bg-gray-200/40 rounded-xl border border-gray-100/20 overflow-hidden animate-pulse">
    <div className="w-full h-36 bg-gray-100/10" />
    <div className="p-4 flex flex-col gap-2">
      <div className="h-3 bg-gray-100/10 rounded w-1/3" />
      <div className="h-4 bg-gray-100/10 rounded w-full" />
      <div className="h-4 bg-gray-100/10 rounded w-4/5" />
      <div className="h-3 bg-gray-100/10 rounded w-full" />
      <div className="h-3 bg-gray-100/10 rounded w-2/3" />
    </div>
  </div>
)

const NewsCard = ({ item }: { item: NewsItem }) => {
  const hasThumbnail = item.thumbnail && item.thumbnail.startsWith('http')
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-gray-200/40 rounded-xl border border-gray-100/20 overflow-hidden flex flex-col hover:border-cyan/40 transition-colors group"
    >
      {hasThumbnail ? (
        <img
          src={item.thumbnail}
          alt=""
          className="w-full h-36 object-cover"
          onError={(e) => {
            const parent = (e.target as HTMLImageElement).parentElement
            if (parent) {
              (e.target as HTMLImageElement).remove()
              const div = document.createElement('div')
              div.className = 'w-full h-36 bg-gradient-to-br from-cyan/20 to-purple-500/20'
              parent.insertBefore(div, parent.firstChild)
            }
          }}
        />
      ) : (
        <div className="w-full h-36 bg-gradient-to-br from-cyan/20 to-purple-500/20" />
      )}

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SOURCE_COLORS[item.source]}`}>
            {SOURCE_LABELS[item.source]}
          </span>
          <span className="text-xs text-gray-100">{timeAgo(item.pubDate)}</span>
        </div>

        <h3 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-cyan transition-colors">
          {item.title}
        </h3>

        {item.description && (
          <p className="text-xs text-gray-100 line-clamp-3 leading-relaxed">{item.description}</p>
        )}

        <div className="mt-auto pt-1 flex items-center gap-1 text-xs text-cyan font-medium">
          Read <ExternalLink size={11} />
        </div>
      </div>
    </a>
  )
}

const News = () => {
  const { items, isLoading, isError } = useNewsFeeds()
  const [sourceFilter, setSourceFilter] = useState<NewsSource | 'all'>('all')
  const [search, setSearch] = useState('')

  const filtered = items.filter((item) => {
    if (sourceFilter !== 'all' && item.source !== sourceFilter) return false
    if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const sources: (NewsSource | 'all')[] = ['all', 'coindesk', 'cointelegraph', 'decrypt']

  return (
    <section className="w-full mt-8 mb-24">
      <h1 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Newspaper size={20} className="text-cyan" />
        Crypto News
      </h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          {sources.map((s) => (
            <button
              key={s}
              onClick={() => setSourceFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                sourceFilter === s
                  ? 'bg-cyan text-gray-300'
                  : 'bg-gray-200/40 text-gray-100 hover:text-cyan border border-gray-100/20'
              }`}
            >
              {SOURCE_LABELS[s]}
            </button>
          ))}
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-100" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-gray-200/40 border border-gray-100/20 rounded-lg text-sm text-gray-100 placeholder-gray-100/50 focus:outline-none focus:border-cyan/50"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : isError ? (
        <ErrorCard error={new Error('Failed to load news feeds. RSS2JSON may be rate-limited.')} minHeight="min-h-[30vh]" />
      ) : filtered.length === 0 ? (
        <p className="text-gray-100 text-sm text-center py-16">No articles found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => <NewsCard key={item.guid} item={item} />)}
        </div>
      )}
    </section>
  )
}

export default News
