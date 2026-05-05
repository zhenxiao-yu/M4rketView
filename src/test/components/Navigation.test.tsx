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
    // Both desktop and mobile menus are in the DOM — use getAllByText
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Markets').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Trending').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Saved').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Portfolio').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Compare').length).toBeGreaterThanOrEqual(1)
  })

  it('Dashboard link points to /', () => {
    render(<Wrapper />)
    const dashLinks = screen.getAllByText('Dashboard').map((el) => el.closest('a')).filter(Boolean)
    expect(dashLinks[0]).toHaveAttribute('href', '/')
  })

  it('Markets link points to /markets', () => {
    render(<Wrapper />)
    const marketsLinks = screen.getAllByText('Markets').map((el) => el.closest('a')).filter(Boolean)
    expect(marketsLinks[0]).toHaveAttribute('href', '/markets')
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
    // Badge appears in both desktop and mobile navs
    expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(1)
    useAlertStore.setState({ alerts: [] })
  })

  it('renders theme toggle button', () => {
    render(<Wrapper />)
    // Two toggle buttons (desktop + mobile) — check at least one exists
    expect(screen.getAllByLabelText('Toggle theme').length).toBeGreaterThanOrEqual(1)
  })

  it('renders search button', () => {
    render(<Wrapper />)
    expect(screen.getAllByLabelText('Search (Ctrl+K)').length).toBeGreaterThanOrEqual(1)
  })
})
