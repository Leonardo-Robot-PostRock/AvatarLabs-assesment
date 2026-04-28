import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client for server-side operations (App Router)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Create client for client-side use (browser)
export function createClientSide(): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey)
}

export type ContentStatus = 'pending' | 'approved' | 'rejected'

export interface ContentPiece {
  id: string
  title: string
  video_url: string
  status: ContentStatus
  feedback: string | null
  public_token: string
  created_at: string
}

export interface CreateContentInput {
  title: string
  video_url: string
}