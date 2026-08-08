import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/public'],
      disallow: ['/dashboard', '/superadmin', '/settings'],
    },
    sitemap: 'https://cricketzone.com/sitemap.xml',
  }
}
