'use client'
import { useState } from 'react'
import { useLogin, useRegister } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

export default function AuthPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const login = useLogin()
  const register = useRegister()

  const mutation = tab === 'login' ? login : register
  const error = mutation.error?.message

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (tab === 'login') {
      login.mutate({ email: form.email, password: form.password })
    } else {
      register.mutate({ name: form.name, email: form.email, password: form.password })
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        {/* Tabs */}
        <div className="mb-6 flex rounded-lg bg-gray-100 p-1">
          {(['login', 'register'] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); mutation.reset() }}
              className={`flex-1 rounded-md py-2 text-sm font-medium capitalize transition-colors ${
                tab === t ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {tab === 'register' && (
            <Input id="name" label="Full Name" value={form.name} onChange={set('name')} required />
          )}
          <Input id="email" label="Email" type="email" value={form.email} onChange={set('email')} required />
          <Input id="password" label="Password" type="password" value={form.password} onChange={set('password')} required />

          {error && <ErrorMessage message={error} />}

          <Button type="submit" loading={mutation.isPending} className="mt-2 w-full">
            {tab === 'login' ? 'Login' : 'Create Account'}
          </Button>
        </form>
      </div>
    </div>
  )
}
