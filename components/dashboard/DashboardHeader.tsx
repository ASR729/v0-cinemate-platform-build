'use client'

import { usePathname } from 'next/navigation'
import { Bell, Search } from 'lucide-react'

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Discover', subtitle: 'Find people who love what you love' },
  '/dashboard/matches': { title: 'Matches', subtitle: 'Your cinematic connections' },
  '/dashboard/communities': { title: 'Communities', subtitle: 'Find your tribe' },
  '/dashboard/messages': { title: 'Messages', subtitle: 'Stay in touch' },
  '/dashboard/watchlists': { title: 'Watchlists', subtitle: 'Your curated collections' },
  '/dashboard/profile': { title: 'Profile', subtitle: 'Your cinematic identity' },
}

export function DashboardHeader() {
  const pathname = usePathname()
  const page = PAGE_TITLES[pathname] || PAGE_TITLES['/dashboard']

  return (
    <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Page title (left-padded on mobile for hamburger) */}
        <div className="pl-12 lg:pl-0">
          <h1 className="text-white font-semibold text-lg leading-none">{page.title}</h1>
          <p className="text-[#737373] text-xs mt-0.5">{page.subtitle}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            className="w-9 h-9 rounded-lg glass border border-white/8 flex items-center justify-center text-[#737373] hover:text-white transition-colors"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            className="relative w-9 h-9 rounded-lg glass border border-white/8 flex items-center justify-center text-[#737373] hover:text-white transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#E50914]" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  )
}
