// services/api.ts
import axios from 'axios'

// Express is the single entry point in both dev and production:
//   - dev:  Express (:5000) reverse-proxies non-API traffic to Vite (:8080)
//   - prod: Express serves the built SPA from dist/ directly
// Because the browser always hits Express on the same origin, API_URL is always
// empty — calls like api.post('/auth/login') resolve to the current origin.
// Set VITE_API_URL only if you need to override (e.g. a remote staging API).
const API_URL = import.meta.env.VITE_API_URL || ''

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial for receiving/sending HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
})

let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb)
}

const onRefreshed = () => {
  refreshSubscribers.forEach((cb) => cb('refreshed'))
  refreshSubscribers = []
}

// Add a response interceptor to handle expired access tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error
    const originalRequest = config

    // Check if error is 401 (Unauthorized) and has not been retried yet
    if (response && response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request until token is refreshed
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(api(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Attempt to rotate access token using HttpOnly refresh cookie
        await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        )

        isRefreshing = false
        onRefreshed()

        // Retry original request
        return api(originalRequest)
      } catch (refreshError) {
        isRefreshing = false
        refreshSubscribers = []

        // If refresh fails, clear auth state and force logout redirect
        console.warn('Session expired. Redirecting to logout.')
        if (typeof window !== 'undefined') {
          // Trigger custom event or redirect
          window.dispatchEvent(new Event('auth:session-expired'))
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)
