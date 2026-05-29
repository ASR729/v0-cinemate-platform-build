import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
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
