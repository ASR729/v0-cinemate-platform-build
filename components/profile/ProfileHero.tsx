'use client'

import { UserProfile } from '@/lib/firebase/firestore'
import { EntertainmentDNA } from '@/lib/entertainment-dna/classifier'
import { format } from 'date-fns'
import React from 'react'

interface ProfileHeroProps {
  profile: UserProfile
  dna?: EntertainmentDNA
  compatibilityScore?: number
  isOwnProfile?: boolean
}

export function ProfileHero({
  profile,
  dna,
  compatibilityScore,
  isOwnProfile = true,
}: ProfileHeroProps) {
  const createdDate = profile.createdAt
    ? new Date(profile.createdAt)
    : new Date()

  return (
    <div className="relative w-full bg-gradient-to-b from-surface via-surface to-background pb-12 px-6 pt-8 md:px-8">
      {/* Background blur effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-end md:gap-8 gap-4">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-lg bg-surface-elevated border-2 border-accent/30 overflow-hidden flex items-center justify-center">
            {profile.photoURL ? (
              <img
                src={profile.photoURL}
                alt={profile.displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gradient-accent">
                <span className="text-5xl md:text-6xl font-bold text-white">
                  {profile.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {profile.displayName}
            </h1>
            <p className="text-lg text-foreground-muted">@{profile.username}</p>
          </div>

          <p className="text-sm text-foreground-subtle">
            Member since {format(createdDate, 'MMMM yyyy')}
          </p>

          {/* DNA Badge */}
          {dna && (
            <div className="flex items-center gap-3 mt-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/50 rounded-full">
                <div className="w-2 h-2 bg-accent rounded-full" />
                <span className="text-sm font-semibold text-accent">{dna.type}</span>
                <span className="text-xs text-accent/70 ml-1">({dna.confidence}%)</span>
              </div>
            </div>
          )}

          {/* Compatibility Score (for other profiles) */}
          {compatibilityScore !== undefined && !isOwnProfile && (
            <div className="flex items-center gap-3 mt-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-900/20 border border-green-700/50 rounded-full">
                <span className="text-2xl font-bold text-green-500">{compatibilityScore}%</span>
                <span className="text-xs text-green-400">Compatible</span>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-8 md:gap-12">
          <div className="flex flex-col items-center">
            <p className="text-2xl font-bold text-accent">
              {profile.genres.length}
            </p>
            <p className="text-xs text-foreground-muted uppercase tracking-wide">Genres</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-2xl font-bold text-accent">
              {(profile.favoriteMovies.length + profile.favoriteSeries.length)}
            </p>
            <p className="text-xs text-foreground-muted uppercase tracking-wide">Favorites</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-2xl font-bold text-accent">
              {profile.connectionsCount || 0}
            </p>
            <p className="text-xs text-foreground-muted uppercase tracking-wide">Connected</p>
          </div>
        </div>
      </div>
    </div>
  )
}
