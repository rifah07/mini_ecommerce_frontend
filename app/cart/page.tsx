'use client'
import { useRouter } from 'next/navigation'
import { useCart, useUpdateCartItem, useRemoveCartItem, useClearCart } from '@/lib/hooks/use-cart'
import { usePlaceOrder } from '@/lib/hooks/use-orders'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const router = useRouter()
  const { data: cart, isLoading } = useCart()
  const updateItem = useUpdateCartItem()
  const removeItem = useRemoveCartItem()
  const clearCart = useClearCart()
  const placeOrder = usePlaceOrder()

  const total = cart?.items?.reduce((sum, i) => sum + Number(i.priceSnapshot) * i.quantity, 0) ?? 0

  const handleCheckout = () => {
    placeOrder.mutate(undefined, {
      onSuccess: () => router.push('/orders'),
    })
  }

  if (isLoading) return <Spinner />

  const items = cart?.items ?? []

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
        {items.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => clearCart.mutate()}>
            Clear Cart
          </Button>
        )}
      </div>

      {placeOrder.error && <ErrorMessage message={placeOrder.error.message} />}

      {items.length === 0 ? (
        <div className="py-16 text-center text-gray-500">
          <p className="mb-4">Your cart is empty.</p>
          <Button onClick={() => router.push('/products')}>Browse Products</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.product.name}</p>
                <p className="text-sm text-gray-500">{formatPrice(item.priceSnapshot)} each</p>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center gap-2">
                <button
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
                  onClick={() =>
                    item.quantity > 1
                      ? updateItem.mutate({ productId: item.product.id, quantity: item.quantity - 1 })
                      : removeItem.mutate(item.product.id)
                  }
                >
                  −
                </button>
                <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                <button
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
                  onClick={() => updateItem.mutate({ productId: item.product.id, quantity: item.quantity + 1 })}
                >
                  +
                </button>
              </div>

              <p className="w-20 text-right font-semibold text-gray-900">
                {formatPrice(Number(item.priceSnapshot) * item.quantity)}
              </p>

              <button
                className="text-sm text-red-500 hover:text-red-700"
                onClick={() => removeItem.mutate(item.product.id)}
              >
                Remove
              </button>
            </div>
          ))}

          {/* Total & Checkout */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Button
              className="mt-4 w-full"
              size="lg"
              loading={placeOrder.isPending}
              onClick={handleCheckout}
            >
              Place Order
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
