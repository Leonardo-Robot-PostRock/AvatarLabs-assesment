'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createContentPiece, isValidVideoUrl } from '@/features/content/service'

export async function createContent(formData: FormData) {
  const title = formData.get('title') as string
  const videoUrl = formData.get('video_url') as string

  // Validation
  if (!title || title.trim().length < 3) {
    return { error: 'Title must be at least 3 characters' }
  }
  
  if (!videoUrl || !isValidVideoUrl(videoUrl)) {
    return { error: 'Please enter a valid YouTube or Vimeo URL' }
  }

  try {
    const content = await createContentPiece({
      title: title.trim(),
      video_url: videoUrl.trim(),
    })
    
    revalidatePath('/')
    return { success: true, token: content.public_token }
  } catch (error) {
    return { error: 'Failed to create content. Please try again.' }
  }
}