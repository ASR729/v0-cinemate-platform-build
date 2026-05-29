import { AuthForm } from '@/components/auth/AuthForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In — CineMate',
  description: 'Sign in to your CineMate account.',
}

export default function LoginPage() {
  return <AuthForm mode="login" />
}
