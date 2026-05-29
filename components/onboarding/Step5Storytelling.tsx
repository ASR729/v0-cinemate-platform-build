'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { ChipSelector } from '@/components/cinemate/ChipSelector'
import { OnboardingData, STORYTELLING_OPTIONS } from '@/lib/onboarding/store'

interface Step5Props {
  data: OnboardingData
  onUpdate: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

export function Step5Storytelling({ data, onUpdate, onNext, onBack }: Step5Props) {
  const toggle = (id: string) => {
    const current = data.storytellingInterests
    const updated = current.includes(id)
      ? current.filter(i => i !== id)
      : [...current, id]
    onUpdate({ storytellingInterests: updated })
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
          What draws you into a story?
        </h2>
        <p className="text-[#737373] text-base leading-relaxed">
          The things that keep you thinking long after the credits roll.
        </p>
      </div>

      <ChipSelector
        chips={STORYTELLING_OPTIONS}
        selected={data.storytellingInterests}
        onToggle={toggle}
      />

      {data.storytellingInterests.length > 0 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#737373] text-sm">
          {data.storytellingInterests.length} interest{data.storytellingInterests.length > 1 ? 's' : ''} selected
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
          disabled={data.storytellingInterests.length === 0}
          className="flex-[2] bg-[#E50914] hover:bg-[#f40612] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-base py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#E50914]/25 flex items-center justify-center gap-2 group"
        >
          Continue
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </motion.div>
  )
}
