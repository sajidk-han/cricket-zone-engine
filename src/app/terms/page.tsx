import React from 'react'
import { StaticPageLayout } from '@/features/landing/components/layouts/StaticPageLayout'

export default function TermsPage() {
  return (
    <StaticPageLayout 
      title="Terms of Service" 
      subtitle="Last updated: August 2026"
    >
      <h2>Acceptance of Terms</h2>
      <p>
        By accessing or using CricketZone, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
      </p>
      
      <h2>Organization Responsibilities</h2>
      <p>
        Organizations using CricketZone are responsible for the accuracy of the tournament data, player information, and live scores entered into the system. You agree not to upload any content that is illegal, offensive, or infringes on third-party rights.
      </p>

      <h2>Service Availability</h2>
      <p>
        While we strive for 99.9% uptime, CricketZone is provided "as is" and "as available". We do not guarantee that the service will be uninterrupted or error-free.
      </p>
    </StaticPageLayout>
  )
}
