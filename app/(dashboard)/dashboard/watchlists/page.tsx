'use client'

import { BookMarked } from 'lucide-react'
import { ModulePlaceholder } from '@/components/dashboard/ModulePlaceholder'

export default function WatchlistsPage() {
  return (
    <div className="px-6 lg:px-8 py-8">
      <ModulePlaceholder
        icon={BookMarked}
        title="Watchlists"
        description="Build, curate, and share collections. Create themed lists, track what you want to watch, and discover curated picks from others."
        comingSoon
        cta="Create First List"
      />
    </div>
  )
}
