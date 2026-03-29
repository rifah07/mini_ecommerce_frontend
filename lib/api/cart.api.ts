import api from './client'
import type { Cart } from '../types'

export const cartApi = {
  get: () =>
    api.get<{ data: Cart }>('/cart').then((r) => r.data.data),

  addItem: (data: { productId: string; quantity: number }) =>
    api.post<{ data: Cart }>('/cart', data).then((r) => r.data.data),

  updateItem: (productId: string, quantity: number) =>
    api.put<{ data: Cart }>(`/cart/${productId}`, { quantity }).then((r) => r.data.data),

  removeItem: (productId: string) =>
    api.delete<{ data: Cart }>(`/cart/${productId}`).then((r) => r.data.data),

  clear: () =>
    api.delete<{ data: Cart }>('/cart').then((r) => r.data.data),
}
