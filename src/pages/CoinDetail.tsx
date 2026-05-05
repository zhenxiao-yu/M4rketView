import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Github, Twitter, Globe, ExternalLink,
  MessageCircle, Facebook, Bell, Star, StarOff, X,
} from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { useCoinDetail } from '@/hooks/useCoinDetail'
import { useMarketStore } from '@/store/marketStore'
import { useWatchlistStore } from '@/store/watchlistStore'
import { useAlertStore } from '@/store/alertStore'
import { formatCurrency, formatCompact, formatPercent } from '@/lib/utils'
import PriceChart from '@/components/PriceChart'

const HighLowBar = ({
  current, high, low, currency,
}: { current: number; high: number; low: number; currency: string }) => {
  const range = high - low
  const pos = range > 0 ? Math.min(100, Math.max(0, ((current - low) / range) * 100)) : 50
  return (
    <div className="w-full mt-1">
      <div className="relative h-1.5 rounded-full bg-gradient-to-r from-red via-yellow-400 to-green">
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white border-2 border-gray-300 shadow"
          style={{ left: `calc(${pos}% - 5px)` }}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-100">
        <span>{formatCurrency(low, currency)}</span>
        <span>24H Range</span>
        <span>{formatCurrency(high, currency)}</span>
      </div>
    </div>
  )
}

const MetricRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100/20">
    <span className="text-sm text-gray-100 capitalize">{label}</span>
    <span className="text-sm font-semibold">{value}</span>
  </div>
)

const CoinDetailSkeleton = () => (
  <div className="w-full animate-pulse space-y-4 p-6">
    <div className="h-8 bg-gray-200 rounded w-48" />
    <div className="h-12 bg-gray-200 rounded w-64" />
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-16 bg-gray-200 rounded" />
      ))}
    </div>
  </div>
)

interface AlertModalProps {
  open: boolean
  onClose: () => void
  coinName: string
  coinId: string
  coinImage: string
  currentPrice: number
  currency: string
  onSubmit: (target: number, direction: 'above' | 'below') => void
}

