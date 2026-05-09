import { useEffect } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, Check, ChevronDown } from 'lucide-react'
import * as Select from '@radix-ui/react-select'
import { useMarketStore } from '@/store/marketStore'
import { useCryptoMarkets } from '@/hooks/useCryptoMarkets'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const MAX_PAGES = 500
const PAGE_WINDOW = 1
const PER_PAGE_OPTIONS = [10, 25, 50, 100, 250]

function buildPageList(current: number, isLastPage: boolean): (number | 'ellipsis')[] {
  const last = isLastPage ? current : Math.min(current + 5, MAX_PAGES)
  const out: (number | 'ellipsis')[] = []
  const push = (n: number | 'ellipsis') => {
    if (out[out.length - 1] !== n) out.push(n)
  }
  push(1)
  if (current - PAGE_WINDOW > 2) push('ellipsis')
  for (let p = Math.max(2, current - PAGE_WINDOW); p <= Math.min(last - 1, current + PAGE_WINDOW); p++) {
    push(p)
  }
  if (current + PAGE_WINDOW < last - 1) push('ellipsis')
  if (last > 1) push(last)
  return out
}

const PerPageSelect = () => {
  const { perPage, setPerPage, setPage } = useMarketStore()
  return (
    <Select.Root
      value={String(perPage)}
      onValueChange={(v) => { setPerPage(Number(v)); setPage(1) }}
    >
      <Select.Trigger
        aria-label="Items per page"
        className="inline-flex items-center gap-1.5 rounded-lg border border-border/20 bg-surface/40 px-3 py-1.5 text-xs font-medium text-muted hover:border-accent/50 hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      >
        <Select.Value /> <span className="text-muted/60">/ page</span>
        <Select.Icon><ChevronDown size={12} /></Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={6}
          className="z-50 min-w-[7rem] rounded-lg border border-border/20 bg-surface shadow-xl overflow-hidden"
        >
          <Select.Viewport className="p-1">
            {PER_PAGE_OPTIONS.map((n) => (
              <Select.Item
                key={n}
                value={String(n)}
                className="flex cursor-pointer items-center justify-between rounded px-2.5 py-1.5 text-xs text-muted outline-none data-[highlighted]:bg-background/60 data-[highlighted]:text-accent"
              >
                <Select.ItemText>{n}</Select.ItemText>
                <Select.ItemIndicator><Check size={12} /></Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

const Pagination = () => {
  const { page, setPage, perPage } = useMarketStore()
  const { data } = useCryptoMarkets()
  const isLastPage = (data?.length ?? 0) < perPage

  const goPrev  = () => { if (page > 1) setPage(page - 1) }
  const goNext  = () => { if (!isLastPage) setPage(page + 1) }
  const goFirst = () => { if (page !== 1) setPage(1) }

  // Keyboard nav: ArrowLeft / ArrowRight when not focused inside an input
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.target instanceof HTMLElement && e.target.isContentEditable) return
      if (e.altKey || e.ctrlKey || e.metaKey) return
      if (e.key === 'ArrowLeft')  { goPrev(); }
      if (e.key === 'ArrowRight') { goNext(); }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, isLastPage])

  if (!data || data.length === 0) return null

  const pages = buildPageList(page, isLastPage)

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center gap-2"
    >
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={goFirst}
        disabled={page === 1}
        aria-label="First page"
        className="hidden sm:inline-flex"
      >
        <ChevronsLeft size={16} />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={goPrev}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </Button>

      <ul className="flex items-center gap-1" role="list">
        {pages.map((p, i) =>
          p === 'ellipsis' ? (
            <li key={`e-${i}`} className="px-1 text-muted/60 text-xs select-none" aria-hidden>
              …
            </li>
          ) : (
            <li key={p}>
              <button
                onClick={() => setPage(p)}
                aria-current={p === page ? 'page' : undefined}
                aria-label={`Page ${p}`}
                className={cn(
                  'min-w-[32px] h-8 px-2 rounded-lg text-xs font-semibold transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
                  p === page
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-surface/40 text-muted hover:text-accent hover:bg-surface/60',
                )}
              >
                {p}
              </button>
            </li>
          ),
        )}
      </ul>

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={goNext}
        disabled={isLastPage}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </Button>

      <div className="ml-auto sm:ml-2">
        <PerPageSelect />
      </div>
    </nav>
  )
}

export default Pagination
