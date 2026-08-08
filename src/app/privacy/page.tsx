import React from 'react'
import { StaticPageLayout } from '@/features/landing/components/layouts/StaticPageLayout'

export default function PrivacyPage() {
  return (
    <StaticPageLayout 
      title="Privacy Policy" 
      subtitle="Last updated: August 2026"
    >
      <h2>Data Collection</h2>
      <p>
        We collect data necessary to provide you with the CricketZone services, including tournament data, player statistics, and organizational records. 
      </p>
      
      <h2>Data Security</h2>
      <p>
        Your data is encrypted at rest and in transit. We use industry-standard security protocols to ensure your organizational data remains private and secure.
      </p>

      <h2>Third-Party Sharing</h2>
      <p>
        We do not sell your data to third parties. We only share data with service providers necessary to operate the platform (e.g., cloud hosting, email delivery).
      </p>
    </StaticPageLayout>
  )
}
