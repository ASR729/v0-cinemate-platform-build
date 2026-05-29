'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'

// Cinematic movie title cards for background aesthetic
const BG_TITLES = [
  { title: 'INCEPTION', year: '2010', position: 'top-[15%] left-[5%] rotate-[-8deg]', delay: 0 },
  { title: 'PARASITE', year: '2019', position: 'top-[10%] right-[8%] rotate-[6deg]', delay: 0.1 },
  { title: 'INTERSTELLAR', year: '2014', position: 'top-[45%] left-[3%] rotate-[-4deg]', delay: 0.15 },
  { title: 'DARK', year: '2017', position: 'top-[60%] right-[5%] rotate-[5deg]', delay: 0.2 },
  { title: 'DUNE', year: '2021', position: 'bottom-[25%] left-[8%] rotate-[3deg]', delay: 0.05 },
  { title: 'OPPENHEIMER', year: '2023', position: 'bottom-[30%] right-[10%] rotate-[-5deg]', delay: 0.25 },
  { title: 'THE BEAR', year: '2022', position: 'top-[30%] right-[20%] rotate-[8deg]', delay: 0.3 },
  { title: 'SEVERANCE', year: '2022', position: 'top-[75%] left-[20%] rotate-[-3deg]', delay: 0.18 },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated background film strip aesthetic */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-black" />

        {/* Red vignette glow */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#E50914]/5 blur-[120px]" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E50914]/3 blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E50914]/3 blur-[100px]" />
        </div>

        {/* Floating movie title cards */}
        {BG_TITLES.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.06, scale: 1 }}
            transition={{ delay: item.delay + 0.5, duration: 1 }}
            className={`absolute ${item.position} select-none pointer-events-none`}
          >
            <div className="border border-white/20 rounded px-3 py-2 bg-white/5 backdrop-blur-sm">
              <p className="text-white text-xs font-mono font-bold tracking-[0.2em]">{item.title}</p>
              <p className="text-white/60 text-[9px] font-mono">{item.year}</p>
            </div>
          </motion.div>
        ))}

        {/* Grid lines subtle */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />

        {/* Bottom fade to black */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] glow-pulse" />
          <span className="text-[#a3a3a3] text-xs font-medium tracking-wide uppercase">
            AI-Powered Social Platform
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight mb-6 text-balance"
        >
          Connect Through
          <br />
          <span className="text-gradient-accent">Stories.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-[#a3a3a3] text-lg sm:text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto mb-10 text-pretty"
        >
          Discover people who share your love for movies, series, characters, and unforgettable stories.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 bg-[#E50914] hover:bg-[#f40612] text-white font-semibold text-base px-8 py-4 rounded-lg transition-all duration-200 hover:shadow-2xl hover:shadow-[#E50914]/30 w-full sm:w-auto justify-center"
          >
            Get Started
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="#features"
            className="group inline-flex items-center gap-2 glass border border-white/15 hover:border-white/30 text-white font-semibold text-base px-8 py-4 rounded-lg transition-all duration-200 w-full sm:w-auto justify-center"
          >
            <Play className="w-4 h-4 fill-white/70" />
            Explore
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-10 text-[#737373] text-sm"
        >
          Join thousands of film lovers building real connections
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-0.5 h-8 bg-gradient-to-b from-[#E50914]/50 to-transparent rounded-full"
        />
      </motion.div>
    </section>
  )
}
