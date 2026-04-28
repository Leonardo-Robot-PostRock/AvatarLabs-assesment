"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createContent } from '@/app/actions'
import { Loader2, Plus, Video } from 'lucide-react'

interface ContentFormProps {
  onSuccess?: () => void
}

export function ContentForm({ onSuccess }: ContentFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError('')
    
    const result = await createContent(formData)
    
    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      setIsLoading(false)
      onSuccess?.()
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-lg border border-red-500/20">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium text-foreground">
          Content Title
        </label>
        <Input
          id="title"
          name="title"
          placeholder="e.g., Q1 Marketing Video"
          required
          minLength={3}
          className="bg-background/50"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="video_url" className="text-sm font-medium text-foreground">
          Video URL
        </label>
        <div className="relative">
          <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="video_url"
            name="video_url"
            type="url"
            placeholder="YouTube or Vimeo URL"
            required
            className="pl-10 bg-background/50"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Supported: YouTube, Vimeo
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <Plus className="w-4 h-4 mr-2" />
            Create Content
          </>
        )}
      </Button>
    </form>
  )
}