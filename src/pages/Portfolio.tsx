import { useState } from 'react'
import { PlusCircle, Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import { motion } from 'framer-motion'
import ErrorCard from '@/components/ui/ErrorCard'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { usePortfolioStore } from '@/store/portfolioStore'
import { usePortfolioData } from '@/hooks/usePortfolioData'
import { useMarketStore } from '@/store/marketStore'
import { formatCurrency, formatPercent, formatCompact } from '@/lib/utils'
import { useSearchCoins } from '@/hooks/useSearchCoins'
import { useDebounce } from '@/hooks/useDebounce'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { staggerContainer, staggerChild } from '@/lib/motion'

const COLORS = ['#B6EADA', '#5B8FB9', '#301E67', '#1ec471', '#e72179', '#f97316', '#eab308']

const AddCoinForm = () => {
  const [searchText, setSearchText] = useState('')
  const [selected, setSelected] = useState<{ id: string; name: string; symbol: string; image: string } | null>(null)
  const [quantity, setQuantity] = useState('')
  const [avgPrice, setAvgPrice] = useState('')
  const debouncedQuery = useDebounce(searchText, 300)
  const { data: searchData } = useSearchCoins(debouncedQuery)
  const { addEntry, hasEntry } = usePortfolioStore()

  const handleAdd = () => {
    if (!selected || !quantity || !avgPrice) return
    const qty = parseFloat(quantity)
    const price = parseFloat(avgPrice)
    if (isNaN(qty) || isNaN(price) || qty <= 0 || price <= 0) return
    addEntry({
      coinId: selected.id,
      coinName: selected.name,
      coinSymbol: selected.symbol,
      coinImage: selected.image,
      quantity: qty,
      avgBuyPrice: price,
    })
    setSelected(null)
    setSearchText('')
    setQuantity('')
    setAvgPrice('')
  }

  return (
    <Card className="mb-6">
      <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
        <PlusCircle size={16} className="text-cyan" /> Add Coin
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center gap-2 sm:gap-3">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search coin..."
            value={selected ? `${selected.name} (${selected.symbol.toUpperCase()})` : searchText}
            onChange={(e) => { setSearchText(e.target.value); setSelected(null) }}
          />
          {!selected && searchText.length >= 2 && searchData && (
            <ul className="absolute top-12 left-0 w-full max-h-48 overflow-y-auto bg-gray-200 border border-gray-100/30 rounded-lg z-10 shadow-xl">
              {searchData.slice(0, 8).map((coin) => (
                <li
                  key={coin.id}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100/20 text-sm"
                  onClick={() => setSelected({ id: coin.id, name: coin.name, symbol: coin.symbol, image: coin.large })}
                >
                  <img src={coin.thumb} alt={coin.name} className="w-4 h-4 rounded-full" />
                  {coin.name} <span className="text-gray-100 uppercase text-xs">{coin.symbol}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Input
          type="number"
          inputMode="decimal"
          step="any"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min={0}
          className="sm:w-28"
        />
        <Input
          type="number"
          inputMode="decimal"
          step="any"
          placeholder="Avg buy price ($)"
          value={avgPrice}
          onChange={(e) => setAvgPrice(e.target.value)}
          min={0}
          className="sm:w-40"
        />
        <Button
          onClick={handleAdd}
          disabled={!selected || !quantity || !avgPrice}
          size="lg"
        >
          Add
        </Button>
      </div>
      {selected && hasEntry(selected.id) && (
        <p className="text-xs text-yellow-400 mt-2">⚠ This coin is already in your portfolio. Adding will create a duplicate entry.</p>
      )}
    </Card>
  )
}

const Portfolio = () => {
  const { entries, removeEntry } = usePortfolioStore()
  const { currency } = useMarketStore()
  const { data: prices, isLoading, error, refetch } = usePortfolioData()

  const priceMap = new Map(prices?.map((c) => [c.id, c.current_price]) ?? [])

  const enriched = entries.map((e) => {
    const currentPrice = priceMap.get(e.coinId)
    const currentValue = currentPrice != null ? currentPrice * e.quantity : null
    const invested = e.avgBuyPrice * e.quantity
    const pnl = currentValue != null ? currentValue - invested : null
    const pnlPct = currentValue != null ? ((currentValue - invested) / invested) * 100 : null
    return { ...e, currentPrice, currentValue, invested, pnl, pnlPct }
  })

  const totalValue = enriched.reduce((sum, e) => sum + (e.currentValue ?? 0), 0)
  const totalInvested = enriched.reduce((sum, e) => sum + e.invested, 0)
  const totalPnl = totalValue - totalInvested
  const totalPnlPct = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0

  const pieData = enriched
    .filter((e) => e.currentValue != null && e.currentValue > 0)
    .map((e) => ({ name: e.coinSymbol.toUpperCase(), value: e.currentValue! }))

  if (entries.length === 0) {
    return (
      <section className="w-full mt-8 mb-24">
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 border border-gray-100 rounded-xl">
          <p className="text-lg text-gray-100">Your portfolio is empty.</p>
          <AddCoinForm />
        </div>
      </section>
    )
  }

  return (
    <section className="w-full mt-8 mb-24">
      <h1 className="text-xl font-bold mb-6">Portfolio</h1>

      {/* Summary */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
      >
        <motion.div variants={staggerChild}>
          <Card>
            <p className="text-sm text-gray-100">Total Value</p>
            <p className="text-2xl font-bold mt-1">{formatCurrency(totalValue, currency)}</p>
          </Card>
        </motion.div>
        <motion.div variants={staggerChild}>
          <Card>
            <p className="text-sm text-gray-100">Invested</p>
            <p className="text-2xl font-bold mt-1">{formatCurrency(totalInvested, currency)}</p>
          </Card>
        </motion.div>
        <motion.div variants={staggerChild}>
          <Card>
            <p className="text-sm text-gray-100">Total P&L</p>
            <p className={`text-2xl font-bold mt-1 ${totalPnl >= 0 ? 'text-green' : 'text-red'}`}>
              {totalPnl >= 0 ? '+' : ''}{formatCurrency(totalPnl, currency)}
              <span className="text-sm ml-2">{formatPercent(totalPnlPct)}</span>
            </p>
          </Card>
        </motion.div>
      </motion.div>

      <AddCoinForm />

      {error && <ErrorCard error={error as Error} onRetry={() => refetch()} compact />}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          {/* Mobile cards — below md */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="md:hidden flex flex-col gap-2"
          >
            {enriched.map((e) => {
              const pnlPos = e.pnl != null && e.pnl >= 0
              return (
                <motion.div key={e.coinId} variants={staggerChild}>
                  <Card padding="sm">
                  <div className="flex items-center gap-3">
                    <img src={e.coinImage} alt={e.coinName} className="w-8 h-8 rounded-full shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{e.coinName}</p>
                      <p className="text-xs text-gray-100 uppercase">{e.coinSymbol}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-mono font-semibold">
                        {e.currentValue != null ? formatCurrency(e.currentValue, currency) : '—'}
                      </p>
                      <p className={`text-xs font-semibold ${pnlPos ? 'text-green' : 'text-red'}`}>
                        {e.pnl != null ? (
                          <span className="inline-flex items-center gap-0.5">
                            {pnlPos ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                            {formatPercent(e.pnlPct ?? 0)}
                          </span>
                        ) : '—'}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEntry(e.coinId)}
                      className="ml-1 hover:text-red hover:bg-red/10"
                      aria-label={`Remove ${e.coinName} from portfolio`}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-gray-100/70">Qty</p>
                      <p className="font-mono">{e.quantity}</p>
                    </div>
                    <div>
                      <p className="text-gray-100/70">Avg buy</p>
                      <p className="font-mono">{formatCurrency(e.avgBuyPrice, currency)}</p>
                    </div>
                    <div>
                      <p className="text-gray-100/70">Current</p>
                      <p className="font-mono">
                        {isLoading ? '...' : e.currentPrice != null ? formatCurrency(e.currentPrice, currency) : '—'}
                      </p>
                    </div>
                  </div>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Desktop table — md+ */}
          <div className="hidden md:block border border-gray-100 rounded-xl overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="text-xs text-gray-100 border-b border-gray-100 bg-gray-200/30">
                <tr>
                  <th className="py-3 px-3 text-left">Coin</th>
                  <th className="py-3 px-3">Qty</th>
                  <th className="py-3 px-3">Avg Price</th>
                  <th className="py-3 px-3">Current</th>
                  <th className="py-3 px-3">Value</th>
                  <th className="py-3 px-3">P&L</th>
                  <th className="py-3 px-3"></th>
                </tr>
              </thead>
              <tbody>
                {enriched.map((e) => (
                  <tr key={e.coinId} className="text-center text-sm border-b border-gray-100 hover:bg-gray-200/50 last:border-b-0">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <img src={e.coinImage} alt={e.coinName} className="w-5 h-5 rounded-full" />
                        <span className="font-medium">{e.coinSymbol.toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">{e.quantity}</td>
                    <td className="py-3 px-3">{formatCurrency(e.avgBuyPrice, currency)}</td>
                    <td className="py-3 px-3">
                      {isLoading ? '...' : e.currentPrice != null ? formatCurrency(e.currentPrice, currency) : '—'}
                    </td>
                    <td className="py-3 px-3">{e.currentValue != null ? formatCurrency(e.currentValue, currency) : '—'}</td>
                    <td className={`py-3 px-3 ${e.pnl != null && e.pnl >= 0 ? 'text-green' : 'text-red'}`}>
                      {e.pnl != null ? (
                        <span className="flex items-center justify-center gap-0.5">
                          {e.pnl >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {formatPercent(e.pnlPct ?? 0)}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => removeEntry(e.coinId)}
                        className="text-gray-100 hover:text-red transition-colors"
                        aria-label={`Remove ${e.coinName} from portfolio`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pie chart */}
        {pieData.length > 0 && (
          <Card className="lg:w-72">
            <h3 className="text-sm font-semibold mb-3">Allocation</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" nameKey="name">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => formatCompact(v)} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="mt-2 space-y-1">
              {pieData.map((d, i) => (
                <li key={d.name} className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span>{d.name}</span>
                  <span className="ml-auto text-gray-100">{((d.value / totalValue) * 100).toFixed(1)}%</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </section>
  )
}

export default Portfolio
