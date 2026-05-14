import axios from "axios"
import useAuthStore from "../store/useAuthStore"
const nodeEnv = import.meta.env.VITE_NODE_ENV
console.log("node env", nodeEnv)
const baseURL =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_API_URL
    : "http://localhost:3000/api/v1"
console.log("API Base URL:", baseURL) // checking if the base url is local or production
const API = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// --- Request Interceptor ---
API.interceptors.request.use(
  (config) => {
    // Accessing state inside the interceptor ensures the store exists
    const token = useAuthStore.getState().accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// --- Response Interceptor ---
// ... existing axios create code

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // 1. Check if the failed request was already the REFRESH call
    // If /refresh returns a 401, STOP immediately and logout.
    if (originalRequest.url.includes("/auth/refresh")) {
      useAuthStore.getState().logout()
      return Promise.reject(error)
    }
    if (originalRequest.url.includes("/auth/login")) {
      return Promise.reject(error)
    }
    // 2. Handle 401 for all other requests
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        console.log("Attempting background token refresh...")
        const store = useAuthStore.getState()
        await store.refreshSession()
        const newToken = useAuthStore.getState().accessToken
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return API(originalRequest)
      } catch (refreshError) {
        // If the background refresh fails, clear everything
        useAuthStore.getState().logout()
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  },
)
export default API
