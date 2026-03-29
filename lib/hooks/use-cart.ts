'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cartApi } from '../api/cart.api'

export const CART_KEY = ['cart']

export function useCart() {
  return useQuery({
    queryKey: CART_KEY,
    queryFn: cartApi.get,
    retry: false,
  })
}

export function useAddToCart() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: cartApi.addItem,
    onSuccess: (cart) => qc.setQueryData(CART_KEY, cart),
  })
}

export function useUpdateCartItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartApi.updateItem(productId, quantity),
    onSuccess: (cart) => qc.setQueryData(CART_KEY, cart),
  })
}

export function useRemoveCartItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: cartApi.removeItem,
    onSuccess: (cart) => qc.setQueryData(CART_KEY, cart),
  })
}

export function useClearCart() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: cartApi.clear,
    onSuccess: (cart) => qc.setQueryData(CART_KEY, cart),
  })
}
