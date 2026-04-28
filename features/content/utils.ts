// Token generation utilities - pure functions, no DB dependencies
import { nanoid } from 'nanoid'

// Token generation
export function generatePublicToken(): string {
  return nanoid(12)
}

// Validate video URL (basic validation for YouTube/Vimeo)
export function isValidVideoUrl(url: string): boolean {
  const patterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=.+/,
    /^https?:\/\/youtu\.be\/.+/,
    /^https?:\/\/(www\.)?vimeo\.com\/\d+/,
  ]
  return patterns.some(pattern => pattern.test(url))
}

// Extract video embed URL
export function getEmbedUrl(videoUrl: string): string | null {
  // YouTube
  const youtubeMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`
  }
  
  // Vimeo
  const vimeoMatch = videoUrl.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }
  
  return null
}