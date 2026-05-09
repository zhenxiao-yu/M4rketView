import { useState, type ReactNode, type FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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
import Disclaimer from '@/components/ui/Disclaimer'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { dialogContent } from '@/lib/motion'

const HighLowBar = ({
  current, high, low, currency,
}: { current: number; high: number; low: number; currency: string }) => {
  const range = high - low
  const pos = range > 0 ? Math.min(100, Math.max(0, ((current - low) / range) * 100)) : 50
  return (
    <div className="w-full mt-1">
      <div className="relative h-1.5 rounded-full bg-gradient-to-r from-danger via-yellow-400 to-success">
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white border-2 border-border shadow"
          style={{ left: `calc(${pos}% - 5px)` }}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-muted">
        <span>{formatCurrency(low, currency)}</span>
        <span>24H Range</span>
        <span>{formatCurrency(high, currency)}</span>
      </div>
    </div>
  )
}

const MetricRow = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="flex justify-between items-center py-2 border-b border-border/20">
    <span className="text-sm text-muted capitalize">{label}</span>
    <span className="text-sm font-semibold">{value}</span>
  </div>
)

const CoinDetailSkeleton = () => (
  <div className="w-full space-y-4 p-6">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-12 w-64" />
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
    </div>
  </div>
)

interface AlertModalProps {
  open: boolean
  onClose: () => void
  coinName: string
  currentPrice: number
  currency: string
  onSubmit: (target: number, direction: 'above' | 'below') => void
}

const AlertModal = ({
  open, onClose, coinName, currentPrice, currency, onSubmit,
}: AlertModalProps) => {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
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
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              <motion.div
                variants={dialogContent}
                initial="initial"
                animate="animate"
                exit="exit"
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100vw-1.5rem)] max-w-sm bg-surface border border-border/30 rounded-2xl p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title className="text-base font-bold flex items-center gap-2">
                    <Bell size={16} className="text-accent" />
                    Set Price Alert — {coinName}
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <Button variant="ghost" size="icon-sm" aria-label="Close">
                      <X size={18} />
                    </Button>
                  </Dialog.Close>
                </div>

                <p className="text-sm text-muted mb-4">
                  Current price:{' '}
                  <span className="text-accent font-semibold">{formatCurrency(currentPrice, currency)}</span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs text-muted mb-1.5 uppercase tracking-wide font-semibold">
                      Target price ({currency.toUpperCase()})
                    </label>
                    <Input
                      type="number"
                      inputMode="decimal"
                      step="any"
                      min="0"
                      value={value}
                      onChange={(e) => { setValue(e.target.value); setError('') }}
                      placeholder={currentPrice != null ? `e.g. ${(currentPrice * 1.1).toFixed(2)}` : 'Enter price'}
                      autoFocus
                    />
                    {error && <p className="text-danger text-xs mt-1">{error}</p>}
                    {value && !isNaN(parseFloat(value)) && parseFloat(value) > 0 && (
                      <p className="text-xs text-muted mt-1">
                        Alert when price goes{' '}
                        <span className={parseFloat(value) > currentPrice ? 'text-success font-semibold' : 'text-danger font-semibold'}>
                          {parseFloat(value) > currentPrice ? 'above ▲' : 'below ▼'}
                        </span>{' '}
                        {formatCurrency(parseFloat(value), currency)}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Dialog.Close asChild>
                      <Button type="button" variant="ghost">Cancel</Button>
                    </Dialog.Close>
                    <Button type="submit">Set Alert</Button>
                  </div>
                </form>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
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
      <p className="text-danger text-lg">{error?.message || 'Coin not found'}</p>
      <Button variant="link" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Go back
      </Button>
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
      <Button variant="secondary" size="default" onClick={() => navigate(-1)} className="mb-6" aria-label="Go back">
        <ArrowLeft size={16} /> Back
      </Button>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT PANEL */}
        <div className="lg:w-[42%] flex flex-col gap-4">
          {/* Header */}
          <Card tone="muted" padding="md" className="flex flex-wrap items-center gap-3">
            <img src={data.image.large} alt={data.name} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold truncate max-w-full">{data.name}</h1>
                <Badge tone="default" uppercase>{data.symbol}</Badge>
                <Badge tone="muted">#{data.market_cap_rank}</Badge>
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-lg sm:text-xl font-bold">{formatCurrency(price, currency)}</span>
                <Badge tone={isUp ? 'success' : 'destructive'}>{formatPercent(pct24h)}</Badge>
              </div>
            </div>

            <div className="flex gap-2 ml-auto">
              <Button
                variant={saved ? 'primary' : 'outline'}
                size="icon"
                onClick={() => toggleCoin(data.id)}
                className={saved ? 'bg-accent/10 border border-accent text-accent hover:bg-accent/20' : ''}
                aria-label={saved ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                {saved ? <Star size={18} fill="currentColor" /> : <StarOff size={18} />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setAlertOpen(true)}
                aria-label="Set price alert"
              >
                <Bell size={18} />
              </Button>
            </div>
          </Card>

          {/* Price range */}
          <Card tone="muted" padding="md">
            <HighLowBar current={price} high={high24h} low={low24h} currency={currency} />
          </Card>

          {/* Metrics */}
          <Card tone="muted" padding="md">
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
                  <span className="text-success">{data.sentiment_votes_up_percentage?.toFixed(1) ?? '—'}% ▲</span>
                  <span className="text-danger">{data.sentiment_votes_down_percentage?.toFixed(1) ?? '—'}% ▼</span>
                </span>
              }
            />
          </Card>

          {/* Links */}
          <Card tone="muted" padding="md" className="flex flex-col gap-2">
            {data.links.homepage[0] && (
              <a href={data.links.homepage[0]} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors">
                <Globe size={14} /> {data.links.homepage[0].replace(/^https?:\/\//, '').replace(/\/$/, '').substring(0, 35)}
              </a>
            )}
            {data.links.blockchain_site[0] && (
              <a href={data.links.blockchain_site[0]} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors">
                <ExternalLink size={14} /> Explorer
              </a>
            )}
            <div className="flex gap-3 mt-1">
              {data.links.repos_url.github[0] && (
                <a href={data.links.repos_url.github[0]} target="_blank" rel="noreferrer"
                  className="text-muted hover:text-accent transition-colors">
                  <Github size={18} />
                </a>
              )}
              {data.links.twitter_screen_name && (
                <a href={`https://twitter.com/${data.links.twitter_screen_name}`} target="_blank" rel="noreferrer"
                  className="text-muted hover:text-accent transition-colors">
                  <Twitter size={18} />
                </a>
              )}
              {data.links.subreddit_url && (
                <a href={data.links.subreddit_url} target="_blank" rel="noreferrer"
                  className="text-muted hover:text-accent transition-colors">
                  <MessageCircle size={18} />
                </a>
              )}
              {data.links.facebook_username && (
                <a href={`https://facebook.com/${data.links.facebook_username}`} target="_blank" rel="noreferrer"
                  className="text-muted hover:text-accent transition-colors">
                  <Facebook size={18} />
                </a>
              )}
            </div>
          </Card>
        </div>

        {/* RIGHT PANEL — Chart */}
        <Card tone="muted" padding="md" className="lg:w-[58%] p-3 sm:p-4 h-[420px] sm:h-[460px] lg:h-[520px] flex flex-col">
          <PriceChart coinId={data.id} />
        </Card>
      </div>

      <AlertModal
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        coinName={data.name}
        currentPrice={price}
        currency={currency}
        onSubmit={handleAlertSubmit}
      />
      <Disclaimer className="mt-6" />
    </main>
  )
}

export default CoinDetail
