'use client'

import { UserProfile } from '@/lib/firebase/firestore'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Heart, User } from 'lucide-react'
import React from 'react'

interface UserCardProps {
  user: UserProfile
  compatibilityScore?: number
  onConnect?: (userId: string) => void
  isConnected?: boolean
}

export function UserCard({
  user,
  compatibilityScore,
  onConnect,
  isConnected,
}: UserCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-lg overflow-hidden bg-surface border border-accent/10 hover:border-accent/50 transition-all h-80"
    >
      {/* Background image or gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/50 to-surface">
        <div className="absolute inset-0 bg-gradient-accent/5 group-hover:bg-gradient-accent/10 transition-all" />
      </div>

      {/* Profile Header with Avatar */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-lg bg-surface-elevated border-2 border-accent/30 overflow-hidden flex-shrink-0">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-accent flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
          {compatibilityScore !== undefined && (
            <div className="flex items-center gap-1 px-3 py-1 bg-green-900/30 border border-green-700/50 rounded-full">
              <span className="text-sm font-bold text-green-400">{compatibilityScore}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-4 pt-20">
        {/* Info */}
        <div className="min-h-0">
          <h3 className="font-semibold text-foreground text-lg line-clamp-2">
            {user.displayName}
          </h3>
          <p className="text-sm text-foreground-muted">@{user.username}</p>
          {user.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {user.genres.slice(0, 2).map((genre) => (
                <span
                  key={genre}
                  className="text-xs px-2 py-1 bg-accent/10 rounded text-accent"
                >
                  {genre}
                </span>
              ))}
              {user.genres.length > 2 && (
                <span className="text-xs px-2 py-1 bg-accent/10 rounded text-accent">
                  +{user.genres.length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer with Buttons */}
        <div className="flex gap-2">
          <Link href={`/dashboard/profile/${user.uid}`} className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-accent/30 hover:border-accent text-foreground hover:text-accent"
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
                  : 'border-accent/30 hover:border-accent text-foreground hover:text-accent'
              }
            >
              <Heart className="w-4 h-4" fill={isConnected ? 'currentColor' : 'none'} />
            </Button>
          )}
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  )
}
