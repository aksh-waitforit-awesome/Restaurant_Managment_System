import { useNavigate, NavLink } from "react-router-dom"
import { useState } from "react"
import { toast } from "react-hot-toast"
import useAuthStore from "../store/useAuthStore"

const Login = () => {
  const navigate = useNavigate()
  const { login, loading } = useAuthStore()
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }
  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await login(formData)
      toast.success("Login Successful")
      navigate("/")
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.message || err.message || "Login failed")
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50/30 p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side: Visual/Image Section */}
        <div className="relative md:w-1/2 h-64 md:h-auto">
          <img
            src="/login.jpg"
            alt="Authentic Indian Curry"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8 text-white">
            <h2 className="text-3xl font-serif font-bold">The Art of Spice</h2>
            <p className="text-sm opacity-90 mt-2 italic">
              "Every dish tells a story. Continue your journey with Curry
              Chapter."
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:w-1/2 p-8 md:p-12">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl font-serif font-bold text-slate-800">
              Curry <span className="text-orange-600">Chapter</span>
            </h1>
            <p className="text-slate-500 mt-2">
              Welcome back! Please enter your details.
            </p>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                placeholder="chef@currychapter.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-slate-600">Remember me</span>
              </label>
              <a
                href="#"
                className="text-orange-600 font-semibold hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-slate-900 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors duration-300 shadow-lg"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-slate-900 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors duration-300 shadow-lg"
            >
              Continue as Guest
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <NavLink
              to="/auth/register"
              className="text-orange-600 font-bold hover:underline"
            >
              Register
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
