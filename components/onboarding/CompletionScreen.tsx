'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/cinemate/Logo'
import { Sparkles, ArrowRight } from 'lucide-react'

interface CompletionScreenProps {
  displayName: string
}

export function CompletionScreen({ displayName }: CompletionScreenProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="w-[600px] h-[600px] rounded-full border border-[#E50914]/10"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.15, ease: 'easeOut' }}
          className="absolute w-[400px] h-[400px] rounded-full border border-[#E50914]/15"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          className="absolute w-[200px] h-[200px] rounded-full bg-[#E50914]/8 blur-3xl"
        />
      </div>

      <div className="relative z-10 text-center max-w-md">
        {/* Animated sparkle icon */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#E50914] shadow-2xl shadow-[#E50914]/40 mb-8 mx-auto"
        >
          <Sparkles className="w-9 h-9 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Logo size="md" href="/" className="inline-flex mb-4" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="font-serif text-3xl md:text-4xl font-bold text-white mb-4 text-balance"
        >
          Your CineMate profile is ready{displayName ? `, ${displayName.split(' ')[0]}` : ''}.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6 }}
          className="text-[#737373] text-base leading-relaxed mb-10 text-pretty"
        >
          Your cinematic identity has been crafted. The world of connections built through shared stories awaits.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/dashboard')}
          className="inline-flex items-center gap-3 bg-[#E50914] hover:bg-[#f40612] text-white font-semibold text-base px-10 py-4 rounded-xl transition-all duration-200 hover:shadow-2xl hover:shadow-[#E50914]/30 group"
        >
          Enter CineMate
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </motion.button>
      </div>
    </div>
  )
}
