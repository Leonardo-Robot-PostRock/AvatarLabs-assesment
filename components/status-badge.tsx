import { Badge } from '@/components/ui/badge'
import type { ContentStatus } from '@/features/content/types'

interface StatusBadgeProps {
  status: ContentStatus
}

const statusConfig: Record<ContentStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
  },
  approved: {
    label: 'Approved',
    className: 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30',
  },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  
  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  )
}