# M4rketView

A production-grade cryptocurrency market dashboard with live prices, news aggregation, DeFi analytics, and portfolio tracking — built entirely on free, no-key public APIs.

**Live:** [m4rket-view.vercel.app](https://m4rket-view.vercel.app)

---

## Features

| Feature | Details |
|---|---|
| **Live Prices** | Binance WebSocket stream — real-time price flash animations for 20 coins |
| **Market Overview** | CoinGecko top 250 with sorting, filtering, search, pagination |
| **Market Heatmap** | Recharts Treemap — instant green/red market snapshot |
| **Crypto News** | Aggregated from CoinDesk, CoinTelegraph, Decrypt via RSS |
| **DeFi TVL** | DeFiLlama — top chains, top protocols, 90-day area chart |
| **Bitcoin Network** | blockchain.info — hash rate, difficulty, tx volume, miner revenue |
| **Fear & Greed** | Alternative.me sentiment gauge |
| **Portfolio Tracker** | Local P&L tracking with pie chart allocation |
| **Watchlist** | Star coins; persistent across sessions |
| **Price Alerts** | Toast notifications when target price is crossed |
| **Compare** | Normalized 30-day performance chart for up to 3 coins |

## Tech Stack

- **React 18** + **TypeScript** (strict) + **Vite 6**
- **TanStack Query v5** — 24h localStorage cache persistence, 429-aware retry logic
- **Zustand v5** — persisted stores for watchlist, portfolio, alerts, UI state
- **Framer Motion** — page transitions, staggered card animations, price flash
- **Recharts** — area charts, line charts, treemap, pie chart
- **Radix UI** — Dialog, Tooltip, Select, Dropdown, Tabs, Popover (accessible primitives)
- **Tailwind CSS** — custom dark navy/cyan design system
- **react-hot-toast** — bottom-right notification toasts
- **cmdk** — Ctrl+K command palette search

## APIs Used (all free, no API key)

| API | Data |
|---|---|
| [CoinGecko](https://www.coingecko.com/api/documentation) | Market data, coin details, trending, search |
| [Binance WebSocket](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams) | Real-time prices (public stream) |
| [DeFiLlama](https://defillama.com/docs/api) | DeFi protocols, chains, TVL history |
| [Alternative.me](https://alternative.me/crypto/fear-and-greed-index/) | Fear & Greed Index |
| [blockchain.info](https://www.blockchain.com/explorer/api/blockchain_api) | Bitcoin on-chain stats |
| [RSS2JSON](https://rss2json.com) | Crypto news RSS proxy |

## Getting Started

```bash
git clone https://github.com/zhenxiao-yu/M4rketView.git
cd M4rketView
npm install
npm run dev
```

No `.env` file required — all APIs are public and require no authentication.

## Scripts

```bash
npm run dev        # Start dev server (http://localhost:5173)
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
npm run typecheck  # TypeScript check
npm run lint       # ESLint
npm test           # Vitest (watch mode)
npm test -- --run  # Vitest (single run)
npm run coverage   # Coverage report
```

## CI/CD

Every push to `main` and every pull request runs:

1. **Lint** (`eslint .`)
2. **Type check** (`tsc --noEmit`)
3. **Tests** (`vitest --run`, 33 tests)
4. **Build** (`vite build`)

Vercel auto-deploys `main` on push. Pull requests get preview deployments automatically.

## Architecture

```
src/
├── api/            # Fetch wrappers (CoinGecko, DeFiLlama, news, blockchain.info)
├── components/     # Shared UI components
│   ├── dashboard/  # Dashboard-specific widgets (BitcoinStats, DeFiTVL)
│   └── ui/         # Primitive components (ErrorCard)
├── hooks/          # TanStack Query hooks (one per data source)
├── lib/            # Utilities (formatters, queryClient, errors)
├── pages/          # Route pages (lazy-loaded)
├── store/          # Zustand stores (watchlist, portfolio, alerts, UI, market)
├── test/           # Vitest + MSW test suite
└── types/          # TypeScript interfaces for all API shapes
```

## Performance

- All pages are **code-split** and lazy-loaded via `React.lazy`
- Query cache is **persisted to localStorage** (24h TTL) — instant loads on revisit
- `refetchOnWindowFocus: false` — no API spam on tab switch
- Rate-limit errors (429) are never retried — shows cached data with Clock indicator
- WebSocket reconnects with **exponential backoff** (1s → 30s + jitter)
- API requests time out after **15 seconds** (AbortController)
- `React.memo` on high-frequency render components (price cells, action buttons)
- All coin images use `loading="lazy"`

## Deployment

The app is deployed on Vercel with:

- SPA rewrite rules (all routes → `index.html`)
- Immutable 1-year cache for `/assets/*` (hashed filenames)
- Security headers: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`

To deploy your own instance:

```bash
npm install -g vercel
vercel --prod
```

## License

MIT
