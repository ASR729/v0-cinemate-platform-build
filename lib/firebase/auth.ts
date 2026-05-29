import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
} from 'firebase/auth'
import { auth, isMock } from './config'
import { createUserProfile } from './firestore'

export interface AuthResult {
  user: MockUser | null
  error: string | null
}

export interface MockUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

// Mock user store (in-memory for development)
let mockCurrentUser: MockUser | null = null
const mockUsers: Record<string, { password: string; user: MockUser }> = {}

export const signInWithEmail = async (email: string, password: string): Promise<AuthResult> => {
  if (isMock) {
    await new Promise(r => setTimeout(r, 800))
    const stored = mockUsers[email]
    if (!stored || stored.password !== password) {
      return { user: null, error: 'Invalid email or password.' }
    }
    mockCurrentUser = stored.user
    return { user: stored.user, error: null }
  }

  try {
    if (!auth) throw new Error('Auth not initialized')
    const result: UserCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = mapFirebaseUser(result.user)
    return { user, error: null }
  } catch (err: unknown) {
    return { user: null, error: getAuthErrorMessage(err) }
  }
}

export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<AuthResult> => {
  if (isMock) {
    await new Promise(r => setTimeout(r, 1000))
    if (mockUsers[email]) {
      return { user: null, error: 'This email is already registered.' }
    }
    const newUser: MockUser = {
      uid: `mock_${Date.now()}`,
      email,
      displayName,
      photoURL: null,
    }
    mockUsers[email] = { password, user: newUser }
    mockCurrentUser = newUser
    return { user: newUser, error: null }
  }

  try {
    if (!auth) throw new Error('Auth not initialized')
    const result: UserCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = mapFirebaseUser(result.user)
    await createUserProfile(user.uid, { email: user.email || '', displayName })
    return { user, error: null }
  } catch (err: unknown) {
    return { user: null, error: getAuthErrorMessage(err) }
  }
}

export const signInWithGoogle = async (): Promise<AuthResult> => {
  if (isMock) {
    await new Promise(r => setTimeout(r, 800))
    const mockGoogleUser: MockUser = {
      uid: `google_${Date.now()}`,
      email: 'user@gmail.com',
      displayName: 'Google User',
      photoURL: null,
    }
    mockCurrentUser = mockGoogleUser
    return { user: mockGoogleUser, error: null }
  }

  try {
    if (!auth) throw new Error('Auth not initialized')
    const provider = new GoogleAuthProvider()
    const result: UserCredential = await signInWithPopup(auth, provider)
    const user = mapFirebaseUser(result.user)
    return { user, error: null }
  } catch (err: unknown) {
    return { user: null, error: getAuthErrorMessage(err) }
  }
}

export const signOutUser = async (): Promise<void> => {
  if (isMock) {
    mockCurrentUser = null
    return
  }
  if (auth) await signOut(auth)
}

export const getCurrentUser = (): MockUser | null => {
  if (isMock) return mockCurrentUser
  return auth?.currentUser ? mapFirebaseUser(auth.currentUser) : null
}

export const onAuthChange = (callback: (user: MockUser | null) => void): (() => void) => {
  if (isMock) {
    callback(mockCurrentUser)
    return () => {}
  }
  if (!auth) {
    callback(null)
    return () => {}
  }
  return onAuthStateChanged(auth, (user: User | null) => {
    callback(user ? mapFirebaseUser(user) : null)
  })
}

function mapFirebaseUser(user: User): MockUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  }
}

function getAuthErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'code' in err) {
    const code = (err as { code: string }).code
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password.'
      case 'auth/email-already-in-use':
        return 'This email is already registered.'
      case 'auth/weak-password':
        return 'Password must be at least 6 characters.'
      case 'auth/invalid-email':
        return 'Please enter a valid email address.'
      case 'auth/popup-closed-by-user':
        return 'Sign-in cancelled.'
      default:
        return 'An error occurred. Please try again.'
    }
  }
  return 'An unexpected error occurred.'
}
