'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ProfileHero } from '@/components/profile/ProfileHero'
import { GenresDisplay } from '@/components/profile/GenresDisplay'
import { MovieCollection } from '@/components/profile/MovieCollection'
import { SeriesCollection } from '@/components/profile/SeriesCollection'
import { EntertainmentDNACard } from '@/components/profile/EntertainmentDNACard'
import { classifyEntertainmentDNA, EntertainmentDNA } from '@/lib/entertainment-dna/classifier'
import { Loader } from 'lucide-react'

export default function OwnProfilePage() {
  const { user, profile, loading } = useAuth()
  const [dna, setDna] = useState<EntertainmentDNA | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  useEffect(() => {
    if (profile && profile.onboardingCompleted && !dna) {
      setIsCalculating(true)
      try {
        const calculated = classifyEntertainmentDNA(profile)
        setDna(calculated)
      } catch (error) {
        console.error('[v0] Error calculating DNA:', error)
      } finally {
        setIsCalculating(false)
      }
    }
  }, [profile, dna])

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Loader className="w-8 h-8 text-accent animate-spin" />
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <p className="text-foreground-muted">Not authenticated</p>
      </div>
    )
  }

  if (!profile.onboardingCompleted) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <p className="text-foreground-muted">Please complete onboarding first</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ProfileHero profile={profile} dna={dna} isOwnProfile={true} />
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="max-w-6xl mx-auto px-6 md:px-8 py-8 space-y-8"
      >
        {/* Entertainment DNA */}
        {dna && (
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Your Entertainment DNA</h2>
            <EntertainmentDNACard dna={dna} />
          </section>
        )}

        {/* Interests Sections */}
        {profile.genres.length > 0 && (
          <section>
            <GenresDisplay genres={profile.genres} />
          </section>
        )}

        {/* Collections */}
        {profile.favoriteMovies.length > 0 && (
          <section>
            <MovieCollection movies={profile.favoriteMovies} />
          </section>
        )}

        {profile.favoriteSeries.length > 0 && (
          <section>
            <SeriesCollection series={profile.favoriteSeries} />
          </section>
        )}

        {/* Storytelling Interests */}
        {profile.storytellingInterests.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold text-foreground mb-4">Storytelling Interests</h3>
            <div className="flex flex-wrap gap-2">
              {profile.storytellingInterests.map((interest) => (
                <div
                  key={interest}
                  className="px-4 py-2 bg-surface-elevated border border-accent/20 rounded-full text-sm font-medium text-foreground-muted"
                >
                  {interest}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Emotional Preferences */}
        {profile.emotionalPreferences.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold text-foreground mb-4">Emotional Preferences</h3>
            <div className="flex flex-wrap gap-2">
              {profile.emotionalPreferences.map((pref) => (
                <div
                  key={pref}
                  className="px-4 py-2 bg-surface-elevated border border-accent/20 rounded-full text-sm font-medium text-foreground-muted"
                >
                  {pref}
                </div>
              ))}
            </div>
          </section>
        )}
      </motion.div>
    </div>
  )
}
