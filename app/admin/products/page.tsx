'use client'
import { useState } from 'react'
import { useProducts } from '@/lib/hooks/use-products'
import { useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/lib/hooks/use-products'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/lib/types'

const EMPTY = { name: '', description: '', price: '', stock: '' }

export default function AdminProductsPage() {
  const { data, isLoading } = useProducts({ limit: 50 })
  const create = useCreateProduct()
  const update = useUpdateProduct()
  const remove = useDeleteProduct()

  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const startEdit = (p: Product) => {
    setEditing(p)
    setForm({ name: p.name, description: p.description, price: String(p.price), stock: String(p.stock) })
    setShowForm(true)
  }

  const reset = () => {
    setForm(EMPTY)
    setEditing(null)
    setShowForm(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
    }
    if (editing) {
      update.mutate({ id: editing.id, data: payload }, { onSuccess: reset })
    } else {
      create.mutate(payload, { onSuccess: reset })
    }
  }

  const mutation = editing ? update : create
  const mutationError = mutation.error?.message ?? remove.error?.message

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin — Products</h1>
        <Button onClick={() => { reset(); setShowForm(true) }}>+ New Product</Button>
      </div>

      {mutationError && <div className="mb-4"><ErrorMessage message={mutationError} /></div>}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">{editing ? 'Edit Product' : 'New Product'}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Name" value={form.name} onChange={set('name')} required />
            <Input label="Price ($)" type="number" step="0.01" value={form.price} onChange={set('price')} required />
            <Input label="Stock" type="number" value={form.stock} onChange={set('stock')} required />
            <div className="sm:col-span-2 flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={3}
                value={form.description}
                onChange={set('description')}
                required
              />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <Button type="submit" loading={mutation.isPending}>
              {editing ? 'Save Changes' : 'Create Product'}
            </Button>
            <Button type="button" variant="secondary" onClick={reset}>Cancel</Button>
          </div>
        </form>
      )}

      {/* Table */}
      {isLoading ? <Spinner /> : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.items.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 text-gray-600">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className={p.stock > 0 ? 'text-green-600' : 'text-red-500'}>{p.stock}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={() => startEdit(p)}>Edit</Button>
                      <Button
                        size="sm"
                        variant="danger"
                        loading={remove.isPending}
                        onClick={() => remove.mutate(p.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
