'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { User, Sparkles, Users, Brain, BookMarked } from 'lucide-react'

const FEATURES = [
  {
    icon: User,
    title: 'Entertainment Identity',
    description: 'Build your cinematic profile from your favorite genres, movies, and series. Let your taste define who you are.',
    highlight: 'Your Story',
    accent: false,
  },
  {
    icon: Sparkles,
    title: 'Smart Matching',
    description: 'Our AI analyzes emotional preferences, storytelling interests, and viewing habits to find your perfect match.',
    highlight: 'Coming Soon',
    accent: true,
  },
  {
    icon: Users,
    title: 'Communities',
    description: 'Join thousands of communities built around shared fandoms, genres, and cinematic universes.',
    highlight: 'Coming Soon',
    accent: false,
  },
  {
    icon: Brain,
    title: 'AI Insights',
    description: 'Get deep personality insights based on what you love to watch. Discover what your taste says about you.',
    highlight: 'Coming Soon',
    accent: false,
  },
  {
    icon: BookMarked,
    title: 'Shared Watchlists',
    description: 'Create and share curated watchlists with your connections. Watch together, talk together.',
    highlight: 'Coming Soon',
    accent: false,
  },
]

function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const Icon = feature.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="relative group glass rounded-xl p-6 border border-white/5 hover:border-white/15 transition-all duration-300 overflow-hidden"
    >
      {/* Red glow on hover */}
      <div className="absolute inset-0 bg-[#E50914]/0 group-hover:bg-[#E50914]/3 transition-colors duration-300 rounded-xl" />

      {/* Icon */}
      <div className={`relative inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 ${
        feature.accent
          ? 'bg-[#E50914] shadow-lg shadow-[#E50914]/30'
          : 'bg-white/8 border border-white/10'
      }`}>
        <Icon className={`w-5 h-5 ${feature.accent ? 'text-white' : 'text-[#a3a3a3]'}`} />
      </div>

      {/* Badge */}
      <div className="inline-flex items-center mb-3">
        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
          feature.highlight === 'Your Story'
            ? 'bg-green-500/15 text-green-400'
            : 'bg-white/8 text-[#737373]'
        }`}>
          {feature.highlight}
        </span>
      </div>

      <h3 className="text-white font-semibold text-lg mb-2 relative">{feature.title}</h3>
      <p className="text-[#737373] text-sm leading-relaxed relative">{feature.description}</p>
    </motion.div>
  )
}

export function FeaturesSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section id="features" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute inset-0 bg-[#141414]/40" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[#E50914] text-sm font-semibold uppercase tracking-widest mb-4">Platform Features</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 text-balance">
            Everything you need to{' '}
            <span className="text-gradient-accent">find your people</span>
          </h2>
          <p className="text-[#a3a3a3] text-lg max-w-2xl mx-auto text-pretty">
            CineMate brings together cinema, personality, and connection in one beautiful platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
