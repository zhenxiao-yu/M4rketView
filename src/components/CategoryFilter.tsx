import { useMarketStore } from '@/store/marketStore'

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'decentralized-finance-defi', label: 'DeFi' },
  { value: 'layer-1', label: 'Layer 1' },
  { value: 'layer-2', label: 'Layer 2' },
  { value: 'non-fungible-tokens-nft', label: 'NFT' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'stablecoins', label: 'Stablecoins' },
  { value: 'exchange-based-tokens', label: 'Exchange' },
]

const CategoryFilter = () => {
  const { category, setCategory } = useMarketStore()

  return (
    <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => setCategory(cat.value)}
          className={`flex-shrink-0 text-xs px-3 py-1 rounded-full border transition-all font-medium ${
            category === cat.value
              ? 'bg-accent text-accent-foreground border-accent'
              : 'border-border text-muted hover:border-accent hover:text-accent'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter
