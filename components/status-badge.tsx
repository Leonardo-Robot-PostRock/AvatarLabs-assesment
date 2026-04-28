import { Badge } from '@/components/ui/badge'
import type { ContentStatus } from '@/features/content/types'

interface StatusBadgeProps {
  status: ContentStatus
}

const statusConfig = {
  pending: {
    variant: 'pending' as const,
    label: 'Pending',
  },
  approved: {
    variant: 'approved' as const,
    label: 'Approved',
  },
  rejected: {
    variant: 'rejected' as const,
    label: 'Rejected',
  },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  
  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  )
}