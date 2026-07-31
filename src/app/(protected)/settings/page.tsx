import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">Organization Settings</h1>
        <p className="text-text-secondary mt-1">Configure your organization preferences and billing details.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-bg-elevated flex items-center justify-center text-2xl mx-auto mb-4">
            ⚙️
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">Settings Module Coming Soon</h2>
          <p className="text-text-secondary max-w-md mx-auto">
            The configuration and billing modules are scheduled for the next phase of development. Stay tuned!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
