import api from './client'
import type { User } from '../types'

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<{ data: User }>('/auth/register', data).then((r) => r.data.data),

  login: (data: { email: string; password: string }) =>
    api.post<{ data: User }>('/auth/login', data).then((r) => r.data.data),

  logout: () =>
    api.post('/auth/logout').then((r) => r.data),

  refresh: () =>
    api.post<{ data: User }>('/auth/refresh').then((r) => r.data.data),

  getProfile: () =>
    api.get<{ data: User }>('/auth/profile').then((r) => r.data.data),

  updateProfile: (data: { name?: string; email?: string }) =>
    api.put<{ data: User }>('/auth/profile', data).then((r) => r.data.data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/change-password', data).then((r) => r.data),
}
