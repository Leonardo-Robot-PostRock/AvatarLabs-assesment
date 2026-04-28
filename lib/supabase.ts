import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Server-side client (App Router)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Browser client singleton (to avoid multiple GoTrueClient instances)
let browserClient: SupabaseClient | null = null

export function createClientSide(): SupabaseClient {
  if (typeof window === 'undefined') {
    // Server-side fallback
    return supabase
  }
  
  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  
  return browserClient
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