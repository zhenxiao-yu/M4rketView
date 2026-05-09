import { forwardRef, type HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full font-medium border whitespace-nowrap',
  {
    variants: {
      tone: {
        default:     'bg-accent/20 text-accent border-accent/30',
        muted:       'bg-muted/15 text-muted border-border/20',
        success:     'bg-success/20 text-success border-success/30',
        destructive: 'bg-danger/20 text-danger border-danger/30',
        warning:     'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        purple:      'bg-purple-500/20 text-purple-300 border-purple-500/30',
      },
      size: {
        sm: 'text-[10px] px-2 py-0.5',
        md: 'text-xs px-2.5 py-0.5',
        lg: 'text-xs px-3 py-1',
      },
      uppercase: { true: 'uppercase tracking-wide', false: '' },
    },
    defaultVariants: { tone: 'default', size: 'md', uppercase: false },
  },
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, tone, size, uppercase, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(badgeVariants({ tone, size, uppercase }), className)}
      {...props}
    />
  )
})
