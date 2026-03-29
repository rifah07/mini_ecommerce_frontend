import axios from 'axios'

// All requests go to /api/* which Next.js proxies to the backend.
// This means cookies are sent on the same origin - no CORS issues.
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,         // Always send cookies
  headers: { 'Content-Type': 'application/json' },
})

// Extract the actual error message from the backend error shape
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ?? err.message ?? 'Something went wrong'
    return Promise.reject(new Error(message))
  },
)

export default api
