import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

/**
 * Single skeleton primitive used across the app. Replaces the seven duplicate
 * implementations that grew up over time. `prefers-reduced-motion` already
 * neutralises `animate-pulse` via index.css.
 */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="status"
      aria-hidden="true"
      className={cn('animate-pulse rounded-md bg-surface/50', className)}
      {...props}
    />
  )
}
