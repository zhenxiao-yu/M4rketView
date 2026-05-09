import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

const sizeClass: Record<NonNullable<SpinnerProps['size']>, string> = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-10 h-10 border-[3px]',
}

export function Spinner({ size = 'md', label = 'Loading', className, ...props }: SpinnerProps) {
  return (
    <div role="status" aria-label={label} className={cn('inline-block', className)} {...props}>
      <div
        aria-hidden="true"
        className={cn(
          'rounded-full border-cyan border-b-transparent animate-spin',
          sizeClass[size],
        )}
      />
      <span className="sr-only">{label}…</span>
    </div>
  )
}
