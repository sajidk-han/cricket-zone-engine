import React from 'react'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { Settings } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-16 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-brand-primary/10 flex items-center justify-center">
              <Settings size={40} className="text-brand-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Tournament Settings</h2>
          <p className="text-text-secondary max-w-md mx-auto">
            Tournament configuration, points system, and administrator settings will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
