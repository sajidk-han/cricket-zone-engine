export type LiveStreamProvider = 'youtube' | 'facebook'

export interface ParsedLiveStream {
  provider: LiveStreamProvider
  embedUrl: string
  originalUrl: string
  videoId?: string
}

/**
 * Validates and parses a live stream URL.
 * Returns null if the URL is unsupported, invalid, or potentially malicious.
 */
export function parseLiveStreamUrl(url: string | null | undefined): ParsedLiveStream | null {
  if (!url || typeof url !== 'string') return null

  try {
    const parsedUrl = new URL(url)
    
    // 1. YouTube
    if (parsedUrl.hostname.includes('youtube.com') || parsedUrl.hostname.includes('youtu.be')) {
      const videoId = extractYouTubeVideoId(parsedUrl)
      if (videoId) {
        return {
          provider: 'youtube',
          embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`,
          originalUrl: url,
          videoId
        }
      }
    }
    
    // 2. Facebook
    if (parsedUrl.hostname.includes('facebook.com') || parsedUrl.hostname.includes('fb.watch')) {
      // Basic check to ensure it's a video/live URL
      if (
        parsedUrl.pathname.includes('/videos/') || 
        parsedUrl.pathname.includes('/live/') || 
        parsedUrl.pathname.includes('/watch') ||
        parsedUrl.pathname.includes('/share/') ||
        parsedUrl.hostname.includes('fb.watch')
      ) {
        // Facebook's official iframe embed uses plugins/video.php
        const encodedHref = encodeURIComponent(url)
        return {
          provider: 'facebook',
          embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodedHref}&show_text=false&width=auto&autoplay=1`,
          originalUrl: url
        }
      }
    }

    return null
  } catch (error) {
    // URL parsing failed (e.g. malformed or javascript: pseudo-protocol)
    return null
  }
}

function extractYouTubeVideoId(url: URL): string | null {
  // Handle youtu.be/VIDEO_ID
  if (url.hostname === 'youtu.be' || url.hostname === 'www.youtu.be') {
    const path = url.pathname.slice(1) // remove leading slash
    if (path) return path.split('?')[0]
  }
  
  // Handle youtube.com/watch?v=VIDEO_ID
  if (url.pathname === '/watch') {
    return url.searchParams.get('v')
  }
  
  // Handle youtube.com/live/VIDEO_ID
  if (url.pathname.startsWith('/live/')) {
    const parts = url.pathname.split('/')
    if (parts.length >= 3) return parts[2]
  }

  // Handle youtube.com/embed/VIDEO_ID
  if (url.pathname.startsWith('/embed/')) {
    const parts = url.pathname.split('/')
    if (parts.length >= 3) return parts[2]
  }
  
  return null
}
