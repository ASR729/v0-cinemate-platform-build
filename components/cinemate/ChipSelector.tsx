'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Chip {
  id: string
  label: string
  icon?: string
}

interface ChipSelectorProps {
  chips: Chip[]
  selected: string[]
  onToggle: (id: string) => void
  maxSelections?: number
  className?: string
}

export function ChipSelector({ chips, selected, onToggle, maxSelections, className }: ChipSelectorProps) {
  const canSelect = !maxSelections || selected.length < maxSelections

  return (
    <div className={cn('flex flex-wrap gap-2.5', className)}>
      {chips.map((chip, i) => {
        const isSelected = selected.includes(chip.id)
        const isDisabled = !isSelected && !canSelect

        return (
          <motion.button
            key={chip.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03, type: 'spring', stiffness: 300, damping: 25 }}
            whileHover={!isDisabled ? { scale: 1.05 } : {}}
            whileTap={!isDisabled ? { scale: 0.95 } : {}}
            onClick={() => !isDisabled && onToggle(chip.id)}
            disabled={isDisabled}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all duration-200',
              isSelected
                ? 'bg-[#E50914] border-[#E50914] text-white shadow-lg shadow-[#E50914]/25'
                : 'bg-white/5 border-white/10 text-[#a3a3a3] hover:border-white/30 hover:text-white hover:bg-white/10',
              isDisabled && !isSelected && 'opacity-40 cursor-not-allowed'
            )}
            aria-pressed={isSelected}
          >
            {chip.icon && <span className="text-base leading-none">{chip.icon}</span>}
            <span>{chip.label}</span>
            {isSelected && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
              </motion.span>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
