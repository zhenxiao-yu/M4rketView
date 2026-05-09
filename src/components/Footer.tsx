import { Link } from 'react-router-dom'
import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Github, ExternalLink, X, Tag, Clock, GitCommit,
  LayoutDashboard, TrendingUp, Bookmark, BarChart3,
  GitCompare, Newspaper, Grid2X2,
} from 'lucide-react'
import { APP_VERSION, GIT_SHA, formatBuildTime } from '@/lib/buildInfo'
import { Badge, type BadgeProps } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { dialogContent } from '@/lib/motion'

const QUICK_LINKS = [
  { to: '/',          label: 'Dashboard',  icon: <LayoutDashboard size={12} /> },
  { to: '/markets',   label: 'Markets',    icon: <TrendingUp size={12} /> },
  { to: '/trending',  label: 'Trending',   icon: <TrendingUp size={12} /> },
  { to: '/saved',     label: 'Watchlist',  icon: <Bookmark size={12} /> },
  { to: '/portfolio', label: 'Portfolio',  icon: <BarChart3 size={12} /> },
  { to: '/compare',   label: 'Compare',    icon: <GitCompare size={12} /> },
  { to: '/news',      label: 'News',       icon: <Newspaper size={12} /> },
  { to: '/heatmap',   label: 'Heatmap',    icon: <Grid2X2 size={12} /> },
]

const DATA_SOURCES = [
  { label: 'CoinGecko',       href: 'https://www.coingecko.com' },
  { label: 'CoinPaprika',     href: 'https://coinpaprika.com' },
  { label: 'Binance',         href: 'https://developers.binance.com' },
  { label: 'DeFiLlama',       href: 'https://defillama.com' },
  { label: 'blockchain.info', href: 'https://www.blockchain.com/explorer' },
  { label: 'Blockchair',      href: 'https://blockchair.com' },
  { label: 'Alternative.me',  href: 'https://alternative.me/crypto' },
  { label: 'CoinDesk',        href: 'https://www.coindesk.com' },
  { label: 'CoinTelegraph',   href: 'https://cointelegraph.com' },
  { label: 'Decrypt',         href: 'https://decrypt.co' },
]

interface Release {
  version: string
  date: string
  tag: 'major' | 'minor' | 'patch'
  summary: string
  changes: string[]
}

