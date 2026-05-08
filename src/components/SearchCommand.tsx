import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Command } from 'cmdk'
import { Search, X, TrendingUp } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useSearchCoins } from '@/hooks/useSearchCoins'
import { useDebounce } from '@/hooks/useDebounce'

const SearchCommand = () => {
  const { searchOpen, setSearchOpen } = useUIStore()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const { data: results } = useSearchCoins(debouncedQuery)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [setSearchOpen])

  const close = () => {
    setSearchOpen(false)
    setQuery('')
  }

  const selectCoin = (id: string) => {
    navigate(`/coin/${id}`)
    close()
  }

  if (!searchOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-6 sm:pt-20 px-3 sm:px-4 pb-3 sm:pb-4"
      onClick={(e) => { if (e.target === e.currentTarget) close() }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
      <div className="relative w-full max-w-lg max-h-[calc(100dvh-3rem)] sm:max-h-[80vh] flex flex-col bg-gray-200 border border-cyan/30 rounded-2xl shadow-2xl overflow-hidden">
        <Command shouldFilter={false} className="w-full flex flex-col flex-1 min-h-0">
          <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 border-b border-gray-100/20">
            <Search size={16} className="text-gray-100 shrink-0" />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Search coins…"
              className="flex-1 min-w-0 bg-transparent text-sm outline-none placeholder-gray-100/60"
              autoFocus
            />
            <div className="flex items-center gap-2 shrink-0">
              <kbd className="hidden sm:inline-block text-xs text-gray-100/60 bg-gray-300/50 px-1.5 py-0.5 rounded font-mono">ESC</kbd>
              <button
                onClick={close}
                aria-label="Close search"
                className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded text-gray-100 hover:text-cyan transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <Command.List className="flex-1 min-h-0 overflow-y-auto py-2 sm:max-h-72">
            {debouncedQuery.length < 2 && (
              <Command.Empty>
                <div className="flex flex-col items-center gap-2 py-8 text-gray-100/60 text-sm">
                  <TrendingUp size={24} />
                  Type at least 2 characters to search
                </div>
              </Command.Empty>
            )}
            {debouncedQuery.length >= 2 && (!results || results.length === 0) && (
              <Command.Empty>
                <p className="text-center py-8 text-sm text-gray-100/60">No results for &quot;{debouncedQuery}&quot;</p>
              </Command.Empty>
            )}
            {results?.slice(0, 8).map((coin) => (
              <Command.Item
                key={coin.id}
                value={coin.id}
                onSelect={() => selectCoin(coin.id)}
                className="flex items-center gap-3 px-3 sm:px-4 py-2.5 cursor-pointer hover:bg-gray-300/40 data-[selected]:bg-gray-300/40 transition-colors"
              >
                {coin.large ? (
                  <img src={coin.large} alt={coin.name} className="w-7 h-7 rounded-full shrink-0" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gray-300/50 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{coin.name}</p>
                  <p className="text-xs text-gray-100/70 uppercase">{coin.symbol}</p>
                </div>
                {coin.market_cap_rank && (
                  <span className="text-xs text-gray-100/50 shrink-0">#{coin.market_cap_rank}</span>
                )}
              </Command.Item>
            ))}
          </Command.List>

          {/* Hint footer — hidden on phones where the on-screen keyboard makes it noise */}
          <div className="hidden sm:flex border-t border-gray-100/20 px-4 py-2 items-center gap-4 text-xs text-gray-100/50">
            <span className="flex items-center gap-1">
              <kbd className="bg-gray-300/50 px-1 py-0.5 rounded font-mono">↑↓</kbd> navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-gray-300/50 px-1 py-0.5 rounded font-mono">↵</kbd> open coin
            </span>
            <span className="flex items-center gap-1 ml-auto">
              <kbd className="bg-gray-300/50 px-1 py-0.5 rounded font-mono">⌘K</kbd> toggle
            </span>
          </div>
        </Command>
      </div>
    </div>
  )
}

export default SearchCommand
