import api from './client'
import type { Product, ProductsPage } from '../types'

export const productsApi = {
  getAll: (params?: { search?: string; page?: number; limit?: number }) =>
    api.get<{ data: ProductsPage }>('/products', { params }).then((r) => r.data.data),

  getOne: (id: string) =>
    api.get<{ data: Product }>(`/products/${id}`).then((r) => r.data.data),

  create: (data: { name: string; description: string; price: number; stock: number }) =>
    api.post<{ data: Product }>('/products', data).then((r) => r.data.data),

  update: (id: string, data: Partial<{ name: string; description: string; price: number; stock: number }>) =>
    api.put<{ data: Product }>(`/products/${id}`, data).then((r) => r.data.data),

  remove: (id: string) =>
    api.delete(`/products/${id}`).then((r) => r.data),
}
