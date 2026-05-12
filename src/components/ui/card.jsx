import React from 'react'
import { cn } from '@/lib'

export function Card({ className, ...props }) {
  return <div className={cn('rounded-3xl border bg-white shadow-sm', className)} {...props} />
}

export function CardContent({ className, ...props }) {
  return <div className={cn('p-6', className)} {...props} />
}
