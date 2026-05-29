import { AuthForm } from '@/components/auth/AuthForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account — CineMate',
  description: 'Join CineMate and connect through stories.',
}

export default function SignUpPage() {
  return <AuthForm mode="signup" />
}
