"use client"

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { getContentByToken, approveContent as approveApi, rejectContent as rejectApi } from '@/features/content/service'
import type { ContentPiece } from '@/lib/supabase'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClientSide } from '@/lib/supabase'
import { Check, X, Loader2, AlertCircle, Wifi, WifiOff } from 'lucide-react'

export default function ReviewPage() {
  const params = useParams()
  const token = params.token as string
  
  const [content, setContent] = useState<ContentPiece | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [actionTaken, setActionTaken] = useState(false)
  const [realtimeConnected, setRealtimeConnected] = useState(false)

  // Fetch content initial
  useEffect(() => {
    async function fetchContent() {
      try {
        const data = await getContentByToken(token)
        if (!data) {
          setError('Content not found')
        } else if (data.status !== 'pending') {
          setContent(data)
          setActionTaken(true)
        } else {
          setContent(data)
        }
      } catch (err) {
        setError('Failed to load content')
      } finally {
        setLoading(false)
      }
    }
    
    fetchContent()
  }, [token])

  // Setup realtime subscription
  useEffect(() => {
    if (actionTaken) return

    const supabase = createClientSide()

    const channel = supabase
      .channel(`review-${token}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'content_pieces',
          filter: `public_token=eq.${token}`,
        },
        (payload) => {
          setContent(payload.new as ContentPiece)
          setActionTaken(true)
          setSubmitting(false)
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setRealtimeConnected(true)
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [token, actionTaken])

  // Fallback polling
  useEffect(() => {
    if (actionTaken || realtimeConnected) return
    
    const interval = setInterval(async () => {
      try {
        const data = await getContentByToken(token)
        if (data && data.status !== 'pending') {
          setContent(data)
          setActionTaken(true)
          setSubmitting(false)
        }
      } catch (err) {}
    }, 3000)
    
    return () => clearInterval(interval)
  }, [token, actionTaken, realtimeConnected])

  async function handleApprove() {
    setSubmitting(true)
    setError('')
    try {
      const updated = await approveApi(token)
      setContent(updated)
      setActionTaken(true)
    } catch (err) {
      setError('Failed to approve. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleReject() {
    if (!showFeedback) {
      setShowFeedback(true)
      return
    }
    
    if (!feedback.trim()) return
    
    setSubmitting(true)
    setError('')
    try {
      const updated = await rejectApi(token, feedback)
      setContent(updated)
      setActionTaken(true)
    } catch (err) {
      setError('Failed to submit feedback. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-purple-950/20 to-blue-950/20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error && !content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-purple-950/20 to-blue-950/20 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
            <h1 className="text-2xl font-bold mb-2">Content Not Found</h1>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getEmbedUrl = (url: string): string | null => {
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
    if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`
    return null
  }

  const embedUrl = content ? getEmbedUrl(content.video_url) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-950/20 to-blue-950/20">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="text-lg font-semibold">Content Approval</span>
          </div>
          {realtimeConnected ? (
            <Wifi className="w-4 h-4 text-green-500" />
          ) : (
            <WifiOff className="w-4 h-4 text-yellow-500" />
          )}
        </header>

        {content && (
          <>
            <Card className="mb-6 overflow-hidden">
              <div className="aspect-video bg-black">
                {embedUrl ? (
                  <iframe src={embedUrl} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">Unable to embed video</div>
                )}
              </div>
              <CardContent className="p-4">
                <h1 className="text-xl font-bold">{content.title}</h1>
                <p className="text-sm text-muted-foreground">
                  Submitted {new Date(content.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>

            {actionTaken && content.status !== 'pending' && (
              <Card className={`mb-6 ${content.status === 'approved' ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'}`}>
                <CardContent className="p-6 text-center">
                  {content.status === 'approved' ? (
                    <>
                      <Check className="w-16 h-16 mx-auto mb-4 text-green-500" />
                      <h2 className="text-2xl font-bold text-green-500 mb-2">Approved!</h2>
                    </>
                  ) : (
                    <>
                      <X className="w-16 h-16 mx-auto mb-4 text-red-500" />
                      <h2 className="text-2xl font-bold text-red-500 mb-2">Rejected</h2>
                      {content.feedback && <p className="mt-2 p-3 bg-black/20 rounded-lg">{content.feedback}</p>}
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {!actionTaken && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Your Decision</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-lg">{error}</div>}
                  <div className="flex gap-4">
                    <Button onClick={handleApprove} disabled={submitting} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                      {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                      Approve
                    </Button>
                    <Button onClick={handleReject} disabled={submitting || (showFeedback && !feedback.trim())} variant="destructive" className="flex-1">
                      {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <X className="w-4 h-4 mr-2" />}
                      {showFeedback ? 'Submit' : 'Reject'}
                    </Button>
                  </div>
                  {showFeedback && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Feedback:</label>
                      <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="What needs to be changed?" className="min-h-[100px]" />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}