const AlertModal = ({
  open, onClose, coinName, coinId: _coinId, coinImage: _coinImage,
  currentPrice, currency, onSubmit,
}: AlertModalProps) => {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const target = parseFloat(value)
    if (isNaN(target) || target <= 0) {
      setError('Enter a valid price greater than 0')
      return
    }
    onSubmit(target, target > currentPrice ? 'above' : 'below')
    setValue('')
    setError('')
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm bg-gray-200 border border-gray-100/30 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-base font-bold flex items-center gap-2">
              <Bell size={16} className="text-cyan" />
              Set Price Alert — {coinName}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-100 hover:text-cyan transition-colors" aria-label="Close">
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <p className="text-sm text-gray-100 mb-4">
            Current price:{' '}
            <span className="text-cyan font-semibold">{formatCurrency(currentPrice, currency)}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-100 mb-1.5 uppercase tracking-wide font-semibold">
                Target price ({currency.toUpperCase()})
              </label>
              <input
                type="number"
                step="any"
                min="0"
                value={value}
                onChange={(e) => { setValue(e.target.value); setError('') }}
                placeholder={currentPrice != null ? `e.g. ${(currentPrice * 1.1).toFixed(2)}` : 'Enter price'}
                className="w-full bg-gray-300/50 border border-gray-100/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan transition-colors"
                autoFocus
              />
              {error && <p className="text-red text-xs mt-1">{error}</p>}
              {value && !isNaN(parseFloat(value)) && parseFloat(value) > 0 && (
                <p className="text-xs text-gray-100 mt-1">
                  Alert when price goes{' '}
                  <span className={parseFloat(value) > currentPrice ? 'text-green font-semibold' : 'text-red font-semibold'}>
                    {parseFloat(value) > currentPrice ? 'above ▲' : 'below ▼'}
                  </span>{' '}
                  {formatCurrency(parseFloat(value), currency)}
                </p>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <Dialog.Close asChild>
                <button type="button" className="px-4 py-2 text-sm rounded-lg bg-gray-300/50 text-gray-100 hover:text-white transition-colors">
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                className="px-4 py-2 text-sm rounded-lg bg-cyan text-gray-300 font-semibold hover:opacity-90 transition-opacity"
              >
                Set Alert
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

const CoinDetail = () => {
  const { coinId } = useParams<{ coinId: string }>()
  const navigate = useNavigate()
  const { currency } = useMarketStore()
  const { toggleCoin, isWatched } = useWatchlistStore()
  const { addAlert } = useAlertStore()
  const { data, isLoading, error } = useCoinDetail(coinId)
  const [alertOpen, setAlertOpen] = useState(false)

  if (isLoading) return (
    <main className="w-full max-w-5xl mx-auto px-4 py-8">
      <CoinDetailSkeleton />
    </main>
  )

  if (error || !data) return (
    <main className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col items-center gap-4">
      <p className="text-red text-lg">{error?.message || 'Coin not found'}</p>
      <button onClick={() => navigate(-1)} className="text-cyan hover:underline flex items-center gap-1">
        <ArrowLeft size={16} /> Go back
      </button>
    </main>
  )

  const price = data.market_data.current_price[currency] ?? data.market_data.current_price['usd']
  const marketCap = data.market_data.market_cap[currency] ?? 0
  const fdv = data.market_data.fully_diluted_valuation[currency] ?? 0
  const volume = data.market_data.total_volume[currency] ?? 0
  const high24h = data.market_data.high_24h[currency] ?? 0
  const low24h = data.market_data.low_24h[currency] ?? 0
  const pct24h = data.market_data.price_change_percentage_24h
  const isUp = pct24h >= 0
  const saved = isWatched(data.id)

  const handleAlertSubmit = (target: number, direction: 'above' | 'below') => {
    addAlert({
      coinId: data.id,
      coinName: data.name,
      coinImage: data.image.thumb,
      targetPrice: target,
      direction,
    })
    if (Notification.permission === 'default') Notification.requestPermission()
  }

  return (
    <main className="w-full max-w-5xl mx-auto px-4 py-8 font-nunito">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-gray-100 hover:text-cyan transition-colors mb-6 text-sm"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT PANEL */}
        <div className="lg:w-[42%] flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center gap-3 bg-gray-200/30 rounded-xl p-4 border border-gray-100/20">
            <img src={data.image.large} alt={data.name} className="w-14 h-14 rounded-full" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{data.name}</h1>
                <span className="text-xs bg-cyan/20 text-cyan px-2 py-0.5 rounded uppercase font-semibold">
                  {data.symbol}
                </span>
                <span className="text-xs bg-gray-200 text-gray-100 px-2 py-0.5 rounded">
                  #{data.market_cap_rank}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-bold">{formatCurrency(price, currency)}</span>
                <span className={`text-sm font-semibold px-1.5 py-0.5 rounded ${isUp ? 'bg-green/20 text-green' : 'bg-red/20 text-red'}`}>
                  {formatPercent(pct24h)}
                </span>
              </div>
            </div>

            <div className="ml-auto flex gap-2">
              <button
                onClick={() => toggleCoin(data.id)}
                className={`p-2 rounded-lg border transition-all ${saved ? 'border-cyan text-cyan bg-cyan/10' : 'border-gray-100 text-gray-100 hover:border-cyan hover:text-cyan'}`}
                title={saved ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                {saved ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
              </button>
              <button
                onClick={() => setAlertOpen(true)}
                className="p-2 rounded-lg border border-gray-100 text-gray-100 hover:border-cyan hover:text-cyan transition-all"
                title="Set price alert"
              >
                <Bell size={16} />
              </button>
            </div>
          </div>

          {/* Price range */}
          <div className="bg-gray-200/30 rounded-xl p-4 border border-gray-100/20">
            <HighLowBar current={price} high={high24h} low={low24h} currency={currency} />
          </div>

          {/* Metrics */}
          <div className="bg-gray-200/30 rounded-xl p-4 border border-gray-100/20">
            <MetricRow label="Market Cap" value={formatCompact(marketCap)} />
            <MetricRow label="Fully Diluted Valuation" value={fdv ? formatCompact(fdv) : '—'} />
            <MetricRow label="24H Volume" value={formatCompact(volume)} />
            <MetricRow label="Circulating Supply" value={formatCompact(data.market_data.circulating_supply)} />
            <MetricRow label="Max Supply" value={data.market_data.max_supply ? formatCompact(data.market_data.max_supply) : '∞'} />
            <MetricRow label="CoinGecko Rank" value={`#${data.coingecko_rank}`} />
            <MetricRow label="CoinGecko Score" value={data.coingecko_score?.toFixed(1) ?? '—'} />
            <MetricRow
              label="Sentiment"
              value={
                <span className="flex gap-2">
                  <span className="text-green">{data.sentiment_votes_up_percentage?.toFixed(1) ?? '—'}% ▲</span>
                  <span className="text-red">{data.sentiment_votes_down_percentage?.toFixed(1) ?? '—'}% ▼</span>
                </span>
              }
            />
          </div>

          {/* Links */}
          <div className="bg-gray-200/30 rounded-xl p-4 border border-gray-100/20 flex flex-col gap-2">
            {data.links.homepage[0] && (
              <a href={data.links.homepage[0]} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 text-sm text-gray-100 hover:text-cyan transition-colors">
                <Globe size={14} /> {data.links.homepage[0].replace(/^https?:\/\//, '').replace(/\/$/, '').substring(0, 35)}
              </a>
            )}
            {data.links.blockchain_site[0] && (
              <a href={data.links.blockchain_site[0]} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 text-sm text-gray-100 hover:text-cyan transition-colors">
                <ExternalLink size={14} /> Explorer
              </a>
            )}
            <div className="flex gap-3 mt-1">
              {data.links.repos_url.github[0] && (
                <a href={data.links.repos_url.github[0]} target="_blank" rel="noreferrer"
                  className="text-gray-100 hover:text-cyan transition-colors">
                  <Github size={18} />
                </a>
              )}
              {data.links.twitter_screen_name && (
                <a href={`https://twitter.com/${data.links.twitter_screen_name}`} target="_blank" rel="noreferrer"
                  className="text-gray-100 hover:text-cyan transition-colors">
                  <Twitter size={18} />
                </a>
              )}
              {data.links.subreddit_url && (
                <a href={data.links.subreddit_url} target="_blank" rel="noreferrer"
                  className="text-gray-100 hover:text-cyan transition-colors">
                  <MessageCircle size={18} />
                </a>
              )}
              {data.links.facebook_username && (
                <a href={`https://facebook.com/${data.links.facebook_username}`} target="_blank" rel="noreferrer"
                  className="text-gray-100 hover:text-cyan transition-colors">
                  <Facebook size={18} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — Chart */}
        <div className="lg:w-[58%] bg-gray-200/30 rounded-xl p-4 border border-gray-100/20 min-h-[400px]">
          <PriceChart coinId={data.id} />
        </div>
      </div>

      <AlertModal
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        coinName={data.name}
        coinId={data.id}
        coinImage={data.image.thumb}
        currentPrice={price}
        currency={currency}
        onSubmit={handleAlertSubmit}
      />
    </main>
  )
}

export default CoinDetail
