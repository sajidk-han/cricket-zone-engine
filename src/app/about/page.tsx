import React from 'react'
import { StaticPageLayout } from '@/features/landing/components/layouts/StaticPageLayout'

export default function AboutPage() {
  return (
    <StaticPageLayout 
      title="About CricketZone" 
      subtitle="The modern operating system for professional cricket."
    >
      <h2>Our Mission</h2>
      <p>
        At CricketZone, our mission is to digitize cricket from the grassroots up. We believe that every club, academy, and district association deserves access to the same technology used by international leagues.
      </p>
      
      <h2>Why We Built This</h2>
      <p>
        For too long, tournament organizers have relied on scattered spreadsheets, WhatsApp groups, and paper scoresheets. This leads to data loss, errors, and an unengaging experience for fans. CricketZone was built to replace these fragmented tools with a single, powerful enterprise platform.
      </p>

      <h2>Our Team</h2>
      <p>
        We are a passionate team of cricket enthusiasts and software engineers dedicated to pushing the boundaries of sports technology.
      </p>
    </StaticPageLayout>
  )
}
