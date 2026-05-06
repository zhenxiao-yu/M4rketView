# M4rketView — Claude Code Context

## Project

Production crypto market dashboard. Free-forever: every API is public, no API keys, no cost.
Live at [m4rket-view.vercel.app](https://m4rket-view.vercel.app).

## Commands

```bash
npm run dev        # dev server → http://localhost:3000
npm run build      # production build → dist/
npm run typecheck  # tsc --noEmit (must be 0 errors)
npm run lint       # eslint . (must be 0 errors)
npm test -- --run  # vitest single run (33 tests, must all pass)
npm run coverage   # v8 coverage report
```

CI gate: lint → typecheck → test → build. All four must pass before merge.

## Architecture

```
src/
├── api/        Fetch wrappers — one file per data source, no business logic
├── components/ Shared UI; dashboard/ for dashboard widgets; ui/ for primitives
├── hooks/      TanStack Query hooks — one hook per data source
├── lib/        Pure utilities: formatters, queryClient, errors, buildInfo
├── pages/      Route-level components (lazy-loaded via React.lazy)
├── store/      Zustand stores: market, watchlist, portfolio, alerts, UI
├── test/       Vitest + MSW — handlers.ts mocks all external APIs
└── types/      TypeScript interfaces for every API response shape
```

## Tech Stack

- **React 18.3** + **TypeScript 5** (strict) + **Vite 6**
- **TanStack Query v5** — 24h localStorage cache, 429-aware retry, `refetchOnWindowFocus: false`
- **Zustand v5** — persist middleware on all 5 stores
- **Framer Motion v12** — page transitions (blur+opacity+y), staggered card entrances, price flash
- **Radix UI** — Dialog, Tooltip, Select, Tabs, Dropdown, Popover (accessible primitives)
- **Tailwind CSS** — custom dark navy/cyan design system (see `tailwind.config.cjs`)
- **Recharts** — area, line, treemap, pie charts
- **cmdk** — Ctrl+K command palette

## APIs (all free, no key)

| API | Used for |
|---|---|
| CoinGecko | Market data, coin details, trending, search |
| Binance WebSocket | Real-time prices (public stream) |
| DeFiLlama | DeFi TVL, protocols, chain history |
| Alternative.me | Fear & Greed Index |
| blockchain.info | Bitcoin on-chain stats |
| CryptoCompare | Crypto news feed |

## Coding Conventions

**Comments** — write none by default. Only add one when the *why* is non-obvious (hidden constraint, workaround, subtle invariant). Never describe what the code does.

**React components** — always use named function syntax inside `memo()`:
```tsx
// correct — ESLint react/display-name requires the function name
const PriceCell = memo(function PriceCell({ ... }: Props) { ... })

// wrong — anonymous arrow inside memo loses display name
const PriceCell = memo(({ ... }: Props) => { ... })
```

**React type imports** — import types explicitly, never use `React.*` namespace:
```tsx
import { useState, type ReactNode, type FormEvent } from 'react'
// not: React.ReactNode, React.FormEvent
```

**Error handling** — `RateLimitError` (from `@/lib/errors`) for 429s → TanStack Query never retries these. AbortController with 15s timeout on every fetch; skipped in `import.meta.env.MODE === 'test'` to avoid MSW conflicts.

**WebSocket cleanup** — null all four handlers before calling `ws.close()` to prevent ghost reconnect on unmount:
```ts
ws.onopen = null; ws.onmessage = null; ws.onclose = null; ws.onerror = null
ws.close()
```

**`.toFixed()` safety** — always guard before calling; API values can arrive as strings or undefined:
```ts
// formatPercent already guards, but for ad-hoc use:
value != null && typeof value === 'number' && isFinite(value)
  ? value.toFixed(2)
  : '—'
```

**No unused imports/vars** — ESLint `@typescript-eslint/no-unused-vars` is an error. Prefix intentionally unused with `_`.

## Build-Time Constants

Injected by `vite.config.ts`, typed in `src/vite-env.d.ts`, exported from `src/lib/buildInfo.ts`:

| Constant | Value |
|---|---|
| `__APP_VERSION__` | `package.json "version"` |
| `__BUILD_TIME__` | ISO timestamp at build |
| `__GIT_SHA__` | `VERCEL_GIT_COMMIT_SHA` → `GITHUB_SHA` → `'local'` |

## Environment Variables

No `.env` required. See `.env.example` for documentation. Do not add API keys — the free-API-only constraint is intentional.

## Deployment

- **Vercel** auto-deploys `main`. PRs get preview deployments.
- `vercel.json`: SPA rewrite rules, 1-year immutable cache for `/assets/*`, security headers.
- `outputDirectory: dist`, `buildCommand: npm run build`.

## Testing

MSW intercepts all external API calls in tests — never hit real APIs. `src/test/mocks/handlers.ts` is the single source of mock data. Add new handlers there when adding new API integrations.

## Changelog

Maintained in `src/components/Footer.tsx` → `CHANGELOG` array. Update it (and bump `package.json` version) when shipping a release.
