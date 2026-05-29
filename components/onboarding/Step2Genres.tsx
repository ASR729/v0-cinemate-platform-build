'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { ChipSelector } from '@/components/cinemate/ChipSelector'
import { OnboardingData, GENRE_OPTIONS } from '@/lib/onboarding/store'

interface Step2Props {
  data: OnboardingData
  onUpdate: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

export function Step2Genres({ data, onUpdate, onNext, onBack }: Step2Props) {
  const toggle = (id: string) => {
    const current = data.genres
    const updated = current.includes(id)
      ? current.filter(g => g !== id)
      : [...current, id]
    onUpdate({ genres: updated })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="space-y-8"
    >
      <div>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3 text-balance">
          What genres do you love?
        </h2>
        <p className="text-[#737373] text-base leading-relaxed">
          Pick as many as you like. Your taste shapes who you connect with.
        </p>
      </div>

      <ChipSelector
        chips={GENRE_OPTIONS}
        selected={data.genres}
        onToggle={toggle}
      />

      {data.genres.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[#737373] text-sm"
        >
          {data.genres.length} genre{data.genres.length > 1 ? 's' : ''} selected
        </motion.p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          className="flex-1 glass border border-white/10 hover:border-white/20 text-[#a3a3a3] hover:text-white font-semibold text-base py-4 rounded-xl transition-all duration-200"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={data.genres.length === 0}
          className="flex-[2] bg-[#E50914] hover:bg-[#f40612] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-base py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#E50914]/25 flex items-center justify-center gap-2 group"
        >
          Continue
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </motion.div>
  )
}
