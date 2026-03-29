import api from './client'
import type { Order, OrderStatus } from '../types'

export const ordersApi = {
  place: (items?: { productId: string; quantity: number }[]) =>
    api.post<{ data: Order }>('/orders', { items }).then((r) => r.data.data),

  getMyOrders: () =>
    api.get<{ data: Order[] }>('/orders').then((r) => r.data.data),

  getMyOrder: (id: string) =>
    api.get<{ data: Order }>(`/orders/${id}`).then((r) => r.data.data),

  cancel: (id: string, reason?: string) =>
    api.put<{ data: Order }>(`/orders/${id}/cancel`, { reason }).then((r) => r.data.data),

  // Admin
  getAllOrders: () =>
    api.get<{ data: Order[] }>('/orders/admin/all').then((r) => r.data.data),

  getOrderById: (id: string) =>
    api.get<{ data: Order }>(`/orders/admin/${id}`).then((r) => r.data.data),

  updateStatus: (id: string, status: OrderStatus) =>
    api.put<{ data: Order }>(`/orders/admin/${id}/status`, { status }).then((r) => r.data.data),
}
