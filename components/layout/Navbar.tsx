'use client'
import Link from 'next/link'
import { useMe, useLogout } from '@/lib/hooks/use-auth'
import { useCart } from '@/lib/hooks/use-cart'
import { Button } from '@/components/ui/Button'

export function Navbar() {
  const { data: user } = useMe()
  const { data: cart } = useCart()
  const logout = useLogout()

  const cartCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0

  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/products" className="text-xl font-bold text-blue-600">
          ShopNest
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/products" className="hover:text-blue-600 transition-colors">
            Products
          </Link>

          {user && (
            <>
              <Link href="/cart" className="relative hover:text-blue-600 transition-colors">
                Cart
                {cartCount > 0 && (
                  <span className="absolute -right-3 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link href="/orders" className="hover:text-blue-600 transition-colors">
                Orders
              </Link>
            </>
          )}

          {user?.role === 'admin' && (
            <Link href="/admin/products" className="text-purple-600 hover:text-purple-800 transition-colors">
              Admin
            </Link>
          )}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-600">Hi, {user.name.split(' ')[0]}</span>
              <Button
                variant="ghost"
                size="sm"
                loading={logout.isPending}
                onClick={() => logout.mutate()}
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/auth">
              <Button size="sm">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
