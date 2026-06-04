'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Bell, Search, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Your cinematic world' },
  '/dashboard/discover': { title: 'Discover', subtitle: 'Find people who love what you love' },
  '/dashboard/matches': { title: 'Matches', subtitle: 'Your highest compatibility connections' },
  '/dashboard/connections': { title: 'Connections', subtitle: 'People you are connected with' },
  '/dashboard/profile': { title: 'Profile', subtitle: 'Your cinematic identity' },
}

export function DashboardHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const page = PAGE_TITLES[pathname] || PAGE_TITLES['/dashboard']

  const handleSignOut = async () => {
    await signOut()
    router.replace('/login')
  }

  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

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
          <div className="flex items-center gap-2 ml-1 pl-3 border-l border-white/8">
            <div className="w-8 h-8 rounded-full bg-[#E50914]/20 border border-[#E50914]/30 flex items-center justify-center">
              <span className="text-[#E50914] text-xs font-bold">{initials}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="w-8 h-8 rounded-lg glass border border-white/8 flex items-center justify-center text-[#737373] hover:text-[#E50914] transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
