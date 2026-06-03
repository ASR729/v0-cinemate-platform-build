'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Compass,
  Sparkles,
  Users,
  MessageSquare,
  BookMarked,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'
import { Logo } from '@/components/cinemate/Logo'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Discover', icon: Compass, href: '/dashboard/discover', badge: null },
  { label: 'Matches', icon: Sparkles, href: '/dashboard/matches', badge: null },
  { label: 'Connections', icon: Users, href: '/dashboard/connections', badge: null },
  { label: 'Messages', icon: MessageSquare, href: '/dashboard/messages', badge: 'Soon' },
  { label: 'Watchlists', icon: BookMarked, href: '/dashboard/watchlists', badge: 'Soon' },
  { label: 'Profile', icon: User, href: '/dashboard/profile', badge: null },
]

function NavItem({
  item,
  collapsed,
  active,
}: {
  item: (typeof NAV_ITEMS)[0]
  collapsed: boolean
  active: boolean
}) {
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
        active
          ? 'bg-[#E50914]/15 text-white'
          : 'text-[#737373] hover:text-[#a3a3a3] hover:bg-white/5'
      )}
    >
      {/* Active indicator */}
      {active && (
        <motion.div
          layoutId="activeNavItem"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#E50914] rounded-r-full"
        />
      )}

      <Icon className={cn('w-5 h-5 flex-shrink-0 transition-colors', active ? 'text-[#E50914]' : '')} />

      {!collapsed && (
        <span className="flex-1 text-sm font-medium truncate">{item.label}</span>
      )}

      {!collapsed && item.badge && (
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-white/8 text-[#737373]">
          {item.badge}
        </span>
      )}
    </Link>
  )
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const sidebarContent = (
    <div className={cn('flex flex-col h-full', collapsed ? 'w-16' : 'w-60')}>
      {/* Logo + toggle */}
      <div className="flex items-center justify-between px-3 py-5 flex-shrink-0">
        {!collapsed && <Logo size="sm" />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-[#737373] hover:text-white hover:bg-white/8 transition-all ml-auto"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronRight className={cn('w-4 h-4 transition-transform', !collapsed && 'rotate-180')} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto" aria-label="Main navigation">
        {NAV_ITEMS.map(item => (
          <NavItem
            key={item.href}
            item={item}
            collapsed={collapsed}
            active={pathname === item.href}
          />
        ))}
      </nav>

      {/* Bottom user area */}
      <div className="px-2 py-4 border-t border-white/5 flex-shrink-0">
        <div className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg', collapsed ? 'justify-center' : '')}>
          <div className="w-8 h-8 rounded-full bg-[#E50914]/20 border border-[#E50914]/30 flex items-center justify-center flex-shrink-0">
            <span className="text-[#E50914] text-xs font-bold font-serif">C</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">CineMate User</p>
              <p className="text-[#737373] text-xs">@cinemateuser</p>
            </div>
          )}
          {!collapsed && (
            <button
              className="text-[#737373] hover:text-[#E50914] transition-colors p-1 rounded"
              aria-label="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden lg:flex bg-[#0a0a0a] border-r border-white/5 flex-shrink-0 overflow-hidden"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 glass rounded-xl flex items-center justify-center text-white"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed top-0 left-0 h-full z-50 bg-[#0a0a0a] border-r border-white/5"
            >
              <div className="absolute top-4 right-3">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#737373] hover:text-white hover:bg-white/8 transition-all"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
