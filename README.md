# M4rketView

[![CI](https://github.com/zhenxiao-yu/M4rketView/actions/workflows/ci.yml/badge.svg)](https://github.com/zhenxiao-yu/M4rketView/actions/workflows/ci.yml)
[![Release](https://github.com/zhenxiao-yu/M4rketView/actions/workflows/release.yml/badge.svg)](https://github.com/zhenxiao-yu/M4rketView/releases/latest)
[![Version](https://img.shields.io/badge/version-1.2.1-B6EADA?style=flat)](https://github.com/zhenxiao-yu/M4rketView/releases)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat)](LICENSE)
[![Live](https://img.shields.io/badge/live-m4rket--view.vercel.app-301E67?style=flat&logo=vercel)](https://m4rket-view.vercel.app)

A production-grade cryptocurrency market dashboard with live prices, news aggregation, DeFi analytics, and portfolio tracking — built entirely on free, no-key public APIs.

---

## Features

| Feature | Details |
|---|---|
| **Live Prices** | Binance WebSocket stream — real-time price flash animations for 20 coins |
| **Market Overview** | CoinGecko top 250 with sorting, filtering, search, pagination |
| **Market Heatmap** | Recharts Treemap — instant green/red market snapshot |
| **Crypto News** | CryptoCompare News API — 50+ articles, dynamic source filtering |
| **DeFi TVL** | DeFiLlama — top chains, top protocols, 90-day area chart |
| **Bitcoin Network** | blockchain.info — hash rate, difficulty, tx volume, miner revenue |
| **Fear & Greed** | Alternative.me sentiment gauge |
| **Portfolio Tracker** | Local P&L tracking with pie chart allocation |
| **Watchlist** | Star coins; persistent across sessions |
| **Price Alerts** | Toast notifications when target price is crossed |
| **Compare** | Normalized 30-day performance chart for up to 3 coins |
| **Changelog** | In-app version history — click the version badge in the footer |

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
| [CryptoCompare](https://min-api.cryptocompare.com/documentation) | Crypto news feed |

## Getting Started

```bash
git clone https://github.com/zhenxiao-yu/M4rketView.git
cd M4rketView
npm install
npm run dev          # http://localhost:3000
```

No `.env` file required — all APIs are public and require no authentication.

## Scripts

```bash
npm run dev        # Start dev server (http://localhost:3000)
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
npm run typecheck  # TypeScript check
npm run lint       # ESLint
npm test -- --run  # Vitest (single run, 33 tests)
npm run coverage   # Coverage report
```

## CI/CD

Every push to `main` and every pull request runs four parallel jobs:

| Job | Command |
|---|---|
| Lint | `eslint .` |
| Type check | `tsc --noEmit` |
| Tests | `vitest --run` (33 tests) |
| Build | `vite build` → artifact uploaded |

**Releases** — push a `v*` tag to trigger the release workflow: runs the full CI gate, builds, zips `dist/`, and creates a GitHub Release with auto-generated notes.

Vercel auto-deploys `main` on push. Pull requests get preview deployments automatically.

## Architecture

```
src/
├── api/            Fetch wrappers (one file per data source)
├── components/     Shared UI components
│   ├── dashboard/  Dashboard widgets (BitcoinStats, DeFiTVL)
│   └── ui/         Primitive components (ErrorCard)
├── hooks/          TanStack Query hooks (one per data source)
├── lib/            Utilities (formatters, queryClient, errors, buildInfo)
├── pages/          Route pages (lazy-loaded via React.lazy)
├── store/          Zustand stores (watchlist, portfolio, alerts, UI, market)
├── test/           Vitest + MSW test suite
└── types/          TypeScript interfaces for all API response shapes
```

## Performance

- All pages **code-split** and lazy-loaded via `React.lazy`
- Query cache **persisted to localStorage** (24h TTL) — instant loads on revisit
- `refetchOnWindowFocus: false` — no API spam on tab switch
- Rate-limit errors (429) are never retried — shows cached data with Clock indicator
- WebSocket reconnects with **exponential backoff** (1s → 30s + jitter); handlers nulled on cleanup
- API requests time out after **15 seconds** (AbortController)
- `React.memo` on high-frequency render components (price cells, action buttons)
- All coin/protocol images use `loading="lazy"`
- ReactQueryDevtools excluded from production bundle (`import.meta.env.DEV` gate)

## Build Provenance

Three constants are injected at build time (no runtime cost, no API call):

| Constant | Source |
|---|---|
| `__APP_VERSION__` | `package.json "version"` |
| `__BUILD_TIME__` | ISO timestamp at build |
| `__GIT_SHA__` | `VERCEL_GIT_COMMIT_SHA` → `GITHUB_SHA` → `'local'` |

These surface in the footer changelog dialog.

## Deployment

Deployed on Vercel with:

- SPA rewrite rules (all routes → `index.html`)
- Immutable 1-year cache for `/assets/*` (hashed filenames)
- Security headers: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`

To deploy your own instance:

```bash
npm install -g vercel
vercel --prod
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). The short version: all CI checks must pass, all new data sources must be free and keyless.

## Security

See [SECURITY.md](SECURITY.md) for the vulnerability disclosure policy.

## License

MIT — see [LICENSE](LICENSE).
