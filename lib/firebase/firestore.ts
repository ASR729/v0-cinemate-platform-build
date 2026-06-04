import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  orderBy,
  limit,
} from 'firebase/firestore'
import { db, isMock } from './config'

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  username?: string
  photoURL?: string
  onboardingCompleted: boolean
  onboardingStep: number
  genres: string[]
  favoriteMovies: TMDbItem[]
  favoriteSeries: TMDbItem[]
  storytellingInterests: string[]
  emotionalPreferences: string[]
  createdAt: Date | null
  updatedAt: Date | null
  // Phase 2 additions
  entertainmentDNA?: string
  entertainmentDNAScore?: number
  connectionsCount?: number
}

export interface TMDbItem {
  id: number
  title: string
  posterPath: string | null
  releaseYear: string
  rating: number
}

// Mock store for development
const mockProfiles: Record<string, UserProfile> = {}

export const createUserProfile = async (
  uid: string,
  data: Partial<UserProfile>
): Promise<void> => {
  const profile: UserProfile = {
    uid,
    email: data.email || '',
    displayName: data.displayName || '',
    username: data.username,
    photoURL: data.photoURL,
    onboardingCompleted: false,
    onboardingStep: 0,
    genres: [],
    favoriteMovies: [],
    favoriteSeries: [],
    storytellingInterests: [],
    emotionalPreferences: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  if (isMock) {
    mockProfiles[uid] = profile
    return
  }

  if (!db) return
  await setDoc(doc(db, 'users', uid), {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (isMock) return mockProfiles[uid] || null

  if (!db) return null
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) return null
  return snap.data() as UserProfile
}

export const updateUserProfile = async (
  uid: string,
  data: Partial<UserProfile>
): Promise<void> => {
  if (isMock) {
    if (mockProfiles[uid]) {
      mockProfiles[uid] = { ...mockProfiles[uid], ...data, updatedAt: new Date() }
    } else {
      mockProfiles[uid] = {
        uid,
        email: '',
        displayName: '',
        onboardingCompleted: false,
        onboardingStep: 0,
        genres: [],
        favoriteMovies: [],
        favoriteSeries: [],
        storytellingInterests: [],
        emotionalPreferences: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
      }
    }
    return
  }

  if (!db) return
  await updateDoc(doc(db, 'users', uid), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export const completeOnboarding = async (
  uid: string,
  finalData: Partial<UserProfile>
): Promise<void> => {
  await updateUserProfile(uid, {
    ...finalData,
    onboardingCompleted: true,
  })
}

// Phase 2: Discovery and Connections

export interface FriendRequest {
  id: string
  from: string
  to: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: Date
  respondedAt?: Date
}

export interface Friendship {
  id: string
  userId1: string
  userId2: string
  connectedAt: Date
}

// Mock storage for Phase 2 collections
const mockFriendRequests: Record<string, FriendRequest> = {}
const mockFriendships: Record<string, Friendship> = {}

export const searchUsers = async (
  searchTerm: string,
  limit_count: number = 20
): Promise<UserProfile[]> => {
  if (isMock) {
    // Mock search: filter mock profiles by display name or username
    const results = Object.values(mockProfiles)
      .filter((p) => {
        const term = searchTerm.toLowerCase()
        return (
          p.displayName.toLowerCase().includes(term) ||
          p.username?.toLowerCase().includes(term)
        )
      })
      .slice(0, limit_count)
    return results
  }

  if (!db) return []

  try {
    const q = query(
      collection(db, 'users'),
      where('displayName', '>=', searchTerm),
      where('displayName', '<=', searchTerm + '\uf8ff'),
      limit(limit_count)
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => d.data() as UserProfile)
  } catch (error) {
    console.error('[v0] Search users error:', error)
    return []
  }
}

export const getAllUsers = async (excludeUid?: string, limit_count: number = 20): Promise<UserProfile[]> => {
  if (isMock) {
    const results = Object.values(mockProfiles)
      .filter((p) => p.onboardingCompleted && p.uid !== excludeUid)
      .slice(0, limit_count)
    return results
  }

  if (!db) return []

  try {
    const constraints = []
    if (excludeUid) {
      constraints.push(where('uid', '!=', excludeUid))
    }
    constraints.push(where('onboardingCompleted', '==', true))
    constraints.push(orderBy('createdAt', 'desc'))
    constraints.push(limit(limit_count))

    const q = query(collection(db, 'users'), ...constraints)
    const snap = await getDocs(q)
    return snap.docs.map((d) => d.data() as UserProfile)
  } catch (error) {
    console.error('[v0] Get all users error:', error)
    return []
  }
}

export const createFriendRequest = async (from: string, to: string): Promise<string> => {
  const friendRequest: FriendRequest = {
    id: Math.random().toString(36).substring(2, 11),
    from,
    to,
    status: 'pending',
    createdAt: new Date(),
  }

  if (isMock) {
    mockFriendRequests[friendRequest.id] = friendRequest
    return friendRequest.id
  }

  if (!db) return ''

  try {
    const docRef = await addDoc(collection(db, 'friendRequests'), {
      ...friendRequest,
      createdAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error('[v0] Create friend request error:', error)
    return ''
  }
}

export const getPendingFriendRequests = async (toUid: string): Promise<FriendRequest[]> => {
  if (isMock) {
    return Object.values(mockFriendRequests).filter((r) => r.to === toUid && r.status === 'pending')
  }

  if (!db) return []

  try {
    const q = query(
      collection(db, 'friendRequests'),
      where('to', '==', toUid),
      where('status', '==', 'pending')
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => d.data() as FriendRequest)
  } catch (error) {
    console.error('[v0] Get pending requests error:', error)
    return []
  }
}

export const acceptFriendRequest = async (requestId: string, fromUid: string, toUid: string): Promise<void> => {
  if (isMock) {
    if (mockFriendRequests[requestId]) {
      mockFriendRequests[requestId].status = 'accepted'
      mockFriendRequests[requestId].respondedAt = new Date()
    }
    // Create friendship
    const friendship: Friendship = {
      id: Math.random().toString(36).substring(2, 11),
      userId1: fromUid,
      userId2: toUid,
      connectedAt: new Date(),
    }
    mockFriendships[friendship.id] = friendship
    return
  }

  if (!db) return

  try {
    // Update friend request
    await updateDoc(doc(db, 'friendRequests', requestId), {
      status: 'accepted',
      respondedAt: serverTimestamp(),
    })

    // Create friendship
    await addDoc(collection(db, 'friendships'), {
      userId1: fromUid,
      userId2: toUid,
      connectedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error('[v0] Accept friend request error:', error)
  }
}

export const rejectFriendRequest = async (requestId: string): Promise<void> => {
  if (isMock) {
    if (mockFriendRequests[requestId]) {
      mockFriendRequests[requestId].status = 'rejected'
      mockFriendRequests[requestId].respondedAt = new Date()
    }
    return
  }

  if (!db) return

  try {
    await updateDoc(doc(db, 'friendRequests', requestId), {
      status: 'rejected',
      respondedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error('[v0] Reject friend request error:', error)
  }
}

export const getConnections = async (uid: string): Promise<Friendship[]> => {
  if (isMock) {
    return Object.values(mockFriendships).filter(
      (f) => f.userId1 === uid || f.userId2 === uid
    )
  }

  if (!db) return []

  try {
    const q = query(
      collection(db, 'friendships'),
      where('userId1', '==', uid)
    )
    const snap = await getDocs(q)
    const friendships = snap.docs.map((d) => d.data() as Friendship)

    // Also get friendships where uid is userId2
    const q2 = query(
      collection(db, 'friendships'),
      where('userId2', '==', uid)
    )
    const snap2 = await getDocs(q2)
    friendships.push(...snap2.docs.map((d) => d.data() as Friendship))

    return friendships
  } catch (error) {
    console.error('[v0] Get connections error:', error)
    return []
  }
}

export const removeFriendship = async (friendshipId: string): Promise<void> => {
  if (isMock) {
    delete mockFriendships[friendshipId]
    return
  }

  if (!db) return

  try {
    await deleteDoc(doc(db, 'friendships', friendshipId))
  } catch (error) {
    console.error('[v0] Remove friendship error:', error)
  }
}

export const getSentFriendRequests = async (fromUid: string): Promise<FriendRequest[]> => {
  if (isMock) {
    return Object.values(mockFriendRequests).filter(
      (r) => r.from === fromUid && r.status === 'pending'
    )
  }

  if (!db) return []

  try {
    const q = query(
      collection(db, 'friendRequests'),
      where('from', '==', fromUid),
      where('status', '==', 'pending')
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FriendRequest))
  } catch (error) {
    console.error('[v0] Get sent requests error:', error)
    return []
  }
}

export const cancelFriendRequest = async (requestId: string): Promise<void> => {
  if (isMock) {
    delete mockFriendRequests[requestId]
    return
  }

  if (!db) return

  try {
    await deleteDoc(doc(db, 'friendRequests', requestId))
  } catch (error) {
    console.error('[v0] Cancel friend request error:', error)
  }
}

export const hasPendingRequest = async (fromUid: string, toUid: string): Promise<string | null> => {
  if (isMock) {
    const req = Object.values(mockFriendRequests).find(
      (r) => r.from === fromUid && r.to === toUid && r.status === 'pending'
    )
    return req ? req.id : null
  }

  if (!db) return null

  try {
    const q = query(
      collection(db, 'friendRequests'),
      where('from', '==', fromUid),
      where('to', '==', toUid),
      where('status', '==', 'pending')
    )
    const snap = await getDocs(q)
    return snap.empty ? null : snap.docs[0].id
  } catch (error) {
    console.error('[v0] Check pending request error:', error)
    return null
  }
}
