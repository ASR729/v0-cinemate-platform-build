'use client'

import { motion } from 'framer-motion'
import {
  Sparkles,
  Users,
  MessageSquare,
  BookMarked,
  ArrowRight,
  Compass,
  Film,
  Tv,
} from 'lucide-react'
import Link from 'next/link'
import { Logo } from '@/components/cinemate/Logo'

const MODULE_CARDS = [
  {
    icon: Sparkles,
    label: 'Matches',
    description: 'See who shares your cinematic soul',
    href: '/dashboard/matches',
    color: 'from-[#E50914]/20 to-transparent',
    accent: '#E50914',
    soon: true,
  },
  {
    icon: Users,
    label: 'Communities',
    description: 'Join fandoms and film circles',
    href: '/dashboard/communities',
    color: 'from-blue-900/20 to-transparent',
    accent: '#3b82f6',
    soon: true,
  },
  {
    icon: MessageSquare,
    label: 'Messages',
    description: 'Chat with your connections',
    href: '/dashboard/messages',
    color: 'from-purple-900/20 to-transparent',
    accent: '#8b5cf6',
    soon: true,
  },
  {
    icon: BookMarked,
    label: 'Watchlists',
    description: 'Build and share curated lists',
    href: '/dashboard/watchlists',
    color: 'from-amber-900/20 to-transparent',
    accent: '#f59e0b',
    soon: true,
  },
]

const STATS = [
  { label: 'Profile Complete', value: '100%', icon: Compass },
  { label: 'Genres Selected', value: '—', icon: Film },
  { label: 'Movies Saved', value: '—', icon: Film },
  { label: 'Series Saved', value: '—', icon: Tv },
]

function ModuleCard({ card, index }: { card: typeof MODULE_CARDS[0]; index: number }) {
  const Icon = card.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
      whileHover={{ y: -2 }}
      className="relative glass rounded-xl p-5 border border-white/5 hover:border-white/12 transition-all duration-300 overflow-hidden group cursor-pointer"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-60`} />
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${card.accent}20`, border: `1px solid ${card.accent}30` }}
          >
            <Icon className="w-5 h-5" style={{ color: card.accent }} />
          </div>
          {card.soon && (
            <span className="text-[9px] font-semibold uppercase tracking-wider text-[#737373] bg-white/5 px-2 py-1 rounded-full">
              Soon
            </span>
          )}
        </div>
        <h3 className="text-white font-semibold text-base mb-1">{card.label}</h3>
        <p className="text-[#737373] text-xs leading-relaxed">{card.description}</p>
        <div className="mt-4 flex items-center gap-1 text-[#404040] group-hover:text-[#737373] transition-colors">
          <span className="text-xs">Explore</span>
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </motion.div>
  )
}

export default function DashboardPage() {
  return (
    <div className="px-6 lg:px-8 py-8 max-w-5xl mx-auto">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative glass rounded-2xl p-6 md:p-8 border border-white/5 overflow-hidden mb-8"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E50914]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Logo size="sm" href="/" />
              <span className="text-[#737373] text-xs">Dashboard</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">
              Welcome to CineMate.
            </h2>
            <p className="text-[#737373] text-sm leading-relaxed max-w-md">
              Your cinematic profile is live. As features roll out, you&apos;ll find your people right here.
            </p>
          </div>
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-[#E50914]/15 border border-[#E50914]/20 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-[#E50914]" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {STATS.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 + i * 0.05, duration: 0.4 }}
              className="glass rounded-xl p-4 border border-white/5"
            >
              <p className="text-[#E50914] font-bold text-xl mb-0.5">{stat.value}</p>
              <p className="text-[#737373] text-xs">{stat.label}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Module cards */}
      <div className="mb-6">
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-[#a3a3a3] text-sm font-medium mb-4 uppercase tracking-widest"
        >
          Platform Modules
        </motion.h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MODULE_CARDS.map((card, i) => (
            <ModuleCard key={card.label} card={card} index={i} />
          ))}
        </div>
      </div>

      {/* Complete onboarding CTA — only if not done */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="glass rounded-xl p-5 border border-[#E50914]/15 flex items-center justify-between gap-4"
      >
        <div>
          <p className="text-white text-sm font-semibold mb-0.5">Your profile is live</p>
          <p className="text-[#737373] text-xs">Edit your preferences anytime from your profile page.</p>
        </div>
        <Link
          href="/dashboard/profile"
          className="flex-shrink-0 text-[#E50914] hover:text-[#f40612] text-sm font-medium flex items-center gap-1 transition-colors"
        >
          View Profile
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </motion.div>
    </div>
  )
}
