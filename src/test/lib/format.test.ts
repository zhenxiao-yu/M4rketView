import { describe, it, expect } from 'vitest'
import { formatCurrency, formatCompact, formatPercent } from '@/lib/utils'

describe('formatCurrency', () => {
  it('formats USD with dollar sign', () => {
    const result = formatCurrency(45000, 'usd')
    expect(result).toContain('45,000')
    expect(result).toContain('$')
  })

  it('uses 6 decimal places for sub-dollar prices', () => {
    const result = formatCurrency(0.0001234, 'usd')
    expect(result).toContain('0.000123')
  })
})

describe('formatCompact', () => {
  it('formats billions', () => {
    expect(formatCompact(1_000_000_000)).toContain('B')
  })

  it('formats trillions', () => {
    expect(formatCompact(1_800_000_000_000)).toContain('T')
  })

  it('formats millions', () => {
    expect(formatCompact(45_000_000)).toContain('M')
  })
})

describe('formatPercent', () => {
  it('adds + prefix for positive values', () => {
    expect(formatPercent(1.5)).toBe('+1.50%')
  })

  it('uses - prefix for negative values', () => {
    expect(formatPercent(-2.3)).toBe('-2.30%')
  })

  it('returns N/A for null', () => {
    expect(formatPercent(null)).toBe('N/A')
  })

  it('returns N/A for undefined', () => {
    expect(formatPercent(undefined)).toBe('N/A')
  })
})
