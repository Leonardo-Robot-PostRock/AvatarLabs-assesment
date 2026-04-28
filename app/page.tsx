"use client"

import { useEffect, useState, useCallback, useRef } from 'react'
import { ContentPiece } from '@/features/content/types'
import { Logo } from '@/components/logo'
import { ContentForm } from '@/components/content-form'
import { ContentList } from '@/components/content-list'
import { Card, CardContent } from '@/components/ui/card'
import { getAllContent } from '@/features/content/service'
import { createClientSide, supabase } from '@/lib/supabase'
import { Loader2, Wifi, WifiOff } from 'lucide-react'
import type { SupabaseClient } from '@supabase/supabase-js'

export default function DashboardPage() {
  const [content, setContent] = useState<ContentPiece[]>([])
  const [loading, setLoading] = useState(true)
  const [realtimeConnected, setRealtimeConnected] = useState(false)
  const [usePolling, setUsePolling] = useState(false)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const supabaseRef = useRef<SupabaseClient | null>(null)

  const refreshContent = useCallback(async () => {
    try {
      const data = await getAllContent()
      setContent(data)
    } catch (error) {
      console.warn('Failed to fetch content:', error)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    refreshContent().finally(() => setLoading(false))
  }, [refreshContent])

  // Setup Supabase Realtime
  useEffect(() => {
    const supabaseClient = createClientSide()
    supabaseRef.current = supabaseClient

    const channel = supabaseClient
      .channel('content-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'content_pieces',
        },
        (payload) => {
          console.log('Realtime update:', payload)
          refreshContent()
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setRealtimeConnected(true)
          setUsePolling(false)
        } else {
          console.warn('Realtime subscription failed, falling back to polling')
          setRealtimeConnected(false)
          setUsePolling(true)
        }
      })

    return () => {
      supabaseClient.removeChannel(channel)
    }
  }, [refreshContent])

  // Fallback polling
  useEffect(() => {
    if (!usePolling || loading) return

    pollingIntervalRef.current = setInterval(refreshContent, 3000)

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [usePolling, loading, refreshContent])

  const handleSuccess = () => {
    refreshContent()
  }

  const stats = {
    total: content.length,
    pending: content.filter(c => c.status === 'pending').length,
    approved: content.filter(c => c.status === 'approved').length,
    rejected: content.filter(c => c.status === 'rejected').length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-950/20 to-blue-950/20">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Logo size="md" />
            <div>
              <h1 className="text-2xl font-bold gradient-text">Content Approval</h1>
              <p className="text-sm text-muted-foreground">5-Star Brand</p>
            </div>
          </div>
          
          {/* Connection Status */}
          <div className="flex items-center gap-2 text-xs">
            {realtimeConnected ? (
              <span className="flex items-center gap-1 text-green-500">
                <Wifi className="w-3 h-3" />
                Realtime
              </span>
            ) : usePolling ? (
              <span className="flex items-center gap-1 text-yellow-500">
                <WifiOff className="w-3 h-3" />
                Polling
              </span>
            ) : (
              <span className="text-muted-foreground">Connecting...</span>
            )}
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-foreground">{loading ? '-' : stats.total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-500/10 border-yellow-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-yellow-500">{loading ? '-' : stats.pending}</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">Pending</p>
            </CardContent>
          </Card>
          <Card className="bg-green-500/10 border-green-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-green-500">{loading ? '-' : stats.approved}</p>
              <p className="text-xs text-green-600 dark:text-green-400">Approved</p>
            </CardContent>
          </Card>
          <Card className="bg-red-500/10 border-red-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-red-500">{loading ? '-' : stats.rejected}</p>
              <p className="text-xs text-red-600 dark:text-red-400">Rejected</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Create Form */}
          <Card className="md:col-span-1 h-fit sticky top-8">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Create Content</h2>
              <ContentForm onSuccess={handleSuccess} />
            </CardContent>
          </Card>

          {/* Content List */}
          <div className="md:col-span-2">
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