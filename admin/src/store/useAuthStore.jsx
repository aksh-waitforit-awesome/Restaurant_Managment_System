import { create } from "zustand"
import { persist } from "zustand/middleware"
import authService from "../services/authServices"

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null, // { username, role }
      accessToken: null,
      isAuthenticated: false,
      loading: false,

      // Login Action
      login: async (credentials) => {
        set({ loading: true })
        try {
          const data = await authService.login(credentials)
          set({
            user: data.user,
            accessToken: data.accessToken,
            isAuthenticated: true,
            loading: false,
          })
        } catch (error) {
          set({ loading: false })
          console.log(error)
          throw error
        }
      },

      // Refresh Token Action
      refreshSession: async () => {
        try {
          const data = await authService.refresh()
          set({
            accessToken: data.accessToken,
            user: data.user,
            isAuthenticated: true,
          })
        } catch (error) {
          set({ user: null, accessToken: null, isAuthenticated: false })
          throw error
        }
      },

      // Logout Action
      logout: async () => {
        try {
          await authService.logout()
        } finally {
          set({ user: null, accessToken: null, isAuthenticated: false })
          localStorage.removeItem("admin-auth")
        }
      },

      // RBAC Helpers
      checkPermission: (allowedRoles) => {
        const role = get().user?.role
        return allowedRoles.includes(role)
      },
    }),
    {
      name: "admin-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

export default useAuthStore
