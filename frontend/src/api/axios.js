import axios from "axios"
import useAuthStore from "../store/useAuthStore"
const baseURL =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_API_URL
    : "http://localhost:3000/api/v1"
console.log("API Base URL:", baseURL) // Debugging line 
const API = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})
API.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)
// --- Response Interceptor ---
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (originalRequest.url.includes("/auth/refresh")) {
      useAuthStore.getState().logout()
      return Promise.reject(error)
    }
    if (originalRequest.url.includes("/auth/login")) {
      return Promise.reject(error)
    }
    if (error.response?.status == 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        await useAuthStore.getState().refreshSession()
        const newToken = useAuthStore.getState().accessToken
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return API(originalRequest)
      } catch (refreshError) {
        useAuthStore.getState().logout()
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  },
)
export default API
