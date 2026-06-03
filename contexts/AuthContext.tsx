'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { MockUser, onAuthChange, signOutUser } from '@/lib/firebase/auth'
import { getUserProfile, UserProfile } from '@/lib/firebase/firestore'

interface AuthContextType {
  user: MockUser | null
  profile: UserProfile | null
  loading: boolean
  refreshProfile: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = useCallback(async () => {
    if (user) {
      const p = await getUserProfile(user.uid)
      setProfile(p)
    }
  }, [user])

  const signOut = useCallback(async () => {
    // signOutUser calls notifyMockSubscribers(null) which fires onAuthChange,
    // so user/profile state is cleaned up automatically via the subscriber below.
    await signOutUser()
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthChange(async (authUser) => {
      setUser(authUser)
      if (authUser) {
        const p = await getUserProfile(authUser.uid)
        setProfile(p)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
