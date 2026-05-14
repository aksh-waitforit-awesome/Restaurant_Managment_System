// src/components/ui/LoadingScreen.jsx
export default function LoadingScreen() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600"></div>
        {/* Inner Pulse Dot */}
        <div className="absolute h-4 w-4 bg-orange-400 rounded-full animate-pulse"></div>
      </div>

      <h2 className="mt-6 text-xl font-semibold text-gray-700 animate-pulse">
        Restoring Session
      </h2>
      <p className="mt-2 text-sm text-gray-500">
        Please wait while we prepare your workspace...
      </p>
    </div>
  )
}
