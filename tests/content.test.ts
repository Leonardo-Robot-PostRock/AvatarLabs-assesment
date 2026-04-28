import { describe, it, expect } from 'vitest'
import { generatePublicToken, isValidVideoUrl, getEmbedUrl } from '../features/content/utils'

describe('Token Generation', () => {
  it('should generate unique tokens', () => {
    const token1 = generatePublicToken()
    const token2 = generatePublicToken()
    expect(token1).not.toBe(token2)
  })

  it('should generate tokens with decent length', () => {
    const token = generatePublicToken()
    expect(token.length).toBeGreaterThanOrEqual(10)
  })
})

describe('Video URL Validation', () => {
  it('should accept YouTube URLs', () => {
    expect(isValidVideoUrl('https://www.youtube.com/watch?v=abc')).toBe(true)
    expect(isValidVideoUrl('https://youtu.be/abc')).toBe(true)
  })

  it('should accept Vimeo URLs', () => {
    expect(isValidVideoUrl('https://vimeo.com/123456789')).toBe(true)
  })

  it('should reject invalid URLs', () => {
    expect(isValidVideoUrl('https://google.com')).toBe(false)
  })
})

describe('Video Embed URL', () => {
  it('should convert YouTube to embed', () => {
    expect(getEmbedUrl('https://www.youtube.com/watch?v=abc')).toBe('https://www.youtube.com/embed/abc')
  })

  it('should convert Vimeo to embed', () => {
    expect(getEmbedUrl('https://vimeo.com/123456789')).toBe('https://player.vimeo.com/video/123456789')
  })
})