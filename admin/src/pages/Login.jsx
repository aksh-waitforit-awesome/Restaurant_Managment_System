import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import useAuthStore from "../store/useAuthStore"

const Login = () => {
  const [email, setEmail] = useState(
    import.meta.env.VITE_DEMO_ADMIN_EMAIL || "",
  )

  const [password, setPassword] = useState(
    import.meta.env.VITE_DEMO_ADMIN_PASSWORD || "",
  )
  const [error, setError] = useState("")

  const { login, loading } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || "/"

  // --- Quick Login Handler ---
  const handleQuickLogin = async (roleEmail, rolePassword) => {
    setError("")
    try {
      await login({ email: roleEmail, password: rolePassword })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err?.response?.data?.message || "Quick Login Failed")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      await login({ email, password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Login Failed")
    }
  }

  const demoUsers = [
    {
      label: "Waiter",
      email: import.meta.env.VITE_WAITER_EMAIL,
      pass: import.meta.env.VITE_WAITER_PASSWORD,
      color: "bg-orange-500",
    },
    {
      label: "Chef",
      email: import.meta.env.VITE_CHEF_EMAIL,
      pass: import.meta.env.VITE_CHEF_PASSWORD,
      color: "bg-green-600",
    },
    {
      label: "Cashier",
      email: import.meta.env.VITE_CASHIER_EMAIL,
      pass: import.meta.env.VITE_CASHIER_PASSWORD,
      color: "bg-purple-600",
    },
    {
      label: "Delivery",
      email: import.meta.env.VITE_DELIVERY_EMAIL,
      pass: import.meta.env.VITE_DELIVERY_PASSWORD,
      color: "bg-blue-500",
    },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
            Internal Access
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
            Staff Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter credentials or use recruiter quick access
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="staff@restaurant.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition-colors"
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </form>

        {/* --- Recruiter Quick Access Section --- */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 text-center">
            Recruiter Quick Access
          </p>
          <div className="grid grid-cols-2 gap-3">
            {demoUsers.map((user) => (
              <button
                key={user.label}
                onClick={() => handleQuickLogin(user.email, user.pass)}
                disabled={loading}
                className={`flex flex-col items-center justify-center p-2 rounded-lg text-white text-xs font-bold transition-transform active:scale-95 ${user.color} hover:opacity-90 shadow-sm`}
              >
                <span>Login as</span>
                <span className="uppercase">{user.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
