# Contributing to M4rketView

Thanks for considering a contribution. This is a small, focused project — contributions that fit the existing scope are very welcome.

## Ground Rules

- All APIs **must remain free and require no API key**. This is the core design constraint. Don't add integrations that require registration.
- Keep the bundle lean. Check `npm run build` output before opening a PR.
- All four CI gates must pass: `lint` → `typecheck` → `test` → `build`.

## Development Setup

```bash
git clone https://github.com/zhenxiao-yu/M4rketView.git
cd M4rketView
npm install
npm run dev          # http://localhost:3000
```

No `.env` file required.

## Before You Submit

```bash
npm run lint         # must be 0 errors
npm run typecheck    # must be 0 errors
npm test -- --run    # must be 33/33 (or more if you added tests)
npm run build        # must succeed
```

## What to Work On

Issues labelled **`good first issue`** are good starting points. For larger changes, open an issue first to discuss — avoid spending time on a PR that won't be merged.

Areas that are always welcome:
- Bug fixes for broken API integrations
- Performance improvements (smaller bundle, fewer re-renders)
- Accessibility improvements (keyboard nav, ARIA, contrast)
- New free-API data sources that fit the dashboard

Areas that are out of scope:
- Any feature requiring a paid or key-gated API
- Replacing existing free APIs with paid alternatives
- Adding authentication / user accounts
- Backend services or databases

## Commit Style

Follow the existing commit convention — a short imperative subject line, optionally with a body:

```
fix: guard toFixed calls against undefined API values

DeFiLlama sometimes returns change_1d as a string. The typeof
check prevents "string".toFixed() crashes in formatPercent.
```

Use `feat:`, `fix:`, `chore:`, `perf:`, `docs:`, `test:` prefixes.

## Adding Tests

Tests live in `src/test/`. Mock handlers for external APIs are in `src/test/mocks/handlers.ts` — add a handler there for any new API endpoint your code touches. Tests run with MSW and never hit real APIs.

## Pull Request Process

1. Fork the repo and create a branch from `main`.
2. Make your changes, run the CI checks locally.
3. Open a PR against `main`. The PR template will guide you.
4. CI runs automatically. All checks must be green before merge.

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to abide by its terms.
