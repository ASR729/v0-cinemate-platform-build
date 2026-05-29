'use client'

import { motion } from 'framer-motion'
import { Logo } from './Logo'

interface OnboardingProgressProps {
  currentStep: number
  totalSteps: number
  stepLabel: string
}

export function OnboardingProgress({ currentStep, totalSteps, stepLabel }: OnboardingProgressProps) {
  const progress = ((currentStep) / totalSteps) * 100

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Logo size="sm" />
        <span className="text-[#a3a3a3] text-sm">
          {currentStep} <span className="text-[#737373]">/ {totalSteps}</span>
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-0.5 bg-white/10 rounded-full overflow-hidden mb-2">
        <motion.div
          className="h-full bg-[#E50914] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>

      {/* Step dots */}
      <div className="flex items-center gap-1.5 mb-1">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <motion.div
            key={i}
            className={`h-1 rounded-full flex-1 transition-colors duration-300 ${
              i < currentStep ? 'bg-[#E50914]' : 'bg-white/10'
            }`}
            animate={{ scaleY: i === currentStep - 1 ? 1.5 : 1 }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </div>

      <p className="text-[#737373] text-xs mt-2">{stepLabel}</p>
    </div>
  )
}
