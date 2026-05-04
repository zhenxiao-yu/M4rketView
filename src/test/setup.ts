import '@testing-library/jest-dom'
import { afterEach, beforeAll, afterAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import { server } from './mocks/server'

// jsdom doesn't implement URL.createObjectURL
if (typeof URL.createObjectURL === 'undefined') {
  URL.createObjectURL = vi.fn()
  URL.revokeObjectURL = vi.fn()
}

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => { cleanup(); server.resetHandlers() })
afterAll(() => server.close())
