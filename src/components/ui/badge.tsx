import * as React from 'react'
import { cn } from '../../lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
    secondary: 'bg-white/10 text-white/70 border-white/20',
    destructive: 'bg-red-600/20 text-red-400 border-red-600/30',
    outline: 'border border-white/20 text-white/70',
    success: 'bg-green-600/20 text-green-400 border-green-600/30',
  }
  return (
    <div className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors', variants[variant], className)} {...props} />
  )
}
export { Badge }
