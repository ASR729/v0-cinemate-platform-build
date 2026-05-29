'use client'

import { motion } from 'framer-motion'
import { LucideIcon, Lock } from 'lucide-react'

interface ModulePlaceholderProps {
  icon: LucideIcon
  title: string
  description: string
  comingSoon?: boolean
  cta?: string
}

export function ModulePlaceholder({
  icon: Icon,
  title,
  description,
  comingSoon = true,
  cta,
}: ModulePlaceholderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center text-center py-20 px-6 max-w-sm mx-auto"
    >
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl glass border border-white/10 flex items-center justify-center">
          <Icon className="w-9 h-9 text-[#E50914]/60" />
        </div>
        {comingSoon && (
          <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#141414] border border-white/10 flex items-center justify-center">
            <Lock className="w-3.5 h-3.5 text-[#737373]" />
          </div>
        )}
      </div>

      {comingSoon && (
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#E50914] bg-[#E50914]/10 px-3 py-1 rounded-full mb-4">
          Coming Soon
        </span>
      )}

      <h3 className="text-white font-semibold text-xl mb-3">{title}</h3>
      <p className="text-[#737373] text-sm leading-relaxed">{description}</p>

      {cta && (
        <button className="mt-6 glass border border-white/10 hover:border-white/20 text-[#a3a3a3] hover:text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-200">
          {cta}
        </button>
      )}
    </motion.div>
  )
}
