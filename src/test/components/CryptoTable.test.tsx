import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import CryptoTable from '@/components/CryptoTable'
import { useWatchlistStore } from '@/store/watchlistStore'
import { useMarketStore } from '@/store/marketStore'

const makeClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  })

const Wrapper = ({ client }: { client: QueryClient }) => (
  <QueryClientProvider client={client}>
    <MemoryRouter>
      <CryptoTable />
    </MemoryRouter>
  </QueryClientProvider>
)

describe('CryptoTable', () => {
  beforeEach(() => {
    useWatchlistStore.setState({ coinIds: [] })
    useMarketStore.setState({ currency: 'usd', sortBy: 'market_cap_desc', page: 1, perPage: 10, coinSearch: '', category: '' })
  })

  it('renders skeleton rows while loading', () => {
    const client = makeClient()
    const { container } = render(<Wrapper client={client} />)
    const skeletonCells = container.querySelectorAll('td .bg-gray-200')
    expect(skeletonCells.length).toBeGreaterThan(0)
  })

  it('renders coin data after load', async () => {
    const client = makeClient()
    render(<Wrapper client={client} />)
    await waitFor(() => {
      expect(screen.getByText('Bitcoin')).toBeInTheDocument()
    })
    expect(screen.getByText('btc')).toBeInTheDocument()
  })

  it('shows price for loaded coin', async () => {
    const client = makeClient()
    render(<Wrapper client={client} />)
    await waitFor(() => {
      expect(screen.getByText('Bitcoin')).toBeInTheDocument()
    })
    expect(screen.getByText(/45[,.]?000/)).toBeInTheDocument()
  })

  it('save button toggles watchlist', async () => {
    const client = makeClient()
    render(<Wrapper client={client} />)
    await waitFor(() => {
      expect(screen.getByText('Bitcoin')).toBeInTheDocument()
    })

    const saveBtn = screen.getByLabelText('Add to watchlist')
    fireEvent.click(saveBtn)
    expect(useWatchlistStore.getState().isWatched('bitcoin')).toBe(true)

    fireEvent.click(screen.getByLabelText('Remove from watchlist'))
    expect(useWatchlistStore.getState().isWatched('bitcoin')).toBe(false)
  })
})
