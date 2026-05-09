import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export const inputClass =
  'w-full rounded-lg bg-surface/60 border border-border/20 text-sm ' +
  'px-3 py-2.5 outline-none transition-colors ' +
  'placeholder:text-muted/50 ' +
  'focus:border-accent/60 focus:bg-surface/80 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed'

export type InputProps = InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  return <input ref={ref} className={cn(inputClass, className)} {...props} />
})
