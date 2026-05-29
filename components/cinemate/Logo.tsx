'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  href?: string
}

export function Logo({ size = 'md', className, href = '/' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
  }

  const content = (
    <span className={cn('font-serif font-bold tracking-tight', sizeClasses[size], className)}>
      <span className="text-white">Cine</span>
      <span className="text-[#E50914]">Mate</span>
    </span>
  )

  if (!href) return content

  return (
    <Link href={href} className="inline-flex items-center hover:opacity-90 transition-opacity">
      {content}
    </Link>
  )
}
