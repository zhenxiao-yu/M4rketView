import { useState } from 'react'
import { PlusCircle, Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import ErrorCard from '@/components/ui/ErrorCard'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { usePortfolioStore } from '@/store/portfolioStore'
import { usePortfolioData } from '@/hooks/usePortfolioData'
import { useMarketStore } from '@/store/marketStore'
import { formatCurrency, formatPercent, formatCompact } from '@/lib/utils'
import { useSearchCoins } from '@/hooks/useSearchCoins'
import { useDebounce } from '@/hooks/useDebounce'

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
    <div className="bg-gray-200/40 rounded-xl p-5 border border-gray-100/20 mb-6">
      <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
        <PlusCircle size={16} className="text-cyan" /> Add Coin
      </h3>
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[160px]">
          <input
            type="text"
            placeholder="Search coin..."
            value={selected ? `${selected.name} (${selected.symbol.toUpperCase()})` : searchText}
            onChange={(e) => { setSearchText(e.target.value); setSelected(null) }}
            className="w-full rounded bg-gray-200 placeholder:text-gray-100 px-3 py-2 outline-none border border-transparent focus:border-cyan text-sm"
          />
          {!selected && searchText.length >= 2 && searchData && (
            <ul className="absolute top-10 left-0 w-full max-h-48 overflow-y-auto bg-gray-200 border border-gray-100 rounded-lg z-10">
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
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min={0}
          className="w-28 rounded bg-gray-200 placeholder:text-gray-100 px-3 py-2 outline-none border border-transparent focus:border-cyan text-sm"
        />
        <input
          type="number"
          placeholder="Avg buy price ($)"
          value={avgPrice}
          onChange={(e) => setAvgPrice(e.target.value)}
          min={0}
          className="w-40 rounded bg-gray-200 placeholder:text-gray-100 px-3 py-2 outline-none border border-transparent focus:border-cyan text-sm"
        />
        <button
          onClick={handleAdd}
          disabled={!selected || !quantity || !avgPrice}
          className="px-4 py-2 bg-cyan text-gray-300 rounded-lg text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan/80 transition-colors"
        >
          Add
        </button>
      </div>
      {selected && hasEntry(selected.id) && (
        <p className="text-xs text-yellow-400 mt-2">⚠ This coin is already in your portfolio. Adding will create a duplicate entry.</p>
      )}
    </div>
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-200/40 rounded-xl p-5 border border-gray-100/20">
          <p className="text-sm text-gray-100">Total Value</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(totalValue, currency)}</p>
        </div>
        <div className="bg-gray-200/40 rounded-xl p-5 border border-gray-100/20">
          <p className="text-sm text-gray-100">Invested</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(totalInvested, currency)}</p>
        </div>
        <div className={`bg-gray-200/40 rounded-xl p-5 border border-gray-100/20`}>
          <p className="text-sm text-gray-100">Total P&L</p>
          <p className={`text-2xl font-bold mt-1 ${totalPnl >= 0 ? 'text-green' : 'text-red'}`}>
            {totalPnl >= 0 ? '+' : ''}{formatCurrency(totalPnl, currency)}
            <span className="text-sm ml-2">{formatPercent(totalPnlPct)}</span>
          </p>
        </div>
      </div>

      <AddCoinForm />

      {error && <ErrorCard error={error as Error} onRetry={() => refetch()} compact />}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Table */}
        <div className="flex-1 border border-gray-100 rounded-xl overflow-x-auto">
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
                    <button onClick={() => removeEntry(e.coinId)} className="text-gray-100 hover:text-red transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pie chart */}
        {pieData.length > 0 && (
          <div className="lg:w-72 bg-gray-200/40 rounded-xl p-5 border border-gray-100/20">
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
          </div>
        )}
      </div>
    </section>
  )
}

export default Portfolio
