"use client"

import { useState } from 'react'
import { ContentPiece } from '@/features/content/types'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Copy, Check, ExternalLink, Clock, MessageSquare } from 'lucide-react'

interface ContentListProps {
  items: ContentPiece[]
}

export function ContentList({ items }: ContentListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState<string | null>(null)

  const copyLink = (token: string) => {
    const url = `${window.location.origin}/review/${token}`
    navigator.clipboard.writeText(url)
    setCopiedId(token)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (items.length === 0) {
    return (
      <Card className="p-6 sm:p-8 text-center">
        <CardContent>
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold mb-2">No Content Yet</h3>
          <p className="text-sm text-muted-foreground">Create your first content piece to get started</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden animate-fade-in">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col gap-2">
              {/* Title + Status row */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <h3 className="font-semibold truncate text-sm sm:text-base min-w-0">{item.title}</h3>
                  <StatusBadge status={item.status} />
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button variant="outline" size="sm" onClick={() => copyLink(item.public_token)} className="h-8 px-2 sm:px-3">
                    {copiedId === item.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </Button>
                  <Button variant="ghost" size="sm" asChild className="h-8 px-2">
                    <a href={`/review/${item.public_token}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              </div>
              
              {/* URL */}
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{item.video_url}</p>
              
              {/* Date + Feedback */}
              <div className="flex items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                <span>{new Date(item.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                {item.status === 'rejected' && item.feedback && (
                  <button onClick={() => setShowFeedback(showFeedback === item.id ? null : item.id)} className="flex items-center gap-1 text-red-400 hover:text-red-300">
                    <MessageSquare className="w-3 h-3" />
                  </button>
                )}
              </div>
              
              {/* Feedback expanded */}
              {showFeedback === item.id && item.feedback && (
                <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <p className="text-xs sm:text-sm text-red-400 font-medium mb-1">Rejection Feedback:</p>
                  <p className="text-sm text-foreground whitespace-pre-wrap">{item.feedback}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}