import React from 'react'
import { cn } from '@/lib'

const variants = {
  default: 'bg-[#2C241D] text-white hover:bg-[#46382C]',
  secondary: 'bg-[#FFE3B8] text-[#2C241D] hover:bg-[#FFD99E]',
  outline: 'border border-[#D8B489] bg-transparent text-[#2C241D] hover:bg-[#FFF7EC]',
}

export function Button({ className, variant = 'default', ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-50',
        variants[variant] || variants.default,
        className
      )}
      {...props}
    />
  )
}
