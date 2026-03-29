'use client'
import { useAllOrders, useUpdateOrderStatus } from '@/lib/hooks/use-orders'
import { Spinner } from '@/components/ui/Spinner'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { formatPrice, formatDate } from '@/lib/utils'
import type { OrderStatus } from '@/lib/types'

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: 'shipped',
  shipped: 'delivered',
}

export default function AdminOrdersPage() {
  const { data: orders, isLoading, isError, error } = useAllOrders()
  const updateStatus = useUpdateOrderStatus()

  if (isLoading) return <Spinner />
  if (isError) return <ErrorMessage message={error?.message ?? 'Failed to load orders'} />

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Admin — Orders</h1>

      {updateStatus.error && (
        <div className="mb-4">
          <ErrorMessage message={updateStatus.error.message} />
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders?.map((order) => {
              const next = NEXT_STATUS[order.status]
              return (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-4 py-3 text-gray-900">{order.user?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{formatPrice(order.totalAmount)}</td>
                  <td className="px-4 py-3">
                    <Badge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {next ? (
                      <Button
                        size="sm"
                        loading={updateStatus.isPending}
                        onClick={() => updateStatus.mutate({ id: order.id, status: next })}
                      >
                        Mark {next}
                      </Button>
                    ) : (
                      <span className="text-xs text-gray-400 capitalize">{order.status}</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {orders?.length === 0 && (
          <p className="py-16 text-center text-gray-500">No orders yet.</p>
        )}
      </div>
    </div>
  )
}
