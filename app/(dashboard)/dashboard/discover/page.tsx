'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { getAllUsers, UserProfile, createFriendRequest } from '@/lib/firebase/firestore'
import { calculateCompatibility } from '@/lib/compatibility/scorer'
import { UserCard } from '@/components/discover/UserCard'
import { Loader, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const USERS_PER_PAGE = 12

export default function DiscoverPage() {
  const { user, profile, loading: authLoading } = useAuth()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [compatibilityScores, setCompatibilityScores] = useState<
    Record<string, number>
  >({})
  const [connectedUsers, setConnectedUsers] = useState<Set<string>>(new Set())

  // Load all users
  useEffect(() => {
    const loadUsers = async () => {
      if (!user || !profile?.onboardingCompleted) return

      setLoading(true)
      try {
        const allUsers = await getAllUsers(user.uid, 100)
        setUsers(allUsers)

        // Calculate compatibility for all users
        const scores: Record<string, number> = {}
        allUsers.forEach((u) => {
          if (profile && profile.onboardingCompleted) {
            const compat = calculateCompatibility(profile, u)
            scores[u.uid] = compat.score
          }
        })
        setCompatibilityScores(scores)

        // Sort by compatibility
        allUsers.sort((a, b) => (scores[b.uid] || 0) - (scores[a.uid] || 0))
        setUsers(allUsers)
        setFilteredUsers(allUsers)
      } catch (error) {
        console.error('[v0] Error loading users:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [user, profile])

  // Handle search
  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term)
      setCurrentPage(0)

      if (!term) {
        setFilteredUsers(users)
        return
      }

      const filtered = users.filter((u) => {
        const searchLower = term.toLowerCase()
        return (
          u.displayName.toLowerCase().includes(searchLower) ||
          u.username?.toLowerCase().includes(searchLower)
        )
      })
      setFilteredUsers(filtered)
    },
    [users]
  )

  // Handle connection request
  const handleConnect = async (targetUid: string) => {
    if (!user) return

    try {
      await createFriendRequest(user.uid, targetUid)
      setConnectedUsers((prev) => new Set([...prev, targetUid]))
    } catch (error) {
      console.error('[v0] Error creating friend request:', error)
    }
  }

  // Paginate users
  const paginatedUsers = filteredUsers.slice(
    currentPage * USERS_PER_PAGE,
    (currentPage + 1) * USERS_PER_PAGE
  )
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE)

  if (authLoading || loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Loader className="w-8 h-8 text-accent animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Discover</h1>
        <p className="text-foreground-muted">
          Find people with compatible entertainment taste
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-8"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted pointer-events-none" />
          <Input
            type="text"
            placeholder="Search by name or username..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-12 bg-surface border-accent/20 text-foreground placeholder:text-foreground-subtle"
          />
        </div>
      </motion.div>

      {/* Users Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 text-accent animate-spin" />
        </div>
      ) : paginatedUsers.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-foreground-muted">
            {searchTerm
              ? 'No users found matching your search'
              : 'No users available to discover'}
          </p>
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {paginatedUsers.map((u, idx) => (
              <motion.div
                key={u.uid}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
              >
                <UserCard
                  user={u}
                  compatibilityScore={compatibilityScores[u.uid]}
                  onConnect={handleConnect}
                  isConnected={connectedUsers.has(u.uid)}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-2"
            >
              <Button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                variant="outline"
                className="border-accent/20 hover:border-accent text-foreground"
              >
                Previous
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx)}
                    className={`w-8 h-8 rounded text-sm font-medium transition-all ${
                      currentPage === idx
                        ? 'bg-accent text-white'
                        : 'bg-surface border border-accent/20 text-foreground hover:border-accent'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <Button
                onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage === totalPages - 1}
                variant="outline"
                className="border-accent/20 hover:border-accent text-foreground"
              >
                Next
              </Button>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}
