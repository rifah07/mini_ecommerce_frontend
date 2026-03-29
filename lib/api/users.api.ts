import api from './client'
import type { User } from '../types'

export const usersApi = {
  getAll: () =>
    api.get<{ data: User[] }>('/users').then((r) => r.data.data),

  getOne: (id: string) =>
    api.get<{ data: User }>(`/users/${id}`).then((r) => r.data.data),

  remove: (id: string) =>
    api.delete(`/users/${id}`).then((r) => r.data),
}
