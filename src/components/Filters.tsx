import { useRef, type FormEvent, type ChangeEvent } from 'react'
import { RefreshCw, ArrowRight, ChevronDown } from 'lucide-react'
import { useMarketStore } from '@/store/marketStore'
import Search from './Search'

const SORT_OPTIONS = [
  { value: 'market_cap_desc', label: 'Market Cap ↓' },
  { value: 'market_cap_asc', label: 'Market Cap ↑' },
  { value: 'volume_desc', label: 'Volume ↓' },
  { value: 'volume_asc', label: 'Volume ↑' },
  { value: 'id_desc', label: 'ID ↓' },
  { value: 'id_asc', label: 'ID ↑' },
  { value: 'gecko_desc', label: 'Gecko ↓' },
  { value: 'gecko_asc', label: 'Gecko ↑' },
]

const Filters = () => {
  const { setCurrency, setSortBy, reset } = useMarketStore()
  const currencyRef = useRef<HTMLInputElement>(null)

  const handleCurrencySubmit = (e: FormEvent) => {
    e.preventDefault()
    const val = currencyRef.current?.value.trim()
    if (val) {
      setCurrency(val.toLowerCase())
      if (currencyRef.current) currencyRef.current.value = ''
    }
  }

  const handleSort = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value)
  }

  return (
    <div className="w-full h-12 border-2 border-gray-100 rounded-lg flex items-center justify-between relative">
      <Search />
      <div className="flex items-center mr-4 gap-4">
        <form className="flex items-center font-nunito gap-2" onSubmit={handleCurrencySubmit}>
          <label htmlFor="currency" className="font-bold text-sm whitespace-nowrap">
            currency:
          </label>
          <input
            type="text"
            id="currency"
            name="currency"
            ref={currencyRef}
            placeholder="usd"
            className="w-14 rounded bg-gray-200 placeholder:text-gray-100 px-2 py-0.5 outline-none border border-transparent focus:border-cyan text-sm"
          />
          <button type="submit" className="text-gray-100 hover:text-cyan transition-colors">
            <ArrowRight size={16} />
          </button>
        </form>

        <label className="flex items-center gap-2 relative">
          <span className="font-bold text-sm whitespace-nowrap">sort by:</span>
          <div className="relative">
            <select
              name="sortby"
              className="rounded bg-gray-200 text-sm pl-2 pr-7 py-0.5 focus:outline-none appearance-none cursor-pointer"
              onChange={handleSort}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-gray-100"
            />
          </div>
        </label>

        <button
          className="hover:scale-110 transition-all text-cyan hover:text-white"
          onClick={reset}
          title="Reset filters"
        >
          <RefreshCw size={18} />
        </button>
      </div>
    </div>
  )
}

export default Filters
