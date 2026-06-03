'use client'

import { UserProfile } from '@/lib/firebase/firestore'
import { CompatibilityScore } from '@/lib/compatibility/scorer'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Heart, Flame, Zap } from 'lucide-react'
import React from 'react'

interface MatchCardProps {
  user: UserProfile
  compatibility: CompatibilityScore
  onConnect?: (userId: string) => void
  isConnected?: boolean
}

export function MatchCard({
  user,
  compatibility,
  onConnect,
  isConnected,
}: MatchCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    if (score >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-900/20 border-green-700/50'
    if (score >= 60) return 'bg-yellow-900/20 border-yellow-700/50'
    if (score >= 40) return 'bg-orange-900/20 border-orange-700/50'
    return 'bg-red-900/20 border-red-700/50'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 rounded-lg bg-surface border border-accent/10 hover:border-accent/30 transition-all"
    >
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-lg bg-surface-elevated border border-accent/30 flex-shrink-0 overflow-hidden">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-accent flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {user.displayName.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-foreground">{user.displayName}</h3>
              <p className="text-sm text-foreground-muted">@{user.username}</p>
            </div>
            <div
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border ${getScoreBg(compatibility.score)}`}
            >
              <Flame className={`w-4 h-4 ${getScoreColor(compatibility.score)}`} />
              <span className={`text-sm font-bold ${getScoreColor(compatibility.score)}`}>
                {compatibility.score}%
              </span>
            </div>
          </div>

          {/* Explanation */}
          <p className="text-sm text-foreground-muted mb-3">
            {compatibility.explanation}
          </p>

          {/* Shared details */}
          <div className="flex flex-wrap gap-2 mb-4">
            {compatibility.sharedGenres.length > 0 && (
              <div className="text-xs px-2 py-1 bg-accent/10 rounded text-accent">
                {compatibility.sharedGenres.length} shared genres
              </div>
            )}
            {compatibility.sharedMoviesCount > 0 && (
              <div className="text-xs px-2 py-1 bg-accent/10 rounded text-accent">
                {compatibility.sharedMoviesCount} shared movies
              </div>
            )}
            {compatibility.sharedSeriesCount > 0 && (
              <div className="text-xs px-2 py-1 bg-accent/10 rounded text-accent">
                {compatibility.sharedSeriesCount} shared series
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Link href={`/dashboard/profile/${user.uid}`} className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-accent/30 hover:border-accent text-foreground"
              >
                View Profile
              </Button>
            </Link>
            {onConnect && (
              <Button
                onClick={() => onConnect(user.uid)}
                size="sm"
                variant={isConnected ? 'default' : 'outline'}
                className={
                  isConnected
                    ? 'bg-green-900 hover:bg-green-800 text-green-100'
                    : 'border-accent/30 hover:border-accent text-foreground'
                }
              >
                <Heart
                  className="w-4 h-4"
                  fill={isConnected ? 'currentColor' : 'none'}
                />
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
