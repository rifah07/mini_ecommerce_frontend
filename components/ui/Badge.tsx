import { cn, ORDER_STATUS_STYLES } from '@/lib/utils'
import type { OrderStatus } from '@/lib/types'

export function Badge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        ORDER_STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  )
}
