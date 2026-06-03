'use client'

import { EntertainmentDNA } from '@/lib/entertainment-dna/classifier'
import React from 'react'

interface EntertainmentDNACardProps {
  dna: EntertainmentDNA
}

const DNA_ICONS: Record<string, string> = {
  'The Visionary': '👁️',
  'The Explorer': '🗺️',
  'The Strategist': '♟️',
  'The Story Seeker': '📖',
  'The Dreamer': '✨',
  'The Analyst': '🔬',
  'The Philosopher': '🤔',
  'The Adventurer': '🏔️',
}

const DNA_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  'The Visionary': { bg: 'bg-purple-900/20', border: 'border-purple-700/50', text: 'text-purple-400' },
  'The Explorer': { bg: 'bg-blue-900/20', border: 'border-blue-700/50', text: 'text-blue-400' },
  'The Strategist': { bg: 'bg-red-900/20', border: 'border-red-700/50', text: 'text-red-400' },
  'The Story Seeker': { bg: 'bg-pink-900/20', border: 'border-pink-700/50', text: 'text-pink-400' },
  'The Dreamer': { bg: 'bg-cyan-900/20', border: 'border-cyan-700/50', text: 'text-cyan-400' },
  'The Analyst': { bg: 'bg-amber-900/20', border: 'border-amber-700/50', text: 'text-amber-400' },
  'The Philosopher': { bg: 'bg-indigo-900/20', border: 'border-indigo-700/50', text: 'text-indigo-400' },
  'The Adventurer': { bg: 'bg-orange-900/20', border: 'border-orange-700/50', text: 'text-orange-400' },
}

export function EntertainmentDNACard({ dna }: EntertainmentDNACardProps) {
  const icon = DNA_ICONS[dna.type]
  const colors = DNA_COLORS[dna.type]

  return (
    <div className={`w-full p-6 rounded-lg border ${colors.border} ${colors.bg} backdrop-blur-sm`}>
      <div className="flex items-start gap-4">
        <div className="text-4xl">{icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className={`text-xl font-bold ${colors.text}`}>{dna.type}</h3>
            <span className="text-xs px-2 py-1 bg-white/5 rounded-full text-foreground-muted">
              {dna.confidence}% confidence
            </span>
          </div>
          <p className="text-sm text-foreground-muted leading-relaxed">{dna.description}</p>
        </div>
      </div>
    </div>
  )
}
