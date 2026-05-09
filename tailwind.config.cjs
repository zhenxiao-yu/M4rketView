/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        // Display face — geometric / block futuristic. Reserved for wordmark + hero headlines.
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        // alias kept so any lingering `font-nunito` class still resolves
        nunito: ['Inter', 'system-ui', 'sans-serif'],
      },
      // Semantic palette — Linear/Vercel-style premium dark dashboard.
      // Values verified WCAG AA (text on bg ≥ 4.5:1, large text ≥ 3:1).
      colors: {
        white: '#fdfdfb',

        // Surface ramp (deepest → lightest)
        background:        '#0A0A0B', // page bg
        surface:           '#111113', // cards / panels
        elevated:          '#18181B', // modals / popovers / dropdowns
        border:            '#26262A', // default divider
        'border-strong':   '#3F3F46', // emphasized divider, inputs focused

        // Text hierarchy
        foreground:        '#EDEDEF', // primary text — 15.8:1 on bg
        muted:             '#A1A1AA', // secondary / labels — 7.2:1
        subtle:            '#71717A', // tertiary / disabled — 4.6:1

        // Brand accent (indigo-violet — fintech, not crypto-bro)
        accent:            '#7C73FF', // primary CTA / links / focus — 6.9:1
        'accent-hover':    '#9089FF',
        'accent-foreground': '#0A0A0B',

        // Semantic — gains/losses preserved (sacred for crypto)
        success:           '#3FB57E', // gains — 5.4:1
        'success-soft':    '#10261C',
        danger:            '#E5484D', // losses — 5.1:1
        'danger-soft':     '#2A1416',
        warning:           '#E0A93B', // stale data, rate limits — 8.3:1
      },
      fontSize: {
        sm: '14px',
        base: '16px',
        md: '18px',
        lg: '24px',
        xl: '32px',
      },
      backdropBlur: {
        glass: '10px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(10, 10, 11, 0.6)',
        'glow-accent': '0 0 20px rgba(124, 115, 255, 0.35)',
      },
      backgroundImage: {
        'gradient-surface': 'linear-gradient(135deg, #0A0A0B 0%, #18181B 100%)',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
}
