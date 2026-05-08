# M4rketView Mobile QA Checklist

Manual verification checklist for the mobile-first release. Run through this in browser
devtools device emulation **and** on at least one real iOS Safari + Android Chrome session
before tagging a mobile release.

## How to test

1. `npm run dev` → open `http://localhost:3000`
2. Open devtools → toggle device emulation (Cmd/Ctrl + Shift + M).
3. For each viewport below, walk every page once.
4. Repeat the smoke checklist on a real device.

## Viewports

| Width | Device class | Notes |
|---|---|---|
| **320 px** | iPhone SE 1st gen, narrow Android | Tightest target — anything that breaks here breaks everywhere. |
| **375 px** | iPhone SE 2/3, iPhone 12 mini | Common iOS baseline. |
| **390 px** | iPhone 12/13/14/15 | Most-used iOS width. |
| **430 px** | iPhone 14/15 Pro Max | Larger phones. |
| **768 px** | iPad portrait | Tablet boundary — `md:` breakpoint kicks in. |
| **1024 px+** | Desktop | Make sure mobile changes have not regressed desktop. |

## Real-device matrix

- [ ] iOS Safari — latest
- [ ] iOS Safari — landscape (URL bar collapse + safe-area handling)
- [ ] Android Chrome — latest
- [ ] Android Chrome — landscape
- [ ] One older device if available (iPhone SE / mid-range Android)

---

## Per-page smoke checklist

For every page in this list, confirm all checks below.

Pages: Dashboard · Markets · Trending · Saved · Portfolio · Compare · Coin Detail · News · Heatmap

### Layout

- [ ] No horizontal scroll at any width (try scrolling sideways — body must not move).
- [ ] Bottom nav does not cover meaningful page content (last card, footer, primary CTA).
- [ ] Page bottom padding clears the bottom nav (`pb-20 md:pb-0` on the main shell).
- [ ] Cards do not feel cramped at 320 px; hierarchy is still readable at 430 px.
- [ ] Tap targets feel ≥ 40 px tall — no accidental missed taps.

### Typography & contrast

- [ ] Body copy stays readable without zoom.
- [ ] Headings do not overflow on long coin names (Polkadot / Stellar / Polygon-Ecosystem-Token).
- [ ] Red/green numbers are paired with up/down icons — no info conveyed by color alone.

### Charts

- [ ] Recharts wrappers fill 100 % of their container width.
- [ ] Heatmap labels are still legible — small tiles drop their label automatically.
- [ ] Compare line chart is not cropped on the right at 320 px.
- [ ] Coin-detail PriceChart never collapses below ~280 px tall.

### Tables / lists

- [ ] Markets table renders as cards under `md`, not a horizontally-scrolling grid.
- [ ] Portfolio renders as cards under `md`.
- [ ] Watchlist (Saved) feels identical to Markets on mobile.

---

## Navigation

- [ ] Bottom nav is visible only below `md` and is sticky to the bottom edge.
- [ ] Bottom nav respects iOS safe-area inset (try landscape on a notched phone).
- [ ] Active route is obvious in the bottom bar (cyan tint).
- [ ] "More" sheet on the bottom bar opens Compare / News / Heatmap and dismisses on selection or backdrop tap.
- [ ] Top mobile bar shows the current page label and the search / alerts / theme actions only — no hamburger drawer.
- [ ] Compare badge appears on the More button when coins are queued.

---

## Forms & dialogs

### Portfolio — Add Coin

- [ ] Inputs stack vertically below `sm`.
- [ ] Quantity and Avg buy price open the **decimal numeric** keyboard (iOS/Android), not the alphabet keyboard.
- [ ] The Add button is full-width and at least 44 px tall on mobile.
- [ ] Search dropdown does not get hidden behind the bottom nav.

### Coin Detail — price alert

- [ ] Modal fits within the viewport at 320 px height.
- [ ] Number input uses the decimal keyboard.
- [ ] The currently focused input is not covered when the keyboard opens (scroll into view).

### SearchCommand (`Ctrl/⌘ + K`)

- [ ] Opens with reasonable top padding on phones — not pushed off-screen on landscape.
- [ ] Backdrop tap closes the dialog.
- [ ] The input remains visible while typing on a phone with the keyboard open.
- [ ] Result list scrolls inside the dialog, not the page.
- [ ] Footer key-hints row wraps cleanly at 320 px and never overflows.

### Footer changelog dialog

- [ ] Dialog body scrolls inside the modal — never the page.
- [ ] Modal does not clip on iPhone SE; bottom buttons stay reachable.
- [ ] Padding feels comfortable at 320 px and at 768 px.

---

## Motion & accessibility

- [ ] Toggle "Reduce motion" in OS settings → page transitions, price-flash, and
      mobile sheet animations all collapse to ~0 ms.
- [ ] Keyboard tab order is sensible across the bottom nav, top actions, and the
      currently-focused page content.
- [ ] Visible focus rings remain on every interactive control.

---

## Known-not-fixed

These are tracked as follow-ups, not blockers:

- React Router v6 future-flag warnings still print in tests (cosmetic only).
- The Recharts bundle (~450 KB / ~120 KB gz) dominates the build — chart-heavy
  pages are the slowest to first paint on a cold mobile cache.
