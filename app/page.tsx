"use client"

import { useEffect, useState, useCallback, useRef } from 'react'
import { ContentPiece } from '@/features/content/types'
import { Logo } from '@/components/logo'
import { ContentForm } from '@/components/content-form'
import { ContentList } from '@/components/content-list'
import { Card, CardContent } from '@/components/ui/card'
import { getAllContent } from '@/features/content/service'
import { createClientSide } from '@/lib/supabase'
import { Loader2, Wifi, WifiOff } from 'lucide-react'
import type { SupabaseClient } from '@supabase/supabase-js'

export default function DashboardPage() {
  const [content, setContent] = useState<ContentPiece[]>([])
  const [loading, setLoading] = useState(true)
  const [realtimeConnected, setRealtimeConnected] = useState(false)
  const [usePolling, setUsePolling] = useState(false)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const refreshContent = useCallback(async () => {
    try {
      const data = await getAllContent()
      setContent(data)
    } catch (error) {
      console.warn('Failed to fetch content:', error)
    }
  }, [])

  useEffect(() => {
    refreshContent().finally(() => setLoading(false))
  }, [refreshContent])

  useEffect(() => {
    const supabaseClient = createClientSide()

    const channel = supabaseClient
      .channel('content-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'content_pieces' },
        () => refreshContent()
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setRealtimeConnected(true)
          setUsePolling(false)
        } else {
          setRealtimeConnected(false)
          setUsePolling(true)
        }
      })

    return () => { supabaseClient.removeChannel(channel) }
  }, [refreshContent])

  useEffect(() => {
    if (!usePolling || loading) return
    pollingIntervalRef.current = setInterval(refreshContent, 3000)
    return () => { if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current) }
  }, [usePolling, loading, refreshContent])

  const handleSuccess = () => refreshContent()

  const stats = {
    total: content.length,
    pending: content.filter(c => c.status === 'pending').length,
    approved: content.filter(c => c.status === 'approved').length,
    rejected: content.filter(c => c.status === 'rejected').length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-950/20 to-blue-950/20">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div>
              <h1 className="text-lg font-bold gradient-text">Content Approval</h1>
              <p className="text-xs text-muted-foreground">5-Star Brand</p>
            </div>
          </div>
          
          <div className="text-xs">
            {realtimeConnected ? (
              <span className="flex items-center gap-1 text-green-500">
                <Wifi className="w-3 h-3" /> Realtime
              </span>
            ) : usePolling ? (
              <span className="flex items-center gap-1 text-yellow-500">
                <WifiOff className="w-3 h-3" /> Polling
              </span>
            ) : (
              <span className="text-muted-foreground text-xs">...</span>
            )}
          </div>
        </header>

        {/* Stats - Mobile: 2 cols, Desktop: 4 cols */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold">{loading ? '-' : stats.total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-500/10 border-yellow-500/20">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-yellow-500">{loading ? '-' : stats.pending}</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">Pending</p>
            </CardContent>
          </Card>
          <Card className="bg-green-500/10 border-green-500/20">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-green-500">{loading ? '-' : stats.approved}</p>
              <p className="text-xs text-green-600 dark:text-green-400">Approved</p>
            </CardContent>
          </Card>
          <Card className="bg-red-500/10 border-red-500/20">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-red-500">{loading ? '-' : stats.rejected}</p>
              <p className="text-xs text-red-600 dark:text-red-400">Rejected</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Mobile: stacked, Desktop: side by side */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Create Form - Mobile: full width, Desktop: 1/3 */}
          <Card className="lg:w-80 flex-shrink-0 lg:h-fit lg:sticky lg:top-4">
            <CardContent className="p-4 sm:p-6">
              <h2 className="text-lg font-semibold mb-4">Create Content</h2>
              <ContentForm onSuccess={handleSuccess} />
            </CardContent>
          </Card>

          {/* Content List - Mobile: full width, Desktop: 2/3 */}
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              Content Pieces
              <span className="text-xs text-muted-foreground">
                {realtimeConnected ? '(real-time)' : usePolling ? '(refreshing)' : '(connecting...)'}
              </span>
            </h2>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ContentList items={content} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}