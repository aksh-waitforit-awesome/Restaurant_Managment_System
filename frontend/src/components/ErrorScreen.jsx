// src/components/ui/ErrorScreen.jsx
import { useNavigate } from "react-router-dom"
import useAuthStore from "../store/useAuthStore"

export default function ErrorScreen({ error, retry }) {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  const handleReset = () => {
    logout()
    navigate("/auth/login")
    window.location.reload() // Ensures a clean state
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">
        {/* Error Icon */}
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Connection Error
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          {error ||
            "We encountered an unexpected issue while connecting to the server."}
        </p>

        <div className="space-y-3">
          <button
            onClick={retry}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-200"
          >
            Try Again
          </button>

          <button
            onClick={handleReset}
            className="w-full text-sm text-gray-500 hover:text-red-600 transition-colors font-medium"
          >
            Clear session and return to login
          </button>
        </div>
      </div>
    </div>
  )
}
