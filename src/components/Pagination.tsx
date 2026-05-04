import { useRef } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { useMarketStore } from '@/store/marketStore'
import { useCryptoMarkets } from '@/hooks/useCryptoMarkets'

const MAX_PAGES = 500

const PerPage = () => {
  const { setPerPage } = useMarketStore()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const val = parseInt(inputRef.current?.value ?? '10')
    if (val > 0 && val <= 250) {
      setPerPage(val)
    }
  }

  return (
    <form className="relative flex items-center font-nunito mr-8" onSubmit={handleSubmit}>
      <label htmlFor="perpage" className="mr-2 font-bold text-sm">
        per page:
      </label>
      <input
        type="number"
        id="perpage"
        name="perpage"
        min={1}
        max={250}
        ref={inputRef}
        placeholder="10"
        className="w-14 rounded bg-gray-200 placeholder:text-gray-100 px-2 py-0.5 outline-none border border-transparent focus:border-cyan text-sm"
      />
      <button type="submit" className="ml-1.5 text-gray-100 hover:text-cyan transition-colors">
        <ArrowRight size={16} />
      </button>
    </form>
  )
}

const Pagination = () => {
  const { page, setPage, perPage } = useMarketStore()
  const { data } = useCryptoMarkets()

  const isLastPage = (data?.length ?? 0) < perPage
  const totalNumber = isLastPage ? page : Math.min(page + 10, MAX_PAGES)

  const next = () => { if (!isLastPage) setPage(page + 1) }
  const prev = () => { if (page > 1) setPage(page - 1) }
  const multiStepNext = () => { if (!isLastPage) setPage(Math.min(page + 3, totalNumber)) }
  const multiStepPrev = () => setPage(Math.max(page - 3, 1))

  if (!data || data.length === 0) return null

  return (
    <div className="flex items-center">
      <PerPage />
      <ul className="flex items-center gap-1 text-sm">
        <li>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full hover:text-cyan disabled:opacity-30 transition-colors"
            onClick={prev}
            disabled={page === 1}
          >
            <ChevronLeft size={16} />
          </button>
        </li>

        {page > 3 && (
          <li>
            <button
              onClick={multiStepPrev}
              className="w-8 h-8 flex items-center justify-center hover:text-cyan rounded-full"
            >
              ...
            </button>
          </li>
        )}

        {page > 1 && (
          <li>
            <button
              onClick={prev}
              className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:text-cyan rounded-full mx-0.5"
            >
              {page - 1}
            </button>
          </li>
        )}

        <li>
          <button
            disabled
            className="w-8 h-8 flex items-center justify-center bg-cyan text-gray-300 rounded-full mx-0.5 font-semibold"
          >
            {page}
          </button>
        </li>

        {!isLastPage && (
          <li>
            <button
              onClick={next}
              className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:text-cyan rounded-full mx-0.5"
            >
              {page + 1}
            </button>
          </li>
        )}

        {!isLastPage && page < totalNumber - 3 && (
          <li>
            <button
              onClick={multiStepNext}
              className="w-8 h-8 flex items-center justify-center hover:text-cyan rounded-full"
            >
              ...
            </button>
          </li>
        )}

        <li>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full hover:text-cyan disabled:opacity-30 transition-colors"
            onClick={next}
            disabled={isLastPage}
          >
            <ChevronRight size={16} />
          </button>
        </li>
      </ul>
    </div>
  )
}

export default Pagination
