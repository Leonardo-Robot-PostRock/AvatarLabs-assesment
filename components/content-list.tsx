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
          <p className="text-sm text-muted-foreground">
            Create your first content piece to get started
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden animate-fade-in">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                  <h3 className="font-semibold truncate text-sm sm:text-base">{item.title}</h3>
                  <StatusBadge status={item.status} />
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground truncate mb-2">
                  {item.video_url}
                </p>
                <div className="flex items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                  <span>
                    {new Date(item.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {item.status === 'rejected' && item.feedback && (
                    <button
                      onClick={() => setShowFeedback(showFeedback === item.id ? null : item.id)}
                      className="flex items-center gap-1 text-red-400 hover:text-red-300"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span className="hidden sm:inline">View feedback</span>
                    </button>
                  )}
                </div>
                {showFeedback === item.id && item.feedback && (
                  <div className="mt-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                    <p className="text-sm text-red-400 font-medium mb-1">Rejection Feedback:</p>
                    <p className="text-sm text-foreground">{item.feedback}</p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyLink(item.public_token)}
                  className="gap-1"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span className="hidden sm:inline">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span className="hidden sm:inline">Link</span>
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                >
                  <a
                    href={`/review/${item.public_token}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}