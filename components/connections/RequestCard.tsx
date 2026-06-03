'use client'

import { UserProfile, FriendRequest } from '@/lib/firebase/firestore'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'
import React from 'react'

interface RequestCardProps {
  user: UserProfile
  request: FriendRequest
  isReceived?: boolean
  onAccept?: (requestId: string, fromUid: string, toUid: string) => void
  onReject?: (requestId: string) => void
  onCancel?: (requestId: string) => void
}

export function RequestCard({
  user,
  request,
  isReceived = true,
  onAccept,
  onReject,
  onCancel,
}: RequestCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 rounded-lg bg-surface border border-accent/10 hover:border-accent/30 transition-all flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-lg bg-surface-elevated border border-accent/30 flex-shrink-0 overflow-hidden">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-accent flex items-center justify-center">
              <span className="text-lg font-bold text-white">
                {user.displayName.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{user.displayName}</h3>
          <p className="text-sm text-foreground-muted">
            {isReceived ? 'Sent you a connection request' : 'Waiting for response'}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-shrink-0">
        <Link href={`/dashboard/profile/${user.uid}`}>
          <Button
            variant="outline"
            size="sm"
            className="border-accent/30 hover:border-accent text-foreground"
          >
            View
          </Button>
        </Link>
        {isReceived ? (
          <>
            {onAccept && (
              <Button
                onClick={() =>
                  onAccept(request.id, request.from, request.to)
                }
                size="sm"
                className="bg-green-900 hover:bg-green-800 text-green-100"
              >
                <Check className="w-4 h-4" />
              </Button>
            )}
            {onReject && (
              <Button
                onClick={() => onReject(request.id)}
                size="sm"
                variant="ghost"
                className="text-foreground-muted hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </>
        ) : (
          <>
            {onCancel && (
              <Button
                onClick={() => onCancel(request.id)}
                size="sm"
                variant="ghost"
                className="text-foreground-muted hover:text-destructive"
              >
                Cancel
              </Button>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}
