import { AuthProvider } from '@/contexts/AuthContext'
import { AuthGuard } from '@/components/auth/AuthGuard'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGuard require="unauthenticated-only">
        <div className="min-h-screen bg-black flex flex-col">
          {children}
        </div>
      </AuthGuard>
    </AuthProvider>
  )
}
