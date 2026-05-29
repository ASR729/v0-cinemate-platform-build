'use client'

import { MessageSquare } from 'lucide-react'
import { ModulePlaceholder } from '@/components/dashboard/ModulePlaceholder'

export default function MessagesPage() {
  return (
    <div className="px-6 lg:px-8 py-8">
      <ModulePlaceholder
        icon={MessageSquare}
        title="Messages"
        description="Connect and chat with your matches. Share recommendations, plan watch parties, and discuss your favorite scenes."
        comingSoon
        cta="Enable Notifications"
      />
    </div>
  )
}
