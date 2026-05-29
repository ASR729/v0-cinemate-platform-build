'use client'

import Link from 'next/link'
import { Logo } from '@/components/cinemate/Logo'

const LINKS = [
  { label: 'About', href: '#' },
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Contact', href: '#' },
]

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="sm" />

          <nav className="flex items-center gap-6 flex-wrap justify-center" aria-label="Footer navigation">
            {LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[#737373] hover:text-[#a3a3a3] transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <p className="text-[#404040] text-sm">
            &copy; {new Date().getFullYear()} CineMate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
