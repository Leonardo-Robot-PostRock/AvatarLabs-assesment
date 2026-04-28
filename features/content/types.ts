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