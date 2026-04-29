"use client"

import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { ContentPiece } from '@/features/content/types'
import { Logo } from '@/components/logo'
import { ContentForm } from '@/components/content-form'
import { ContentList } from '@/components/content-list'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getAllContent } from '@/features/content/service'
import { createClientSide } from '@/lib/supabase'
import { Loader2, Wifi, WifiOff, Filter, Search } from 'lucide-react'

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected'

export default function DashboardPage() {
  const [content, setContent] = useState<ContentPiece[]>([])
  const [loading, setLoading] = useState(true)
  const [realtimeConnected, setRealtimeConnected] = useState(false)
  const [usePolling, setUsePolling] = useState(false)
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
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

  const stats = useMemo(() => ({
    total: content.length,
    pending: content.filter(c => c.status === 'pending').length,
    approved: content.filter(c => c.status === 'approved').length,
    rejected: content.filter(c => c.status === 'rejected').length,
  }), [content])

  const filteredContent = useMemo(() => {
    return content.filter(item => {
      if (filter !== 'all' && item.status !== filter) return false
      if (search.trim()) {
        const searchLower = search.toLowerCase()
        const matchTitle = item.title.toLowerCase().includes(searchLower)
        const matchUrl = item.video_url.toLowerCase().includes(searchLower)
        if (!matchTitle && !matchUrl) return false
      }
      return true
    })
  }, [content, filter, search])

  const filters: { value: FilterStatus; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: stats.total },
    { value: 'pending', label: 'Pending', count: stats.pending },
    { value: 'approved', label: 'Approved', count: stats.approved },
    { value: 'rejected', label: 'Rejected', count: stats.rejected },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-950/20 to-blue-950/20">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-4 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <Logo size="sm" />
            <div>
              <h1 className="text-lg sm:text-2xl font-bold gradient-text">Content Approval</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">5-Star Brand</p>
            </div>
          </div>
          
          <div className="text-xs">
            {realtimeConnected ? (
              <span className="flex items-center gap-1 text-green-500">
                <Wifi className="w-3 h-3" /> <span className="hidden sm:inline">Realtime</span>
              </span>
            ) : usePolling ? (
              <span className="flex items-center gap-1 text-yellow-500">
                <WifiOff className="w-3 h-3" /> <span className="hidden sm:inline">Polling</span>
              </span>
            ) : (
              <span className="text-muted-foreground text-xs">...</span>
            )}
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-8">
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-3 sm:p-4 text-center">
              <p className="text-xl sm:text-3xl font-bold">{loading ? '-' : stats.total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-500/10 border-yellow-500/20">
            <CardContent className="p-3 sm:p-4 text-center">
              <p className="text-xl sm:text-3xl font-bold text-yellow-500">{loading ? '-' : stats.pending}</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">Pending</p>
            </CardContent>
          </Card>
          <Card className="bg-green-500/10 border-green-500/20">
            <CardContent className="p-3 sm:p-4 text-center">
              <p className="text-xl sm:text-3xl font-bold text-green-500">{loading ? '-' : stats.approved}</p>
              <p className="text-xs text-green-600 dark:text-green-400">Approved</p>
            </CardContent>
          </Card>
          <Card className="bg-red-500/10 border-red-500/20">
            <CardContent className="p-3 sm:p-4 text-center">
              <p className="text-xl sm:text-3xl font-bold text-red-500">{loading ? '-' : stats.rejected}</p>
              <p className="text-xs text-red-600 dark:text-red-400">Rejected</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col xl:flex-row gap-4 sm:gap-6">
          {/* Create Form */}
          <Card className="xl:w-80 xl:sticky xl:top-4 xl:h-fit">
            <CardContent className="p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Create Content</h2>
              <ContentForm onSuccess={handleSuccess} />
            </CardContent>
          </Card>

          {/* Content List Area */}
          <div className="flex-1 min-w-0 flex flex-col min-h-[400px] xl:min-h-0 xl:max-h-[calc(100vh-280px)]">
            {/* Search + Filter Toggle */}
            <div className="space-y-2 mb-3 sm:mb-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title or URL..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-2">
                  <Filter className="w-4 h-4" />
                  {filter !== 'all' && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded">
                      {filter}
                    </span>
                  )}
                </Button>
              </div>

              {showFilters && (
                <div className="flex items-center gap-2 flex-wrap pt-2 border-t">
                  {filters.map(f => (
                    <Button
                      key={f.value}
                      variant={filter === f.value ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setFilter(f.value)}
                      className="text-xs"
                    >
                      {f.label} ({f.count})
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto xl:pr-2">
              {loading ? (
                <div className="flex items-center justify-center py-8 sm:py-12">
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <ContentList items={filteredContent} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}