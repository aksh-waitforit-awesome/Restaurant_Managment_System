import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
  refresh as refreshService,
} from "../services/authServices"
import { useCartStore } from "./useCartStore"
const useAuthStore = create(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      loading: false,
      // Login Action
      login: async (credentials) => {
        set({ loading: true })
        try {
          const data = await loginService(credentials)
          set({
            user: data.user,
            accessToken: data.accessToken,
            isAuthenticated: true,
            loading: false,
          })
        } catch (error) {
          set({ loading: false })
          throw error
        }
      },
      // Register Action
      register: async (data) => {
        set({ loading: true })
        try {
          const response = await registerService(data)
          if (response?.success) {
            set({ loading: false })
            return true
          } else {
            throw new Error("registration failed try again")
          }
        } catch (error) {
          set({ loading: false })
          console.log(error)
          throw error
        }
      },
      logout: async () => {
        await logoutService()
        localStorage.removeItem("user-auth")
        set({ accessToken: null, user: null, isAuthenticated: false })
        useCartStore.getState().clearCart()
      },
      refreshSession: async () => {
        try {
          const data = await refreshService()
          set({
            accessToken: data.accessToken,
            user: data.user,
            isAuthenticated: true,
          })
        } catch (error) {
          localStorage.removeItem("user-auth")
          set({ user: null, accessToken: null, isAuthenticated: false })
          throw error
        }
      },
    }),
    {
      name: "user-auth", // unique name
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
export default useAuthStore
