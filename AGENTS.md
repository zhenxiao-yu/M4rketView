# AGENTS.md

## Project Intent
M4rketView is a market dashboard built around free public APIs. Priorities are resilience, readable performance, and honest UX when data is stale, rate-limited, or unavailable.

## Preferred Agent Workflow
1. Planner: inspect the affected page, hook, API wrapper, and store before editing.
2. Builder: keep data, UI, and infra changes separated when possible.
3. Reviewer: run the full local verification set and confirm cached/error states still behave well.

## Setup
```bash
npm install
npm run dev
```

## Validation
```bash
npm run lint
npm run typecheck
npm test -- --run
npm run build
```
Run coverage or additional manual browser checks when touching charts, portfolio flows, or WebSocket behavior.

## Guardrails
- Keep public API usage free-tier friendly and keyless unless a task explicitly changes that.
- Never overstate freshness or reliability when cached data is being shown.
- Preserve accessibility, loading states, and rate-limit fallbacks.
- Update docs and release notes for user-visible dashboard changes.

## Release Hygiene
- Tag releases only after lint, tests, typecheck, and build pass.
- Recheck demo URLs, release badges, and version references when shipping.