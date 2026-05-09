# Technical Debt Register

Last updated: 2026-05-09
Total items: 7 | Active: 1 | Partial: 1 | Resolved: 5

> Tech debt is a tool, not a moral failing. This register tracks **conscious** decisions —
> every entry should explain *why* the debt was accepted, not just *what* it is.
> Items older than 3 sprints without action should either be fixed or re-accepted with
> a documented reason.

## Active items

| ID | Category | Description | Files | Effort | Impact | Priority | Added | Sprint |
|----|----------|-------------|-------|--------|--------|----------|-------|--------|
| TD-001 | Test | **Partial.** 14 of 15 hooks now have tests. The remaining one — `useLivePrices` — is a WebSocket consumer that needs a `WebSocket` polyfill (jsdom has none) and would require adding a dev dependency like `mock-socket`. **Why accepted:** the WS lifecycle (cleanup, reconnect with jitter, message parsing) is small and stable; adding the polyfill is not warranted for a single hook. Revisit if WS behavior gets more complex or if `mock-socket` lands for another reason. | `src/hooks/useLivePrices.ts`, `src/test/hooks/` | XS | Low | Low | 2026-05-09 | Backlog |
| TD-005 | Dependency | Major-version drift across the toolchain: React 18 → 19, Vite 6 → 8, Tailwind 3 → 4, Vitest 2 → 4, react-router-dom 6 → 7, recharts 2 → 3, eslint 9 → 10, typescript 5 → 6, lucide-react 0.469 → 1.14. **Why accepted:** stack is stable, all current versions actively maintained. Each major bump should be its own PR — bundling them violates "small, safe, reviewable changes." Remaining `npm audit` moderate vulns (esbuild dev-server, vitest chain) also live here, since the fix is `audit fix --force` which would do major bumps. | `package.json` | XL | Med | Med | 2026-05-09 | Backlog |

## Resolved items

| ID | Category | Description | Resolved | Resolution |
|----|----------|-------------|----------|------------|
| TD-002 | Test | Three of five Zustand stores untested. | 2026-05-09 | Added `marketStore.test.ts`, `portfolioStore.test.ts`, `uiStore.test.ts`. All 5 stores now have tests. |
| TD-003 | Test | Wrapper-level tests missing for Binance REST, DeFiLlama, Blockchair, news. | 2026-05-09 | Added `defiLlama.test.ts`, `blockchair.test.ts`, `binanceRest.test.ts`, `newsApi.test.ts` — covers happy-path mapping, edge cases (missing symbol, unparseable values, multi-feed partial failure), and upstream failure modes. |
| TD-004 | Code Quality | `CoinDetail` 175-line render body. | 2026-05-09 | **Consciously rejected.** Inline JSX is already structured cleanly with section boundaries (header / range / metrics / links / chart). Splitting trades inline JSX for trivial wrapper components without materially improving readability. Per "don't add abstractions beyond what the task requires" — not actually debt. |
| TD-006 | Dependency | 5 high-severity npm audit vulnerabilities (lodash, micromatch, brace-expansion, etc.). | 2026-05-09 | `npm audit fix` applied (no `--force`). 5 high → 0 high. 6 moderate remain in vite/vitest/esbuild dev chain, requiring major bumps — folded into TD-005. |
| TD-007 | Code Quality | `eslint-disable react-hooks/exhaustive-deps` on Pagination keyboard listener. | 2026-05-09 | Replaced with a ref pattern (`navRef.current = { goPrev, goNext }`) so the listener can stay mounted with `[]` deps and read latest handlers via the ref. Suppression removed. |
| TD-001-MAIN | Test | Data-fetching hooks had no tests (12 untested out of 15). | 2026-05-09 | Added 11 hook test files: `useCryptoMarkets`, `useCoinDetail`, `useTrending`, `useFearGreed`, `useGlobalData`, `useSearchCoins`, `useMarketChart`, `useDeFiTVL` (3 hooks), `useBitcoinStats`, `useNewsFeeds`, `usePortfolioData`, `useCompareCharts`, `useTheme`. Shared helper at `src/test/helpers/queryWrapper.tsx` for the QueryClient provider. Only `useLivePrices` remains (tracked as TD-001 above). |

## Notes

- Initial scan: 7 items on commit `9408cfc` (post-v1.3.2).
- Two sweeps: the second one closed TD-003, fully exhausted TD-001 except WebSocket, and held the line on TD-005.
- Test count: 75 → 145 (+70). Coverage now spans all stores, 14/15 hooks, all libs, all 6 API wrappers, and key components.
- Run `/tech-debt scan` at the start of each sprint to catch new debt before it accretes.
