'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Loader2 } from 'lucide-react'
import { ChipSelector } from '@/components/cinemate/ChipSelector'
import { OnboardingData, EMOTIONAL_OPTIONS } from '@/lib/onboarding/store'

interface Step6Props {
  data: OnboardingData
  onUpdate: (data: Partial<OnboardingData>) => void
  onFinish: () => void
  onBack: () => void
  submitting: boolean
}

export function Step6Emotional({ data, onUpdate, onFinish, onBack, submitting }: Step6Props) {
  const toggle = (id: string) => {
    const current = data.emotionalPreferences
    const updated = current.includes(id)
      ? current.filter(i => i !== id)
      : [...current, id]
    onUpdate({ emotionalPreferences: updated })
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
          How do you want stories to make you feel?
        </h2>
        <p className="text-[#737373] text-base leading-relaxed">
          Your emotional preferences help us find people on the same wavelength.
        </p>
      </div>

      <ChipSelector
        chips={EMOTIONAL_OPTIONS}
        selected={data.emotionalPreferences}
        onToggle={toggle}
      />

      {data.emotionalPreferences.length > 0 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#737373] text-sm">
          {data.emotionalPreferences.length} preference{data.emotionalPreferences.length > 1 ? 's' : ''} selected
        </motion.p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          disabled={submitting}
          className="flex-1 glass border border-white/10 hover:border-white/20 text-[#a3a3a3] hover:text-white font-semibold text-base py-4 rounded-xl transition-all duration-200 disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={onFinish}
          disabled={data.emotionalPreferences.length === 0 || submitting}
          className="flex-[2] bg-[#E50914] hover:bg-[#f40612] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-base py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#E50914]/25 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating Profile...
            </>
          ) : (
            <>
              Complete Profile
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}
