import { useEffect, useRef, useState } from 'react'
import { BINANCE_TO_COINGECKO } from '@/lib/binanceSymbols'

const streams = Object.keys(BINANCE_TO_COINGECKO)
  .map((s) => `${s.toLowerCase()}@miniTicker`)
  .join('/')

const WS_URL = `wss://stream.binance.com:9443/stream?streams=${streams}`

const BASE_DELAY = 1_000
const MAX_DELAY = 30_000

export function useLivePrices(): { prices: Record<string, number>; connected: boolean } {
  const [prices, setPrices] = useState<Record<string, number>>({})
  const [connected, setConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const attemptRef = useRef(0)

  useEffect(() => {
    let destroyed = false

    function connect() {
      if (destroyed) return
      const ws = new WebSocket(WS_URL)
      wsRef.current = ws

      ws.onopen = () => {
        if (destroyed) return
        setConnected(true)
        attemptRef.current = 0
      }

      ws.onmessage = (e: MessageEvent) => {
        if (destroyed) return
        try {
          const msg = JSON.parse(e.data as string) as { data: { s: string; c: string } }
          const coinId = BINANCE_TO_COINGECKO[msg.data.s]
          if (coinId) {
            const price = parseFloat(msg.data.c)
            if (!isNaN(price)) {
              setPrices((prev) => ({ ...prev, [coinId]: price }))
            }
          }
        } catch {
          // ignore malformed frames
        }
      }

      ws.onclose = () => {
        if (destroyed) return
        setConnected(false)
        const jitter = Math.random() * 500
        const delay = Math.min(BASE_DELAY * 2 ** attemptRef.current + jitter, MAX_DELAY)
        attemptRef.current++
        reconnectTimer.current = setTimeout(connect, delay)
      }

      ws.onerror = () => {
        ws.close()
      }
    }

    connect()

    return () => {
      destroyed = true
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
      const ws = wsRef.current
      if (ws) {
        ws.onopen = null
        ws.onmessage = null
        ws.onclose = null
        ws.onerror = null
        ws.close()
      }
    }
  }, [])

  return { prices, connected }
}
