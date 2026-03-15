import type { ButtonHTMLAttributes } from 'react'

interface KeypadButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'action' | 'primary' | 'operator' | 'fraction' | 'memory' | 'trig'
  wide?: boolean
  tall?: boolean
}

const variantClasses: Record<string, string> = {
  default: 'bg-slate-700 hover:bg-slate-600 text-slate-100 active:bg-slate-500',
  action: 'bg-slate-600 hover:bg-slate-500 text-slate-200 active:bg-slate-400',
  primary: 'bg-orange-500 hover:bg-orange-400 text-white font-bold active:bg-orange-300',
  operator: 'bg-amber-600 hover:bg-amber-500 text-white font-bold active:bg-amber-400',
  fraction: 'bg-slate-700 hover:bg-slate-600 text-amber-300 text-xs active:bg-slate-500',
  memory: 'bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs active:bg-slate-600',
  trig: 'bg-slate-700 hover:bg-slate-600 text-emerald-300 text-sm active:bg-slate-500',
}

export default function KeypadButton({
  variant = 'default',
  wide = false,
  tall = false,
  className = '',
  children,
  ...props
}: KeypadButtonProps) {
  return (
    <button
      {...props}
      className={[
        'flex items-center justify-center rounded-lg font-mono font-medium',
        'transition-all duration-75 select-none cursor-pointer',
        'border border-slate-600/30 shadow-sm',
        'text-xl leading-none py-4',
        wide ? 'col-span-2' : '',
        tall ? 'row-span-2' : '',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  )
}
