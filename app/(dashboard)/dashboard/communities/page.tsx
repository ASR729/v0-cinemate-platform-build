'use client'

import { Users } from 'lucide-react'
import { ModulePlaceholder } from '@/components/dashboard/ModulePlaceholder'

export default function CommunitiesPage() {
  return (
    <div className="px-6 lg:px-8 py-8">
      <ModulePlaceholder
        icon={Users}
        title="Communities"
        description="Join fandoms, genre circles, and film clubs. Share reviews, debate endings, and celebrate your favorite stories together."
        comingSoon
        cta="Explore Communities"
      />
    </div>
  )
}
