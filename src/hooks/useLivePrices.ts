import { useEffect, useRef, useState } from 'react'

const SYMBOL_MAP: Record<string, string> = {
  BTCUSDT: 'bitcoin',
  ETHUSDT: 'ethereum',
  BNBUSDT: 'binancecoin',
  SOLUSDT: 'solana',
  XRPUSDT: 'ripple',
  ADAUSDT: 'cardano',
  DOGEUSDT: 'dogecoin',
  AVAXUSDT: 'avalanche-2',
  DOTUSDT: 'polkadot',
  MATICUSDT: 'matic-network',
  LINKUSDT: 'chainlink',
  UNIUSDT: 'uniswap',
  ATOMUSDT: 'cosmos',
  LTCUSDT: 'litecoin',
  ETCUSDT: 'ethereum-classic',
  XLMUSDT: 'stellar',
  ALGOUSDT: 'algorand',
  VETUSDT: 'vechain',
  TRXUSDT: 'tron',
  NEARUSDT: 'near',
}

const streams = Object.keys(SYMBOL_MAP)
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
          const coinId = SYMBOL_MAP[msg.data.s]
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
