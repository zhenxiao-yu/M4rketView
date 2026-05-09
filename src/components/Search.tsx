import { useState } from 'react'
import { Search as SearchIcon, X } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { useSearchCoins } from '@/hooks/useSearchCoins'
import { useMarketStore } from '@/store/marketStore'
import { Spinner } from '@/components/ui/Spinner'

const Search = () => {
  const [searchText, setSearchText] = useState('')
  const { setCoinSearch } = useMarketStore()
  const debouncedQuery = useDebounce(searchText, 300)
  const { data: searchData, isFetching } = useSearchCoins(debouncedQuery)

  const selectCoin = (coinId: string) => {
    setCoinSearch(coinId)
    setSearchText('')
  }

  const clearSearch = () => {
    setSearchText('')
    setCoinSearch('')
  }

  return (
    <div className="relative flex-1 min-w-[180px] sm:flex-none sm:w-72">
      <div className="relative flex items-center">
        <SearchIcon size={14} className="absolute left-2 text-muted pointer-events-none" />
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search coins..."
          className="w-full rounded bg-surface placeholder:text-muted pl-7 pr-7 py-1 outline-none border border-transparent focus:border-accent text-sm"
        />
        {searchText && (
          <button onClick={clearSearch} className="absolute right-2 text-muted hover:text-accent">
            <X size={14} />
          </button>
        )}
      </div>

      {searchText.length >= 2 && (
        <ul
          role="listbox"
          aria-label="Search results"
          className="absolute top-9 left-0 w-full max-h-72 rounded-lg overflow-y-auto z-50 bg-surface bg-opacity-95 backdrop-blur-md border border-border scrollbar-thin scrollbar-thumb-border-strong scrollbar-track-surface"
        >
          {isFetching ? (
            <li className="flex items-center justify-center py-6 gap-2">
              <Spinner size="sm" label="Searching" />
              <span className="text-sm text-muted">Searching...</span>
            </li>
          ) : searchData && searchData.length > 0 ? (
            searchData.slice(0, 20).map((coin) => (
              <li key={coin.id} role="option" aria-selected={false}>
                <button
                  type="button"
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-muted/20 transition-colors focus-visible:outline-none focus-visible:bg-muted/20"
                  onClick={() => selectCoin(coin.id)}
                >
                  <img src={coin.thumb} alt="" aria-hidden="true" className="w-5 h-5 rounded-full" />
                  <span className="text-sm font-medium">{coin.name}</span>
                  <span className="text-xs text-muted uppercase ml-auto">{coin.symbol}</span>
                </button>
              </li>
            ))
          ) : (
            <li className="py-4 text-center text-sm text-muted">No results found</li>
          )}
        </ul>
      )}
    </div>
  )
}

export default Search
