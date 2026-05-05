import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navigation from '@/components/Navigation'
import { useAlertStore } from '@/store/alertStore'

const Wrapper = ({ initialPath = '/' }: { initialPath?: string }) => (
  <MemoryRouter initialEntries={[initialPath]}>
    <Navigation />
  </MemoryRouter>
)

describe('Navigation', () => {
  it('renders all nav links', () => {
    render(<Wrapper />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Markets')).toBeInTheDocument()
    expect(screen.getByText('Trending')).toBeInTheDocument()
    expect(screen.getByText('Saved')).toBeInTheDocument()
    expect(screen.getByText('Portfolio')).toBeInTheDocument()
    expect(screen.getByText('Compare')).toBeInTheDocument()
  })

  it('Dashboard link points to /', () => {
    render(<Wrapper />)
    const dashLink = screen.getByText('Dashboard').closest('a')
    expect(dashLink).toHaveAttribute('href', '/')
  })

  it('Markets link points to /markets', () => {
    render(<Wrapper />)
    const marketsLink = screen.getByText('Markets').closest('a')
    expect(marketsLink).toHaveAttribute('href', '/markets')
  })

  it('does not show alert badge when no active alerts', () => {
    useAlertStore.setState({ alerts: [] })
    render(<Wrapper />)
    expect(screen.queryByText(/^\d+$/)).not.toBeInTheDocument()
  })

  it('shows alert badge count when alerts are active', () => {
    useAlertStore.setState({
      alerts: [
        {
          id: 'btc-1',
          coinId: 'bitcoin',
          coinName: 'Bitcoin',
          coinImage: '',
          targetPrice: 50000,
          direction: 'above',
          triggered: false,
          createdAt: new Date().toISOString(),
        },
      ],
    })
    render(<Wrapper />)
    expect(screen.getByText('1')).toBeInTheDocument()
    useAlertStore.setState({ alerts: [] })
  })

  it('renders theme toggle button', () => {
    render(<Wrapper />)
    expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument()
  })

  it('renders search button', () => {
    render(<Wrapper />)
    expect(screen.getByLabelText('Search (Ctrl+K)')).toBeInTheDocument()
  })
})
