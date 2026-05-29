import { AuthProvider } from '@/contexts/AuthContext'

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-black">
        {children}
      </div>
    </AuthProvider>
  )
}
