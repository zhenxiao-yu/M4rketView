import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap ' +
    'transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 ' +
    'focus-visible:ring-accent/60 focus-visible:ring-offset-1 focus-visible:ring-offset-background ' +
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:   'bg-accent text-accent-foreground hover:bg-accent/85',
        secondary: 'bg-surface/40 border border-border/20 text-white hover:border-accent/50 hover:text-accent',
        outline:   'border border-border/30 bg-transparent text-muted hover:border-accent hover:text-accent',
        ghost:     'bg-transparent text-muted hover:text-accent hover:bg-surface/40',
        link:      'bg-transparent text-accent hover:underline underline-offset-4 px-0',
        destructive: 'bg-danger/90 text-white hover:bg-danger',
      },
      size: {
        sm:      'min-h-[32px] text-xs px-2.5 py-1.5',
        default: 'min-h-[40px] text-sm px-4 py-2',
        lg:      'min-h-[44px] text-sm px-5 py-2.5',
        icon:    'min-h-[40px] min-w-[40px] p-0',
        'icon-sm': 'min-h-[32px] min-w-[32px] p-0',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  },
)
