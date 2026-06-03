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

// ─── Mock auth state ──────────────────────────────────────────────────────────
// A subscriber list so every onAuthChange listener is called whenever auth
// state changes — exactly like Firebase's onAuthStateChanged.
let mockCurrentUser: MockUser | null = null
const mockUsers: Record<string, { password: string; user: MockUser }> = {}
const mockAuthSubscribers: Set<(user: MockUser | null) => void> = new Set()

function notifyMockSubscribers(user: MockUser | null) {
  mockCurrentUser = user
  mockAuthSubscribers.forEach((cb) => cb(user))
}

// ─── Sign in ──────────────────────────────────────────────────────────────────
export const signInWithEmail = async (email: string, password: string): Promise<AuthResult> => {
  if (isMock) {
    await new Promise((r) => setTimeout(r, 600))
    const stored = mockUsers[email]
    if (!stored || stored.password !== password) {
      return { user: null, error: 'Invalid email or password.' }
    }
    notifyMockSubscribers(stored.user)
    return { user: stored.user, error: null }
  }

  try {
    if (!auth) throw new Error('Auth not initialized')
    const result: UserCredential = await signInWithEmailAndPassword(auth, email, password)
    return { user: mapFirebaseUser(result.user), error: null }
  } catch (err: unknown) {
    return { user: null, error: getAuthErrorMessage(err) }
  }
}

// ─── Sign up ──────────────────────────────────────────────────────────────────
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<AuthResult> => {
  if (isMock) {
    await new Promise((r) => setTimeout(r, 800))
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
    // Create Firestore profile immediately so getUserProfile finds it
    await createUserProfile(newUser.uid, { email, displayName })
    notifyMockSubscribers(newUser)
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

// ─── Google ───────────────────────────────────────────────────────────────────
export const signInWithGoogle = async (): Promise<AuthResult> => {
  if (isMock) {
    await new Promise((r) => setTimeout(r, 600))
    const email = 'google@example.com'
    let googleUser: MockUser

    if (mockUsers[email]) {
      googleUser = mockUsers[email].user
    } else {
      googleUser = {
        uid: `google_${Date.now()}`,
        email,
        displayName: 'Google User',
        photoURL: null,
      }
      mockUsers[email] = { password: '', user: googleUser }
      await createUserProfile(googleUser.uid, {
        email: googleUser.email || '',
        displayName: googleUser.displayName || 'Google User',
      })
    }
    notifyMockSubscribers(googleUser)
    return { user: googleUser, error: null }
  }

  try {
    if (!auth) throw new Error('Auth not initialized')
    const provider = new GoogleAuthProvider()
    const result: UserCredential = await signInWithPopup(auth, provider)
    const user = mapFirebaseUser(result.user)
    // Upsert profile (may already exist for returning Google users)
    await createUserProfile(user.uid, {
      email: user.email || '',
      displayName: user.displayName || 'Google User',
    })
    return { user, error: null }
  } catch (err: unknown) {
    return { user: null, error: getAuthErrorMessage(err) }
  }
}

// ─── Sign out ─────────────────────────────────────────────────────────────────
export const signOutUser = async (): Promise<void> => {
  if (isMock) {
    notifyMockSubscribers(null)
    return
  }
  if (auth) await signOut(auth)
}

// ─── Get current user ─────────────────────────────────────────────────────────
export const getCurrentUser = (): MockUser | null => {
  if (isMock) return mockCurrentUser
  return auth?.currentUser ? mapFirebaseUser(auth.currentUser) : null
}

// ─── Auth state listener ──────────────────────────────────────────────────────
// Returns an unsubscribe function, just like Firebase's onAuthStateChanged.
export const onAuthChange = (callback: (user: MockUser | null) => void): (() => void) => {
  if (isMock) {
    // Fire immediately with current state, then keep subscriber in the set
    callback(mockCurrentUser)
    mockAuthSubscribers.add(callback)
    return () => mockAuthSubscribers.delete(callback)
  }

  if (!auth) {
    callback(null)
    return () => {}
  }
  return onAuthStateChanged(auth, (user: User | null) => {
    callback(user ? mapFirebaseUser(user) : null)
  })
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
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
