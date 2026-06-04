'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { getAllUsers, UserProfile, createFriendRequest } from '@/lib/firebase/firestore'
import { calculateCompatibility } from '@/lib/compatibility/scorer'
import { MatchCard } from '@/components/matches/MatchCard'
import { Loader } from 'lucide-react'

const MATCHES_TO_SHOW = 20

export default function MatchesPage() {
  const { user, profile, loading: authLoading } = useAuth()
  const [matches, setMatches] = useState<
    Array<{ user: UserProfile; compatibility: ReturnType<typeof calculateCompatibility> }>
  >([])
  const [loading, setLoading] = useState(false)
  const [connectedUsers, setConnectedUsers] = useState<Set<string>>(new Set())

  useEffect(() => {
    const loadMatches = async () => {
      if (!user || !profile?.onboardingCompleted) return

      setLoading(true)
      try {
        const allUsers = await getAllUsers(user.uid, 100)

        // Calculate compatibility for all users
        const matchesWithScores = allUsers
          .map((u) => ({
            user: u,
            compatibility: calculateCompatibility(profile, u),
          }))
          .sort((a, b) => b.compatibility.score - a.compatibility.score)
          .slice(0, MATCHES_TO_SHOW)

        setMatches(matchesWithScores)
      } catch (error) {
        console.error('[v0] Error loading matches:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMatches()
  }, [user, profile])

  const handleConnect = async (targetUid: string) => {
    if (!user) return

    try {
      await createFriendRequest(user.uid, targetUid)
      setConnectedUsers((prev) => new Set([...prev, targetUid]))
    } catch (error) {
      console.error('[v0] Error creating friend request:', error)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Loader className="w-8 h-8 text-accent animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-6 md:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Top Matches</h1>
        <p className="text-foreground-muted">
          People with the highest entertainment compatibility
        </p>
      </motion.div>

      {/* Matches List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 text-accent animate-spin" />
        </div>
      ) : matches.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-foreground-muted">No matches found yet</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          {matches.map((match, idx) => (
            <motion.div
              key={match.user.uid}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
            >
              <MatchCard
                user={match.user}
                compatibility={match.compatibility}
                onConnect={handleConnect}
                isConnected={connectedUsers.has(match.user.uid)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
