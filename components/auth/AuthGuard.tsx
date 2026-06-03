'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Loader } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  /** Which guard mode to apply */
  require: 'authenticated' | 'onboarding-complete' | 'unauthenticated-only'
}

/**
 * Wraps a page and enforces auth + onboarding routing:
 *
 *  require="unauthenticated-only"   → logged-in users are redirected away from /login and /signup
 *  require="authenticated"          → unauthenticated users are sent to /login
 *  require="onboarding-complete"    → authenticated users who haven't finished onboarding are sent to /onboarding
 */
export function AuthGuard({ children, require: mode }: AuthGuardProps) {
  const router = useRouter()
  const { user, profile, loading } = useAuth()

  useEffect(() => {
    if (loading) return

    if (mode === 'unauthenticated-only') {
      if (user) {
        // Already logged in — send where they belong
        if (profile?.onboardingCompleted) {
          router.replace('/dashboard')
        } else {
          router.replace('/onboarding')
        }
      }
      return
    }

    if (mode === 'authenticated' || mode === 'onboarding-complete') {
      if (!user) {
        router.replace('/login')
        return
      }
    }

    if (mode === 'onboarding-complete') {
      // profile may still be loading (null but user exists) — wait
      if (profile !== null && !profile.onboardingCompleted) {
        router.replace('/onboarding')
      }
    }
  }, [loading, user, profile, mode, router])

  // While loading auth state, show a full-screen spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader className="w-8 h-8 text-[#E50914] animate-spin" />
      </div>
    )
  }

  // For unauthenticated-only routes: if user IS logged in, don't flash the page
  if (mode === 'unauthenticated-only' && user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader className="w-8 h-8 text-[#E50914] animate-spin" />
      </div>
    )
  }

  // For authenticated routes: if no user, don't flash
  if ((mode === 'authenticated' || mode === 'onboarding-complete') && !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader className="w-8 h-8 text-[#E50914] animate-spin" />
      </div>
    )
  }

  // For onboarding-complete: if profile loaded and incomplete, don't flash
  if (mode === 'onboarding-complete' && profile !== null && !profile.onboardingCompleted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader className="w-8 h-8 text-[#E50914] animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}
