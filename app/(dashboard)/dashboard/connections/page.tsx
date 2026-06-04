'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import {
  getUserProfile,
  getConnections,
  getPendingFriendRequests,
  getSentFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  removeFriendship,
  FriendRequest,
  Friendship,
  UserProfile,
} from '@/lib/firebase/firestore'
import { ConnectionCard } from '@/components/connections/ConnectionCard'
import { RequestCard } from '@/components/connections/RequestCard'
import { Loader, Users, Clock, Send } from 'lucide-react'

type Tab = 'active' | 'received' | 'sent'

export default function ConnectionsPage() {
  const { user, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('active')
  const [activeConnections, setActiveConnections] = useState<
    Array<{ user: UserProfile; friendship: Friendship }>
  >([])
  const [receivedRequests, setReceivedRequests] = useState<
    Array<{ user: UserProfile; request: FriendRequest }>
  >([])
  const [sentRequests, setSentRequests] = useState<
    Array<{ user: UserProfile; request: FriendRequest }>
  >([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadConnections = async () => {
      if (!user) return

      setLoading(true)
      try {
        // Load active connections
        const friendships = await getConnections(user.uid)
        const connectionsWithUsers = await Promise.all(
          friendships.map(async (f) => {
            const otherId = f.userId1 === user.uid ? f.userId2 : f.userId1
            const profile = await getUserProfile(otherId)
            return { user: profile!, friendship: f }
          })
        )
        setActiveConnections(connectionsWithUsers)

        // Load pending requests (received)
        const pendingRequests = await getPendingFriendRequests(user.uid)
        const receivedWithUsers = await Promise.all(
          pendingRequests.map(async (req) => {
            const profile = await getUserProfile(req.from)
            return { user: profile!, request: req }
          })
        )
        setReceivedRequests(receivedWithUsers)

        // Load sent requests
        const sentReqs = await getSentFriendRequests(user.uid)
        const sentWithUsers = await Promise.all(
          sentReqs.map(async (req) => {
            const profile = await getUserProfile(req.to)
            return { user: profile!, request: req }
          })
        )
        setSentRequests(sentWithUsers)
      } catch (error) {
        console.error('[v0] Error loading connections:', error)
      } finally {
        setLoading(false)
      }
    }

    loadConnections()
  }, [user])

  const handleAccept = async (
    requestId: string,
    fromUid: string,
    toUid: string
  ) => {
    try {
      await acceptFriendRequest(requestId, fromUid, toUid)
      // Reload connections
      setReceivedRequests((prev) =>
        prev.filter((r) => r.request.id !== requestId)
      )
    } catch (error) {
      console.error('[v0] Error accepting request:', error)
    }
  }

  const handleReject = async (requestId: string) => {
    try {
      await rejectFriendRequest(requestId)
      setReceivedRequests((prev) =>
        prev.filter((r) => r.request.id !== requestId)
      )
    } catch (error) {
      console.error('[v0] Error rejecting request:', error)
    }
  }

  const handleRemove = async (friendshipId: string) => {
    try {
      await removeFriendship(friendshipId)
      setActiveConnections((prev) =>
        prev.filter((c) => c.friendship.id !== friendshipId)
      )
    } catch (error) {
      console.error('[v0] Error removing friendship:', error)
    }
  }

  const handleCancel = async (requestId: string) => {
    try {
      await cancelFriendRequest(requestId)
      setSentRequests((prev) =>
        prev.filter((r) => r.request.id !== requestId)
      )
    } catch (error) {
      console.error('[v0] Error cancelling request:', error)
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Connections</h1>
        <p className="text-foreground-muted">
          Manage your movie companion network
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex gap-2 mb-8 border-b border-border"
      >
        {[
          { id: 'active', label: 'Connected', icon: Users },
          { id: 'received', label: 'Requests', icon: Clock },
          { id: 'sent', label: 'Sent', icon: Send },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as Tab)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === id
                ? 'border-accent text-accent'
                : 'border-transparent text-foreground-muted hover:text-foreground'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-accent animate-spin" />
          </div>
        ) : activeTab === 'active' ? (
          activeConnections.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-foreground-muted">
                No active connections yet. Go to Discover to find people!
              </p>
            </div>
          ) : (
            activeConnections.map((conn) => (
              <ConnectionCard
                key={conn.friendship.id}
                user={conn.user}
                friendship={conn.friendship}
                onRemove={handleRemove}
              />
            ))
          )
        ) : activeTab === 'received' ? (
          receivedRequests.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-foreground-muted">No pending requests</p>
            </div>
          ) : (
            receivedRequests.map((req) => (
              <RequestCard
                key={req.request.id}
                user={req.user}
                request={req.request}
                isReceived={true}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            ))
          )
        ) : (
          sentRequests.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-foreground-muted">No sent requests</p>
            </div>
          ) : (
            sentRequests.map((req) => (
              <RequestCard
                key={req.request.id}
                user={req.user}
                request={req.request}
                isReceived={false}
                onCancel={handleCancel}
              />
            ))
          )
        )}
      </motion.div>
    </div>
  )
}
