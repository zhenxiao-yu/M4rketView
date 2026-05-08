import type { Variants, Transition } from 'framer-motion'

/**
 * Shared motion presets so animations feel like one product, not seven.
 * - `pageTransition` — used by the route-level AnimatePresence in Home.tsx
 * - `fadeInUp` — drop-in entrance for cards, panels, dialog content
 * - `staggerContainer` / `staggerChild` — list item entrance with sensible cadence
 * - `dialogContent` — modals, sheets, command palettes
 */

const easeOut: Transition['ease'] = [0.16, 1, 0.3, 1]
const easeIn: Transition['ease'] = [0.4, 0, 1, 1]

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 14, filter: 'blur(3px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.3, ease: easeOut } },
  exit:    { opacity: 0, y: -6, filter: 'blur(2px)', transition: { duration: 0.15, ease: easeIn } },
}

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.32, ease: easeOut } },
  exit:    { opacity: 0, y: -4, transition: { duration: 0.15, ease: easeIn } },
}

export const dialogContent: Variants = {
  initial: { opacity: 0, scale: 0.96, y: 8 },
  animate: { opacity: 1, scale: 1,    y: 0, transition: { duration: 0.18, ease: easeOut } },
  exit:    { opacity: 0, scale: 0.97, y: 4, transition: { duration: 0.12, ease: easeIn } },
}

export const staggerContainer: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
}

export const staggerChild: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: easeOut } },
}

/** Subtle, app-wide hover scale. Replaces the wild mix of scale-110 / scale-[1.02]. */
export const hoverScale = 'transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.99]'

export const easings = { easeOut, easeIn }
