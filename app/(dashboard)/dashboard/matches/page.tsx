'use client'

import { Sparkles } from 'lucide-react'
import { ModulePlaceholder } from '@/components/dashboard/ModulePlaceholder'

export default function MatchesPage() {
  return (
    <div className="px-6 lg:px-8 py-8">
      <ModulePlaceholder
        icon={Sparkles}
        title="Matches"
        description="Discover people who share your cinematic DNA. Our AI analyzes your preferences to find your perfect movie companions."
        comingSoon
        cta="Get Notified"
      />
    </div>
  )
}
