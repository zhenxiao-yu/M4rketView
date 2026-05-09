# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project aims to follow [Semantic Versioning](https://semver.org/).

## [1.3.1] - 2026-05-09

### Added

- Display font (Space Grotesk) for headings and brand wordmark; consistent logo + wordmark heights across navigation and footer.

### Changed

- Body font swapped to Inter; mono font swapped to JetBrains Mono.
- Footer compacted with a new scroll-to-top affordance.

### Fixed

- Mobile a11y polish in the Footer.

## [1.3.0] - 2026-05-08

### Added

- Mobile-first redesign: `BottomNav` with iOS safe-area support; Markets, Saved, and Portfolio render as cards under the `md` breakpoint.
- Multi-source API failover layer (`lib/fetchWithFallback.ts`) — fires on 429, network error, timeout, or 5xx and rethrows the primary error if all sources fail.
- CoinPaprika fallback for the Markets list, Binance `/klines` fallback for the Coin Detail chart (top-20 coins via `lib/binanceSymbols.ts`), and Blockchair fallback for blockchain.info Bitcoin stats.
- `prefers-reduced-motion` support across page transitions, price flash, and sheet animations.
- `docs/mobile-qa.md` — manual QA checklist for common viewports and browsers.
- Linear-style premium dark theme replacing the previous navy/cyan palette (Recharts hex literals updated to match).

### Changed

- Compare and Trending switched from flex-wrap with hard-coded widths to responsive CSS grids (1 → 2 → 3 cols).
- Coin Detail header wraps cleanly on phones; chart panel has graduated min-heights (280 / 360 / 400 px).
- Numeric inputs use `inputMode="decimal"`; primary tap targets meet the 44 px guideline.
- Test suite grew from 33 → 75 (added `withFallback` unit tests).

### Fixed

- iOS Safari viewport: main shell uses `min-h-screen + min-h-[100dvh]`; Footer and `SearchCommand` dialogs use 100dvh-aware max-heights with internal scroll. `SearchCommand` top-padding reduced on small heights.
- `body { overflow-x: hidden }` to eliminate incidental sideways scroll.

## [1.2.1] - 2026-05-05

### Added

- Production crypto dashboard features including live prices, DeFi analytics, and portfolio tooling.
- CI and release automation with release tags and GitHub Releases.
- Repo-level `AGENTS.md` guidance for multi-agent contribution flows.
- MIT license and changelog-backed GitHub release workflow.

### Changed

- Documentation and repo metadata aligned with the current product.
- `.gitignore` updated for 2026 local AI tooling and release hygiene.
- GitHub release workflow now points to a real changelog instead of in-app footer notes.
