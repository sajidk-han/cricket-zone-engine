import { MetadataRoute } from 'next'
import { getPublicOrganizations, getLiveMatches } from '@/app/actions/public'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://cricketzone.com'

  // Fetch dynamic content
  const [organizations, liveMatches] = await Promise.all([
    getPublicOrganizations(),
    getLiveMatches()
  ])

  // Map organizations to sitemap entries
  const orgEntries = organizations.map((org: any) => ({
    url: `${baseUrl}/fanzone/${org.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Map live matches to sitemap entries
  const matchEntries = liveMatches.map((match: any) => ({
    url: `${baseUrl}/fanzone/default-org/matches/${match.id}`,
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: 0.9,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/public`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    ...orgEntries,
    ...matchEntries,
  ]
}
