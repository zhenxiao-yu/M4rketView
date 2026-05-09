import { forwardRef, type HTMLAttributes } from 'react'
import { type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { badgeVariants } from './Badge.variants'

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
