import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap ' +
    'transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 ' +
    'focus-visible:ring-cyan/60 focus-visible:ring-offset-1 focus-visible:ring-offset-gray-300 ' +
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:   'bg-cyan text-gray-300 hover:bg-cyan/85',
        secondary: 'bg-gray-200/40 border border-gray-100/20 text-white hover:border-cyan/50 hover:text-cyan',
        outline:   'border border-gray-100/30 bg-transparent text-gray-100 hover:border-cyan hover:text-cyan',
        ghost:     'bg-transparent text-gray-100 hover:text-cyan hover:bg-gray-200/40',
        link:      'bg-transparent text-cyan hover:underline underline-offset-4 px-0',
        destructive: 'bg-red/90 text-white hover:bg-red',
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

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, asChild = false, ...props },
  ref,
) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
})
