'use client'

import { motion } from 'framer-motion'
import { UserPlus, Film, Compass, Heart } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create Profile',
    description: 'Set up your cinematic identity with your name and unique username.',
  },
  {
    number: '02',
    icon: Film,
    title: 'Choose Movies & Series',
    description: 'Select your all-time favorites. Build a profile that truly represents your taste.',
  },
  {
    number: '03',
    icon: Compass,
    title: 'Discover Like-Minded People',
    description: 'Our AI finds users whose tastes align with yours across genres, themes, and emotions.',
  },
  {
    number: '04',
    icon: Heart,
    title: 'Build Meaningful Connections',
    description: 'Connect, chat, and share your cinematic world with people who truly get you.',
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-black relative">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[#E50914] text-sm font-semibold uppercase tracking-widest mb-4">How It Works</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white text-balance">
            Four steps to your{' '}
            <br className="hidden md:block" />
            <span className="text-gradient-accent">cinema tribe</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="flex flex-col items-center text-center lg:items-center"
                >
                  {/* Icon circle */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full glass border border-white/10 flex items-center justify-center group hover:border-[#E50914]/50 transition-colors duration-300">
                      <Icon className="w-7 h-7 text-[#E50914]" />
                    </div>
                    {/* Step number badge */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#E50914] flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">{i + 1}</span>
                    </div>
                  </div>

                  <p className="text-[#737373] text-xs font-mono tracking-widest mb-2">{step.number}</p>
                  <h3 className="text-white font-semibold text-lg mb-3">{step.title}</h3>
                  <p className="text-[#737373] text-sm leading-relaxed">{step.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <a
            href="/signup"
            className="inline-flex items-center gap-2 bg-[#E50914] hover:bg-[#f40612] text-white font-semibold text-base px-8 py-4 rounded-lg transition-all duration-200 hover:shadow-2xl hover:shadow-[#E50914]/30"
          >
            Start Your Journey
          </a>
        </motion.div>
      </div>
    </section>
  )
}
