import { useState, useEffect, useCallback } from "react"
import useAuthStore from "../store/useAuthStore"

export default function useAuthInitialization() {
  const { isAuthenticated, refreshSession } = useAuthStore()
  const [isChecking, setIsChecking] = useState(true)
  const [error, setError] = useState(null)

  const initializeAuth = useCallback(async () => {
    setIsChecking(true)
    setError(null)
    try {
      if (isAuthenticated) {
        await refreshSession()
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to connect to the server.",
      )
    } finally {
      setIsChecking(false)
    }
  }, [isAuthenticated, refreshSession])

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  return { isChecking, error, initializeAuth }
}
