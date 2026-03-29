'use client'
import Link from 'next/link'
import { useMyOrders, useCancelOrder } from '@/lib/hooks/use-orders'
import { Spinner } from '@/components/ui/Spinner'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { formatPrice, formatDate } from '@/lib/utils'

export default function OrdersPage() {
  const { data: orders, isLoading, isError, error } = useMyOrders()
  const cancel = useCancelOrder()

  if (isLoading) return <Spinner />
  if (isError) return <ErrorMessage message={error?.message ?? 'Failed to load orders'} />

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">My Orders</h1>

      {cancel.error && <ErrorMessage message={cancel.error.message} />}

      {!orders?.length ? (
        <p className="py-16 text-center text-gray-500">You have no orders yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-gray-400">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                </div>
                <Badge status={order.status} />
              </div>

              <div className="mb-3 flex flex-col gap-1 text-sm text-gray-600">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.productName} × {item.quantity}</span>
                    <span>{formatPrice(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="font-semibold text-gray-900">Total: {formatPrice(order.totalAmount)}</span>
                {order.status === 'pending' && (
                  <Button
                    variant="danger"
                    size="sm"
                    loading={cancel.isPending}
                    onClick={() => cancel.mutate({ id: order.id })}
                  >
                    Cancel
                  </Button>
                )}
              </div>

              {order.cancellationReason && (
                <p className="mt-2 text-xs text-gray-400">Reason: {order.cancellationReason}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
