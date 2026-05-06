import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import CryptoTable from '@/components/CryptoTable'
import { useWatchlistStore } from '@/store/watchlistStore'
import { useMarketStore } from '@/store/marketStore'

vi.mock('@/hooks/useLivePrices', () => ({
  useLivePrices: () => ({ prices: {}, connected: false }),
}))

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
      expect(screen.getAllByText('Bitcoin').length).toBeGreaterThan(0)
    })
    expect(screen.getAllByText('btc').length).toBeGreaterThan(0)
  })

  it('shows price for loaded coin', async () => {
    const client = makeClient()
    render(<Wrapper client={client} />)
    await waitFor(() => {
      expect(screen.getAllByText('Bitcoin').length).toBeGreaterThan(0)
    })
    expect(screen.getAllByText(/45[,.]?000/).length).toBeGreaterThan(0)
  })

  it('save button toggles watchlist', async () => {
    const client = makeClient()
    render(<Wrapper client={client} />)
    await waitFor(() => {
      expect(screen.getAllByText('Bitcoin').length).toBeGreaterThan(0)
    })

    // Both table and mobile card render save buttons — click the first one
    const saveBtn = screen.getAllByLabelText('Add to watchlist')[0]
    fireEvent.click(saveBtn)
    expect(useWatchlistStore.getState().isWatched('bitcoin')).toBe(true)

    fireEvent.click(screen.getAllByLabelText('Remove from watchlist')[0])
    expect(useWatchlistStore.getState().isWatched('bitcoin')).toBe(false)
  })

  it('mobile cards and table both render coin data', async () => {
    const client = makeClient()
    render(<Wrapper client={client} />)
    await waitFor(() => {
      expect(screen.getAllByText('Bitcoin').length).toBeGreaterThan(0)
    })
    // One from desktop table, one from mobile card
    expect(screen.getAllByText('Bitcoin').length).toBeGreaterThanOrEqual(2)
    // Each render surface has its own save/compare buttons
    expect(screen.getAllByLabelText('Add to watchlist').length).toBeGreaterThanOrEqual(2)
  })

  it('mobile card links to coin detail page', async () => {
    const client = makeClient()
    render(<Wrapper client={client} />)
    await waitFor(() => {
      expect(screen.getAllByText('Bitcoin').length).toBeGreaterThan(0)
    })
    const detailLinks = screen.getAllByRole('link', { name: /bitcoin/i })
    expect(detailLinks.some((l) => l.getAttribute('href') === '/coin/bitcoin')).toBe(true)
  })
})
