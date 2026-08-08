import React from 'react'

interface JsonLdProps {
  data: Record<string, any>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

/**
 * Helper to generate SportsEvent Schema
 */
export function generateSportsEventSchema(match: any, orgUrl: string) {
  if (!match) return {}
  
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": `${match.team1?.name} vs ${match.team2?.name}`,
    "description": `Live cricket match between ${match.team1?.name} and ${match.team2?.name} in the ${match.tournament?.name}.`,
    "startDate": match.start_time || new Date().toISOString(),
    "eventStatus": match.status === 'live' 
      ? "https://schema.org/EventLive" 
      : match.status === 'scheduled' 
      ? "https://schema.org/EventScheduled" 
      : "https://schema.org/EventMovedOnline", // Fallback for completed if needed
    "homeTeam": {
      "@type": "SportsTeam",
      "name": match.team1?.name
    },
    "awayTeam": {
      "@type": "SportsTeam",
      "name": match.team2?.name
    },
    "location": {
      "@type": "Place",
      "name": match.venue_name || "Cricket Ground"
    },
    "url": `${orgUrl}/matches/${match.slug || match.id}`
  }
}
