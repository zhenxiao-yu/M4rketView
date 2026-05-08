import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export const inputClass =
  'w-full rounded-lg bg-gray-200/60 border border-gray-100/20 text-sm ' +
  'px-3 py-2.5 outline-none transition-colors ' +
  'placeholder:text-gray-100/50 ' +
  'focus:border-cyan/60 focus:bg-gray-200/80 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed'

export type InputProps = InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  return <input ref={ref} className={cn(inputClass, className)} {...props} />
})
