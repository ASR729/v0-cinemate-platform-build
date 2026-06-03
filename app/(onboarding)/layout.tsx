import { AuthProvider } from '@/contexts/AuthContext'
import { AuthGuard } from '@/components/auth/AuthGuard'

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGuard require="authenticated">
        <div className="min-h-screen bg-black">
          {children}
        </div>
      </AuthGuard>
    </AuthProvider>
  )
}
