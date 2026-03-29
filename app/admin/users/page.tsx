'use client'
import { useUsers, useDeleteUser } from '@/lib/hooks/use-users'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { formatDate } from '@/lib/utils'

export default function AdminUsersPage() {
  const { data: users, isLoading, isError, error } = useUsers()
  const deleteUser = useDeleteUser()

  if (isLoading) return <Spinner />
  if (isError) return <ErrorMessage message={error?.message ?? 'Failed to load users'} />

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Admin — Users</h1>

      {deleteUser.error && (
        <div className="mb-4">
          <ErrorMessage message={deleteUser.error.message} />
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users?.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{formatDate(user.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  {user.role !== 'admin' && (
                    <Button
                      size="sm"
                      variant="danger"
                      loading={deleteUser.isPending}
                      onClick={() => {
                        if (confirm(`Delete user ${user.name}?`)) {
                          deleteUser.mutate(user.id)
                        }
                      }}
                    >
                      Delete
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users?.length === 0 && (
          <p className="py-16 text-center text-gray-500">No users found.</p>
        )}
      </div>
    </div>
  )
}
