import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RateLimitError } from '@/lib/errors'
import ErrorCard from '@/components/ui/ErrorCard'

describe('ErrorCard', () => {
  it('shows "Rate limit reached" and source name for RateLimitError', () => {
    render(<ErrorCard error={new RateLimitError('CoinGecko')} />)
    expect(screen.getByText(/Rate limit reached/)).toBeInTheDocument()
    expect(screen.getAllByText(/CoinGecko/).length).toBeGreaterThan(0)
  })

  it('does not show retry button for rate limit errors', () => {
    render(<ErrorCard error={new RateLimitError('CoinGecko')} onRetry={vi.fn()} />)
    expect(screen.queryByText('Try again')).not.toBeInTheDocument()
  })

  it('shows "Request timed out" for timeout errors', () => {
    render(<ErrorCard error={new Error('CoinGecko request timed out after 15s')} />)
    expect(screen.getByText('Request timed out')).toBeInTheDocument()
  })

  it('shows "Network error" for fetch failures', () => {
    render(<ErrorCard error={new Error('Failed to fetch')} />)
    expect(screen.getByText('Network error')).toBeInTheDocument()
  })

  it('shows retry button for generic errors when onRetry provided', () => {
    const onRetry = vi.fn()
    render(<ErrorCard error={new Error('Server error')} onRetry={onRetry} />)
    expect(screen.getByText('Try again')).toBeInTheDocument()
  })

  it('renders compact variant without retry for rate limit', () => {
    render(<ErrorCard error={new RateLimitError('DeFiLlama')} compact onRetry={vi.fn()} />)
    expect(screen.getByText(/Rate limit reached/)).toBeInTheDocument()
    expect(screen.queryByText('Retry')).not.toBeInTheDocument()
  })

  it('renders compact variant with retry for generic errors', () => {
    const onRetry = vi.fn()
    render(<ErrorCard error={new Error('Something failed')} compact onRetry={onRetry} />)
    expect(screen.getByText('Retry')).toBeInTheDocument()
  })
})
