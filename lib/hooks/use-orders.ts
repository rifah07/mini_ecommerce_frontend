'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ordersApi } from '../api/orders.api'
import type { OrderStatus } from '../types'

export const ORDERS_KEY = ['orders']

export function useMyOrders() {
  return useQuery({
    queryKey: ORDERS_KEY,
    queryFn: ordersApi.getMyOrders,
  })
}

export function useMyOrder(id: string) {
  return useQuery({
    queryKey: [...ORDERS_KEY, id],
    queryFn: () => ordersApi.getMyOrder(id),
  })
}

export function usePlaceOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ordersApi.place,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ORDERS_KEY })
      qc.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

export function useCancelOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      ordersApi.cancel(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ORDERS_KEY }),
  })
}

// Admin hooks
export function useAllOrders() {
  return useQuery({
    queryKey: [...ORDERS_KEY, 'admin'],
    queryFn: ordersApi.getAllOrders,
  })
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      ordersApi.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ORDERS_KEY }),
  })
}
