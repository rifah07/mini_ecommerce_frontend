'use client'
import { useState } from 'react'
import { useProducts } from '@/lib/hooks/use-products'
import { useAddToCart } from '@/lib/hooks/use-cart'
import { useMe } from '@/lib/hooks/use-auth'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/lib/types'

function ProductCard({ product }: { product: Product }) {
  const addToCart = useAddToCart()
  const { data: user } = useMe()

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900">{product.name}</h3>
        <span className="shrink-0 text-lg font-bold text-blue-600">{formatPrice(product.price)}</span>
      </div>
      <p className="mb-4 flex-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </span>
        {user && (
          <Button
            size="sm"
            disabled={product.stock === 0}
            loading={addToCart.isPending}
            onClick={() => addToCart.mutate({ productId: product.id, quantity: 1 })}
          >
            Add to Cart
          </Button>
        )}
      </div>
    </div>
  )
}

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')

  const { data, isLoading, isError, error } = useProducts({ search: query, page, limit: 12 })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    setQuery(search)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Button type="submit" variant="secondary">Search</Button>
        </form>
      </div>

      {isLoading && <Spinner />}
      {isError && <ErrorMessage message={error?.message ?? 'Failed to load products'} />}

      {data && (
        <>
          {data.items.length === 0 ? (
            <p className="py-16 text-center text-gray-500">No products found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.items.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {data.pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <span className="text-sm text-gray-600">Page {page} of {data.pages}</span>
              <Button variant="secondary" size="sm" disabled={page === data.pages} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
