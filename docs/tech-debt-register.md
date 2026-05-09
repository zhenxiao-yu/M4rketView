# Technical Debt Register

Last updated: 2026-05-09
Total items: 7 | Active: 3 | Resolved: 4

> Tech debt is a tool, not a moral failing. This register tracks **conscious** decisions —
> every entry should explain *why* the debt was accepted, not just *what* it is.
> Items older than 3 sprints without action should either be fixed or re-accepted with
> a documented reason.

## Active items

| ID | Category | Description | Files | Effort | Impact | Priority | Added | Sprint |
|----|----------|-------------|-------|--------|--------|----------|-------|--------|
| TD-001 | Test | **Partial.** Hook coverage extended from 1 → 3 hooks: `useDebounce`, `useCryptoMarkets` (incl. CoinPaprika fallback), `useCoinDetail`. Remaining 12 hooks still untested (live prices, market chart, trending, news, DeFi, BTC stats, fear & greed, search, theme, global, compare, portfolio data). Pattern is now established — adding more should be cheap. | `src/hooks/*`, `src/test/hooks/` | M | High | Med | 2026-05-09 | Backlog |
| TD-003 | Test | **Partial.** API failover is now exercised end-to-end via `useCryptoMarkets` test (CoinGecko 429 → Paprika). Per-wrapper unit tests still missing for `binanceRest.ts`, `defiLlama.ts`, `blockchair.ts`, `newsApi.ts` — useful for catching upstream shape changes. | `src/api/*.ts`, `src/test/api/` | S | Med | Med | 2026-05-09 | Backlog |
| TD-005 | Dependency | Major-version drift across the toolchain: React 18 → 19, Vite 6 → 8, Tailwind 3 → 4, Vitest 2 → 4, react-router-dom 6 → 7, recharts 2 → 3, eslint 9 → 10, typescript 5 → 6, lucide-react 0.469 → 1.14. **Why accepted:** stack is stable, all current versions actively maintained. Each major bump should be its own PR — bundling them violates "small, safe, reviewable changes." Remaining `npm audit` moderate vulns (esbuild dev-server, vitest chain) also live here, since the fix is `audit fix --force` which would do major bumps. | `package.json` | XL | Med | Med | 2026-05-09 | Backlog |

## Resolved items

| ID | Category | Description | Resolved | Resolution |
|----|----------|-------------|----------|------------|
| TD-002 | Test | Three of five Zustand stores untested. | 2026-05-09 | Added `marketStore.test.ts`, `portfolioStore.test.ts`, `uiStore.test.ts`. All 5 stores now have tests (28 new tests). |
| TD-004 | Code Quality | `CoinDetail` 175-line render body. | 2026-05-09 | **Consciously rejected.** Inline JSX is already structured cleanly with section boundaries (header / range / metrics / links / chart). Splitting trades inline JSX for trivial wrapper components without materially improving readability. Per "don't add abstractions beyond what the task requires" — not actually debt. |
| TD-006 | Dependency | 5 high-severity npm audit vulnerabilities (lodash, micromatch, brace-expansion, etc.). | 2026-05-09 | `npm audit fix` applied (no `--force`). 5 high → 0 high. 6 moderate remain in vite/vitest/esbuild dev chain, requiring major bumps — folded into TD-005. |
| TD-007 | Code Quality | `eslint-disable react-hooks/exhaustive-deps` on Pagination keyboard listener. | 2026-05-09 | Replaced with a ref pattern (`navRef.current = { goPrev, goNext }`) so the listener can stay mounted with `[]` deps and read latest handlers via the ref. Suppression removed. |

## Notes

- Scan run on commit `9408cfc` (post-v1.3.2). Initial register had 7 items.
- This sweep resolved 4 items and made meaningful progress on 2 others. TD-005 deferred by design.
- Test count: 75 → 106 (+31). Coverage now spans all stores + 3 hooks + libs + components.
- Run `/tech-debt scan` at the start of each sprint to catch new debt before it accretes.
