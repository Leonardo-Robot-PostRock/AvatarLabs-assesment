import { supabase } from '@/lib/supabase'
import type { ContentPiece, CreateContentInput } from '@/lib/supabase'
import { generatePublicToken, isValidVideoUrl, getEmbedUrl } from './utils'

// Export types and utilities for convenience
export { type ContentPiece, type CreateContentInput }
export { generatePublicToken, isValidVideoUrl, getEmbedUrl }

// Create content piece
export async function createContentPiece(input: CreateContentInput): Promise<ContentPiece> {
  const publicToken = generatePublicToken()
  
  const { data, error } = await supabase
    .from('content_pieces')
    .insert({
      title: input.title,
      video_url: input.video_url,
      status: 'pending',
      public_token: publicToken,
    })
    .select()
    .single()
  
  if (error) throw new Error(error.message)
  return data
}

// Get all content pieces (for dashboard)
export async function getAllContent(): Promise<ContentPiece[]> {
  const { data, error } = await supabase
    .from('content_pieces')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw new Error(error.message)
  return data || []
}

// Get content by public token (for client view)
export async function getContentByToken(token: string): Promise<ContentPiece | null> {
  const { data, error } = await supabase
    .from('content_pieces')
    .select('*')
    .eq('public_token', token)
    .single()
  
  if (error && error.code !== 'PGRST116') {
    throw new Error(error.message)
  }
  return data
}

// Approve content
export async function approveContent(token: string): Promise<ContentPiece> {
  const { data, error } = await supabase
    .from('content_pieces')
    .update({ status: 'approved' })
    .eq('public_token', token)
    .eq('status', 'pending')
    .select()
    .single()
  
  if (error) throw new Error(error.message)
  return data
}

// Reject content (requires feedback)
export async function rejectContent(token: string, feedback: string): Promise<ContentPiece> {
  if (!feedback.trim()) {
    throw new Error('Feedback is required when rejecting')
  }
  
  const { data, error } = await supabase
    .from('content_pieces')
    .update({ 
      status: 'rejected',
      feedback: feedback.trim()
    })
    .eq('public_token', token)
    .eq('status', 'pending')
    .select()
    .single()
  
  if (error) throw new Error(error.message)
  return data
}