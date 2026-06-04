'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, Chrome } from 'lucide-react'
import Link from 'next/link'
import { Logo } from '@/components/cinemate/Logo'
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from '@/lib/firebase/auth'
import { cn } from '@/lib/utils'

interface AuthFormProps {
  mode: 'login' | 'signup'
}

export function AuthForm({ mode }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError(null)
  }

  const validate = (): string | null => {
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Please enter a valid email address.'
    }
    if (!formData.password || formData.password.length < 6) {
      return 'Password must be at least 6 characters.'
    }
    if (mode === 'signup' && (!formData.displayName || formData.displayName.trim().length < 2)) {
      return 'Please enter your name (at least 2 characters).'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }

    setLoading(true)
    setError(null)

    try {
      if (mode === 'login') {
        const result = await signInWithEmail(formData.email, formData.password)
        if (result.error) { setError(result.error); return }
        setSuccess(true)
      } else {
        const result = await signUpWithEmail(formData.email, formData.password, formData.displayName.trim())
        if (result.error) { setError(result.error); return }
        setSuccess(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    setError(null)
    try {
      const result = await signInWithGoogle()
      if (result.error) { setError(result.error); return }
      setSuccess(true)
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row">
      {/* Left — Cinematic panel (desktop only) */}
      <div className="hidden md:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#141414] via-black to-[#0a0a0a]" />
        {/* Decorative film strips */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full border border-white/5" />
          <div className="absolute w-[400px] h-[400px] rounded-full border border-white/5" />
          <div className="absolute w-[200px] h-[200px] rounded-full border border-[#E50914]/10" />
        </div>
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#E50914]/8 rounded-full blur-[80px]" />
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
          <Logo size="lg" href="/" />
          <p className="text-[#737373] text-lg mt-6 max-w-xs leading-relaxed text-pretty">
            {mode === 'login'
              ? 'Welcome back. Your cinematic world awaits.'
              : 'Join the platform built for people who live through stories.'}
          </p>
          {/* Feature dots */}
          <div className="mt-12 space-y-4 text-left w-full max-w-xs">
            {['Smart AI Matching', 'Cinematic Profile', 'Real Connections'].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
                <span className="text-[#a3a3a3] text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-12 md:max-w-md md:mx-auto w-full">
        {/* Mobile logo */}
        <div className="md:hidden mb-8">
          <Logo size="md" href="/" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <h1 className="font-serif text-3xl font-bold text-white mb-1">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </h1>
          <p className="text-[#737373] text-sm mb-8">
            {mode === 'login' ? (
              <>
                New to CineMate?{' '}
                <Link href="/signup" className="text-[#E50914] hover:text-[#f40612] transition-colors">
                  Get started
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link href="/login" className="text-[#E50914] hover:text-[#f40612] transition-colors">
                  Sign in
                </Link>
              </>
            )}
          </p>

          {/* Google button */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="w-full glass border border-white/10 hover:border-white/20 text-white text-sm font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-all duration-200 hover:bg-white/5 disabled:opacity-50 mb-5"
          >
            {googleLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Chrome className="w-4 h-4 text-[#a3a3a3]" />
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-[#404040] text-xs">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {mode === 'signup' && (
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="Full name"
                  autoComplete="name"
                  className="w-full bg-white/5 border border-white/10 focus:border-[#E50914]/60 text-white placeholder:text-[#737373] text-sm rounded-lg pl-10 pr-4 py-3 outline-none transition-colors"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                autoComplete="email"
                className="w-full bg-white/5 border border-white/10 focus:border-[#E50914]/60 text-white placeholder:text-[#737373] text-sm rounded-lg pl-10 pr-4 py-3 outline-none transition-colors"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="w-full bg-white/5 border border-white/10 focus:border-[#E50914]/60 text-white placeholder:text-[#737373] text-sm rounded-lg pl-10 pr-11 py-3 outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#a3a3a3] transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 bg-[#E50914]/10 border border-[#E50914]/20 text-[#ff6b74] text-xs rounded-lg px-3 py-2.5"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Success */}
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-lg px-3 py-2.5"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span>{mode === 'login' ? 'Welcome back!' : 'Account created!'} Redirecting...</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading || googleLoading || success}
              className={cn(
                'w-full font-semibold text-sm py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2',
                success
                  ? 'bg-green-600 text-white'
                  : 'bg-[#E50914] hover:bg-[#f40612] text-white hover:shadow-lg hover:shadow-[#E50914]/25',
                (loading || googleLoading) && 'opacity-70 cursor-not-allowed'
              )}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : success ? (
                'Redirecting...'
              ) : mode === 'login' ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {mode === 'login' && (
            <p className="text-center mt-4">
              <button className="text-[#737373] hover:text-[#a3a3a3] text-xs transition-colors">
                Forgot password?
              </button>
            </p>
          )}
        </motion.div>
      </div>
    </div>
  )
}