const CHANGELOG: Release[] = [
  {
    version: '1.3.0',
    date: '2026-05-08',
    tag: 'minor',
    summary: 'Mobile-first redesign + multi-source API failover.',
    changes: [
      'New BottomNav — sticky thumb-friendly tab bar (Home, Markets, Trending, Saved, Portfolio + More sheet for Compare / News / Heatmap), iOS safe-area aware.',
      'Markets, Saved, and Portfolio render as mobile cards below the md breakpoint; tables stay desktop-only.',
      'Compare and Trending switched from flex-wrap with hard-coded widths to responsive CSS grids (1 → 2 → 3 cols).',
      'Coin Detail header wraps cleanly on phones; back button is a 40 px chip on mobile, borderless icon on desktop; chart panel has graduated min-height (280 / 360 / 400 px).',
      'Decimal numeric keyboard (inputMode="decimal") on Portfolio quantity / price and on the Coin Detail price-alert input.',
      'Navigation actions grew to 40×40 px hit areas; filter buttons, watchlist stars, and remove-portfolio buttons all meet the 44 px guideline.',
      'Global @media (prefers-reduced-motion: reduce) collapses page transitions, price flash, and sheet animations to ~0 ms.',
      'iOS Safari viewport safety — main shell uses min-h-screen + min-h-[100dvh]; Footer changelog and SearchCommand dialogs use 100dvh-aware max-heights with internal scroll.',
      'SearchCommand: pt-20 → pt-6 sm:pt-20 so the dialog never pushes off-screen on landscape; result list scrolls inside the modal even with the on-screen keyboard open.',
      'API failover layer (lib/fetchWithFallback.ts) — fires on 429, network error, timeout, or 5xx; rethrows the primary error if everything fails.',
      'CoinPaprika fallback for the Markets list when CoinGecko 429s; Binance /klines fallback for the Coin Detail chart (top-20 coins via lib/binanceSymbols.ts); Blockchair fallback for blockchain.info Bitcoin stats.',
      'docs/mobile-qa.md — manual QA checklist for 320 / 375 / 390 / 430 / 768 px, iOS Safari, Android Chrome, landscape phones.',
      'body { overflow-x: hidden } to kill any incidental sideways scroll across the whole app.',
      'Test suite: 33 → 71 (added withFallback unit tests, plus growth from earlier passes).',
    ],
  },
  {
    version: '1.2.1',
    date: '2025-05-05',
    tag: 'patch',
    summary: 'CI hardening, release automation, community files, project settings.',
    changes: [
      'Split CI into 4 parallel jobs (lint, typecheck, test, build) — faster feedback, clearer failure attribution.',
      'New release.yml workflow — push a v* tag to auto-create a GitHub Release with dist zip and generated notes.',
      'vitest.config.ts now injects __APP_VERSION__, __BUILD_TIME__, __GIT_SHA__ — buildInfo works in test environment.',
      'CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md — community guidelines and vulnerability disclosure.',
      'GitHub issue templates (bug report, feature request) and PR template with CI + free-API checklist.',
      'README: CI/Release/version/license/Vercel badges, stale RSS2JSON reference replaced, Build Provenance section.',
      '.gitattributes (LF enforcement), .editorconfig (2-space/LF/final-newline), expanded .gitignore.',
      'CLAUDE.md — full project context for AI-assisted development.',
    ],
  },
  {
    version: '1.2.0',
    date: '2025-05-05',
    tag: 'minor',
    summary: 'News API overhaul, WebSocket stability, build provenance, footer.',
    changes: [
      'Replaced RSS2JSON (returning 422) with CryptoCompare News API — no API key, 50+ articles per load, dynamic source filtering.',
      'Fixed WebSocket "closed before connection established" warning — null all handlers before ws.close() to prevent ghost reconnect cycles.',
      'Added build-time injection: __APP_VERSION__, __BUILD_TIME__, __GIT_SHA__ via vite.config.ts.',
      'Added Footer with quick links, data-source credits, changelog, and MIT license.',
      'Created .env.example documenting build constants and confirming no API keys required.',
    ],
  },
  {
    version: '1.1.0',
    date: '2025-04-28',
    tag: 'minor',
    summary: 'Production hardening, CI/CD, performance, and resilience pass.',
    changes: [
      'GitHub Actions CI: lint → typecheck → test → build on every push and PR.',
      'Vercel: SPA rewrite rules, 1-year immutable cache for /assets/*, security headers (X-Frame-Options, CSP, Referrer-Policy).',
      'AbortController with 15s timeout on all fetch calls; skipped in test mode to avoid MSW conflict.',
      'WebSocket exponential backoff: 1s → 30s + jitter, resets on successful connect.',
      'TanStack Query devtools gated behind import.meta.env.DEV — zero prod bundle cost.',
      'ESLint v9 flat config: no-undef off for TS files, named memo functions for display-name rule.',
      'Navigation: mobile hamburger menu with AnimatePresence height animation, 2-col grid drawer.',
      'DeFiTVL and BitcoinStats: skeleton loaders, staggered entrance animations, lazy images.',
      'README rewritten with feature table, API table, architecture diagram, and deployment guide.',
    ],
  },
  {
    version: '1.0.0',
    date: '2025-04-14',
    tag: 'major',
    summary: 'Initial production release — all core features shipped.',
    changes: [
      'Live Prices: Binance WebSocket stream for 20 coins with price flash animations.',
      'Market Overview: CoinGecko top 250 with sort, filter, search, pagination.',
      'Market Heatmap: Recharts Treemap — instant green/red market snapshot.',
      'Crypto News: RSS feeds aggregated via RSS2JSON (CoinDesk, CoinTelegraph, Decrypt).',
      'DeFi TVL: DeFiLlama top chains + protocols + 90-day area chart.',
      'Bitcoin Network: hash rate, difficulty, tx volume, miner revenue.',
      'Fear & Greed Index: Alternative.me sentiment gauge.',
      'Portfolio Tracker: local P&L tracking with pie chart allocation.',
      'Watchlist: star coins, persistent across sessions via Zustand persist.',
      'Price Alerts: toast notifications when target price is crossed.',
      'Compare: normalized 30-day performance chart for up to 3 coins.',
      'Ctrl+K command palette search powered by cmdk.',
      '24h localStorage query cache — instant loads on revisit.',
      'Code-split lazy pages, React.memo on high-frequency render components.',
    ],
  },
]

const TAG_TONES: Record<Release['tag'], BadgeProps['tone']> = {
  major: 'default',
  minor: 'purple',
  patch: 'muted',
}

function ChangelogDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="inline-flex items-center gap-1 text-[11px] text-accent hover:text-accent/80 transition-colors font-mono group">
          <Tag size={10} />
          v{APP_VERSION}
          <span className="text-muted/70 group-hover:text-accent/60 transition-colors">— what&apos;s new?</span>
        </button>
      </Dialog.Trigger>

      <AnimatePresence>
        <Dialog.Portal>
          <Dialog.Overlay asChild>
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            />
          </Dialog.Overlay>
          <Dialog.Content asChild>
            <motion.div
              variants={dialogContent}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100vw-1.5rem)] sm:w-full max-w-2xl max-h-[calc(100dvh-2rem)] sm:max-h-[80vh] bg-surface border border-accent/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-border/20">
                <Dialog.Title className="font-bold text-base flex items-center gap-2">
                  <Tag size={15} className="text-accent" />
                  Changelog
                </Dialog.Title>
                <Dialog.Close asChild>
                  <Button variant="ghost" size="icon-sm" aria-label="Close changelog">
                    <X size={18} />
                  </Button>
                </Dialog.Close>
              </div>

              <ScrollArea className="flex-1 min-h-0">
                <div className="px-4 sm:px-6 py-4 flex flex-col gap-6">
                  {CHANGELOG.map((release) => (
                    <div key={release.version} className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-sm text-white">v{release.version}</span>
                        <Badge tone={TAG_TONES[release.tag]} uppercase>{release.tag}</Badge>
                        <span className="flex items-center gap-1 text-xs text-muted ml-auto">
                          <Clock size={11} />
                          {release.date}
                        </span>
                      </div>
                      <p className="text-sm text-muted">{release.summary}</p>
                      <ul className="flex flex-col gap-1.5">
                        {release.changes.map((c, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-muted/80 leading-relaxed">
                            <span className="text-accent mt-0.5 shrink-0">›</span>
                            {c}
                          </li>
                        ))}
                      </ul>
                      <div className="border-b border-border/10" />
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="px-4 sm:px-6 py-3 border-t border-border/20 flex items-center gap-2 sm:gap-3 text-xs text-muted/50">
                <GitCommit size={11} className="shrink-0" />
                <span className="font-mono truncate">
                  {GIT_SHA === 'local' ? 'local build' : GIT_SHA.slice(0, 7)}
                </span>
                <span className="ml-auto truncate">Built {formatBuildTime()}</span>
              </div>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </AnimatePresence>
    </Dialog.Root>
  )
}

const Footer = () => (
  <footer className="w-full max-w-7xl px-4 mt-10 mb-20 md:mb-6">
    <div className="border border-border/20 rounded-xl bg-surface/20 backdrop-blur-sm overflow-hidden">
      {/* Main grid — tighter padding + smaller gap; 1 col mobile / 3 col desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 p-4 sm:p-5">
        {/* Brand */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-bold uppercase tracking-[0.08em] text-[13px] leading-none">
              <span className="text-foreground">M4RKET</span>
              <span className="text-accent">VIEW</span>
            </span>
            <ChangelogDialog />
          </div>
          <p className="text-[11px] text-muted/80 leading-relaxed max-w-[260px]">
            A production-grade crypto dashboard built on free, no-key public APIs.
          </p>
          <div className="flex items-center gap-3 mt-1">
            <a
              href="https://github.com/zhenxiao-yu/M4rketView"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-muted hover:text-accent transition-colors"
            >
              <Github size={12} />
              Source
            </a>
            <a
              href="https://m4rket-view.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-muted hover:text-accent transition-colors"
            >
              <ExternalLink size={12} />
              Live site
            </a>
          </div>
        </div>

        {/* Pages */}
        <div className="flex flex-col gap-2">
          <h3 className="text-[10px] font-semibold text-muted uppercase tracking-wider">Pages</h3>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {QUICK_LINKS.map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                className="inline-flex items-center gap-1.5 text-[11px] text-muted hover:text-accent transition-colors py-0.5"
              >
                <span className="text-muted/50">{icon}</span>
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Data sources — chip wrap, no descriptions */}
        <div className="flex flex-col gap-2">
          <h3 className="text-[10px] font-semibold text-muted uppercase tracking-wider">Data Sources</h3>
          <div className="flex flex-wrap gap-1.5">
            {DATA_SOURCES.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface/60 border border-border/20 text-[10px] text-muted hover:text-accent hover:border-accent/30 transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/10 px-4 sm:px-5 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-1 text-[10px] text-muted/50">
        <p>
          © {new Date().getFullYear()} Mark Yu · Released under the{' '}
          <a
            href="https://github.com/zhenxiao-yu/M4rketView/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent/70 hover:text-accent transition-colors"
          >
            MIT License
          </a>
        </p>
        <p className="font-mono text-muted/40">
          No API keys · No tracking · No cost
        </p>
      </div>
    </div>
  </footer>
)

export default Footer
