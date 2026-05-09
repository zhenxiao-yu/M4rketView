import { forwardRef, type HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

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

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, tone, interactive, padding, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(cardVariants({ tone, interactive, padding }), className)}
      {...props}
    />
  )
})

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardHeader({ className, ...props }, ref) {
    return <div ref={ref} className={cn('flex items-center gap-2 mb-3', className)} {...props} />
  },
)

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  function CardTitle({ className, ...props }, ref) {
    return <h3 ref={ref} className={cn('text-sm font-semibold', className)} {...props} />
  },
)

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardContent({ className, ...props }, ref) {
    return <div ref={ref} className={cn('', className)} {...props} />
  },
)
