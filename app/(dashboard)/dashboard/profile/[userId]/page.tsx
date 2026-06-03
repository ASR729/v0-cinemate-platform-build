'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { Loader, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getUserProfile, UserProfile } from '@/lib/firebase/firestore'
import { classifyEntertainmentDNA, EntertainmentDNA } from '@/lib/entertainment-dna/classifier'
import { calculateCompatibility, CompatibilityScore } from '@/lib/compatibility/scorer'
import { useAuth } from '@/contexts/AuthContext'
import { ProfileHero } from '@/components/profile/ProfileHero'
import { GenresDisplay } from '@/components/profile/GenresDisplay'
import { MovieCollection } from '@/components/profile/MovieCollection'
import { SeriesCollection } from '@/components/profile/SeriesCollection'
import { EntertainmentDNACard } from '@/components/profile/EntertainmentDNACard'

export default function OtherUserProfilePage() {
  const { userId } = useParams() as { userId: string }
  const { profile: currentUserProfile } = useAuth()
  const [otherProfile, setOtherProfile] = useState<UserProfile | null>(null)
  const [otherDNA, setOtherDNA] = useState<EntertainmentDNA | undefined>(undefined)
  const [compatibility, setCompatibility] = useState<CompatibilityScore | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        const profile = await getUserProfile(userId as string)
        if (!profile) {
          setError('User not found')
          return
        }
        setOtherProfile(profile)

        // Calculate Entertainment DNA
        const dna = classifyEntertainmentDNA(profile)
        setOtherDNA(dna)

        // Calculate compatibility if current user profile exists
        if (currentUserProfile && currentUserProfile.onboardingCompleted) {
          const comp = calculateCompatibility(currentUserProfile, profile)
          setCompatibility(comp)
        }
      } catch (err) {
        console.error('[v0] Error loading profile:', err)
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      loadProfile()
    }
  }, [userId, currentUserProfile])

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Loader className="w-8 h-8 text-accent animate-spin" />
      </div>
    )
  }

  if (error || !otherProfile) {
    return (
      <div className="w-full max-w-6xl mx-auto px-6 md:px-8 py-8">
        <Link href="/dashboard/discover">
          <div className="flex items-center gap-2 text-accent hover:text-accent-hover transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Discovery</span>
          </div>
        </Link>
        <div className="h-64 flex items-center justify-center">
          <p className="text-foreground-muted">{error || 'User not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Back button */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-4">
          <Link href="/dashboard/discover">
            <div className="flex items-center gap-2 text-accent hover:text-accent-hover transition-colors w-fit">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Discovery</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ProfileHero
          profile={otherProfile}
          dna={otherDNA}
          compatibilityScore={compatibility?.score}
          isOwnProfile={false}
        />
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="max-w-6xl mx-auto px-6 md:px-8 py-8 space-y-8"
      >
        {/* Compatibility Details */}
        {compatibility && (
          <section className="bg-surface rounded-lg p-6 border border-accent/30">
            <h2 className="text-xl font-semibold text-foreground mb-4">Compatibility Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div>
                <p className="text-2xl font-bold text-accent">
                  {compatibility.sharedGenresPercent}%
                </p>
                <p className="text-xs text-foreground-muted uppercase">Shared Genres</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">
                  {compatibility.sharedMoviesPercent}%
                </p>
                <p className="text-xs text-foreground-muted uppercase">Shared Movies</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">
                  {compatibility.sharedSeriesPercent}%
                </p>
                <p className="text-xs text-foreground-muted uppercase">Shared Series</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">
                  {compatibility.sharedStorytellingPercent}%
                </p>
                <p className="text-xs text-foreground-muted uppercase">Storytelling</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">
                  {compatibility.sharedEmotionalPercent}%
                </p>
                <p className="text-xs text-foreground-muted uppercase">Emotional</p>
              </div>
            </div>
            <p className="text-foreground-muted">{compatibility.explanation}</p>
          </section>
        )}

        {/* Entertainment DNA */}
        {otherDNA && (
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Entertainment DNA</h2>
            <EntertainmentDNACard dna={otherDNA} />
          </section>
        )}

        {/* Interests Sections */}
        {otherProfile.genres.length > 0 && (
          <section>
            <GenresDisplay genres={otherProfile.genres} />
          </section>
        )}

        {/* Collections */}
        {otherProfile.favoriteMovies.length > 0 && (
          <section>
            <MovieCollection movies={otherProfile.favoriteMovies} />
          </section>
        )}

        {otherProfile.favoriteSeries.length > 0 && (
          <section>
            <SeriesCollection series={otherProfile.favoriteSeries} />
          </section>
        )}

        {/* Storytelling Interests */}
        {otherProfile.storytellingInterests.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold text-foreground mb-4">Storytelling Interests</h3>
            <div className="flex flex-wrap gap-2">
              {otherProfile.storytellingInterests.map((interest) => (
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
        {otherProfile.emotionalPreferences.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold text-foreground mb-4">Emotional Preferences</h3>
            <div className="flex flex-wrap gap-2">
              {otherProfile.emotionalPreferences.map((pref) => (
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
