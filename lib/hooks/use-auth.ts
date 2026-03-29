'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authApi } from '../api/auth.api'

export const AUTH_KEY = ['auth', 'me']

export function useMe() {
  return useQuery({
    queryKey: AUTH_KEY,
    queryFn: authApi.getProfile,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}

export function useLogin() {
  const qc = useQueryClient()
  const router = useRouter()
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (user) => {
      qc.setQueryData(AUTH_KEY, user)
      router.push(user.role === 'admin' ? '/admin/products' : '/products')
    },
  })
}

export function useRegister() {
  const qc = useQueryClient()
  const router = useRouter()
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (user) => {
      qc.setQueryData(AUTH_KEY, user)
      router.push('/products')
    },
  })
}

export function useLogout() {
  const qc = useQueryClient()
  const router = useRouter()
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      qc.clear()
      router.push('/auth')
    },
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (user) => qc.setQueryData(AUTH_KEY, user),
  })
}

export function useChangePassword() {
  return useMutation({ mutationFn: authApi.changePassword })
}
