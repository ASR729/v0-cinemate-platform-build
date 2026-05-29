'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, AtSign, ArrowRight, AlertCircle } from 'lucide-react'
import { OnboardingData } from '@/lib/onboarding/store'

interface Step1Props {
  data: OnboardingData
  onUpdate: (data: Partial<OnboardingData>) => void
  onNext: () => void
}

export function Step1Profile({ data, onUpdate, onNext }: Step1Props) {
  const [errors, setErrors] = useState<{ displayName?: string; username?: string }>({})

  const validate = () => {
    const e: { displayName?: string; username?: string } = {}
    if (!data.displayName.trim() || data.displayName.trim().length < 2) {
      e.displayName = 'Name must be at least 2 characters.'
    }
    if (!data.username.trim()) {
      e.username = 'Username is required.'
    } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(data.username.trim())) {
      e.username = 'Username must be 3–20 characters, letters, numbers, or underscores.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (validate()) onNext()
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
          What should we call you?
        </h2>
        <p className="text-[#737373] text-base leading-relaxed">
          Set up your cinematic identity. This is how other people will find you.
        </p>
      </div>

      <div className="space-y-4">
        {/* Display Name */}
        <div className="space-y-1.5">
          <label className="text-[#a3a3a3] text-sm font-medium" htmlFor="displayName">
            Display Name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
            <input
              id="displayName"
              type="text"
              value={data.displayName}
              onChange={(e) => {
                onUpdate({ displayName: e.target.value })
                if (errors.displayName) setErrors(p => ({ ...p, displayName: undefined }))
              }}
              placeholder="e.g. Alex Rivera"
              maxLength={50}
              className="w-full bg-white/5 border border-white/10 focus:border-[#E50914]/60 text-white placeholder:text-[#404040] text-base rounded-xl pl-11 pr-4 py-4 outline-none transition-colors"
            />
          </div>
          {errors.displayName && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1.5 text-[#ff6b74] text-xs"
            >
              <AlertCircle className="w-3 h-3" /> {errors.displayName}
            </motion.p>
          )}
        </div>

        {/* Username */}
        <div className="space-y-1.5">
          <label className="text-[#a3a3a3] text-sm font-medium" htmlFor="username">
            Username
          </label>
          <div className="relative">
            <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
            <input
              id="username"
              type="text"
              value={data.username}
              onChange={(e) => {
                const val = e.target.value.replace(/[^a-zA-Z0-9_]/g, '')
                onUpdate({ username: val })
                if (errors.username) setErrors(p => ({ ...p, username: undefined }))
              }}
              placeholder="e.g. cinephile_alex"
              maxLength={20}
              className="w-full bg-white/5 border border-white/10 focus:border-[#E50914]/60 text-white placeholder:text-[#404040] text-base rounded-xl pl-11 pr-4 py-4 outline-none transition-colors"
            />
          </div>
          {errors.username ? (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1.5 text-[#ff6b74] text-xs"
            >
              <AlertCircle className="w-3 h-3" /> {errors.username}
            </motion.p>
          ) : (
            <p className="text-[#404040] text-xs">Letters, numbers, and underscores only (3–20 chars)</p>
          )}
        </div>

        {/* Preview card */}
        {(data.displayName || data.username) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-xl p-4 border border-white/8 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-[#E50914]/20 border border-[#E50914]/30 flex items-center justify-center flex-shrink-0">
              <span className="text-[#E50914] text-lg font-bold font-serif">
                {data.displayName ? data.displayName[0].toUpperCase() : '?'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold truncate">{data.displayName || 'Your Name'}</p>
              <p className="text-[#737373] text-sm">@{data.username || 'username'}</p>
            </div>
          </motion.div>
        )}
      </div>

      <button
        onClick={handleNext}
        className="w-full bg-[#E50914] hover:bg-[#f40612] text-white font-semibold text-base py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#E50914]/25 flex items-center justify-center gap-2 group"
      >
        Continue
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </motion.div>
  )
}
