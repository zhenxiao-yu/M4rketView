import { cva } from 'class-variance-authority'

export const cardVariants = cva(
  'rounded-xl border border-border/20 transition-colors',
  {
    variants: {
      tone: {
        default:   'bg-surface/40',
        muted:     'bg-surface/30',
        outline:   'bg-transparent',
      },
      interactive: {
        true:  'hover:border-accent/40',
        false: '',
      },
      padding: {
        none: '',
        sm:   'p-3',
        md:   'p-4',
        lg:   'p-5',
      },
    },
    defaultVariants: { tone: 'default', interactive: false, padding: 'lg' },
  },
)
