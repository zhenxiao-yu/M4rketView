import { forwardRef, type HTMLAttributes } from 'react'
import { type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { cardVariants } from './Card.variants'

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
