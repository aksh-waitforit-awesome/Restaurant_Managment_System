import { useState } from "react"
import { useNavigate } from "react-router-dom"
import useAuthStore from "../store/useAuthStore"
import { toast } from "react-hot-toast"

const INITIAL_FORM_DATA = {
  username: "",
  email: "",
  password: "",
}

const Register = () => {
  const navigate = useNavigate()
  const register = useAuthStore((state) => state.register)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!termsAccepted) {
      toast.error("Please accept the terms and conditions.")
      return
    }
    try {
      await register(formData)
      toast.success("Account Created")
      navigate("/auth/login")
      setError(null)
      setFormData(INITIAL_FORM_DATA)
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Registration failed",
      )
    }
  }

  return (
    // Changed p-15 to py-8 px-4 to ensure it doesn't overflow on small screens
    <div className="min-h-screen flex items-center justify-center bg-orange-50/30 py-8 px-4 md:p-6 lg:p-12">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side: Visual/Image Section */}
        {/* Hidden on very small height screens, height adjusted for mobile */}
        <div className="relative md:w-5/12 h-40 md:h-auto">
          <img
            src="/register.jpg"
            alt="Spices and Curry"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-8 text-white">
            <h2 className="text-xl md:text-3xl font-serif font-bold leading-tight">
              Start Your Chapter
            </h2>
            <p className="hidden md:block text-sm opacity-90 mt-2 italic">
              "Join our community for exclusive recipes and birthday treats."
            </p>
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="flex-1 p-6 sm:p-8 md:p-10 lg:p-12">
          <div className="mb-6 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-800">
              Curry <span className="text-orange-600">Chapter</span>
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Create your account to start ordering.
            </p>
            {error && (
              <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-medium">
                {error}
              </div>
            )}
          </div>

          <form
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            onSubmit={handleSubmit}
          >
            {/* Username */}
            <div className="sm:col-span-1">
              <label className="block text-[10px] md:text-xs font-bold text-slate-700 uppercase mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                placeholder="curry_lover99"
              />
            </div>

            {/* Email */}
            <div className="sm:col-span-1">
              <label className="block text-[10px] md:text-xs font-bold text-slate-700 uppercase mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                placeholder="chef@email.com"
              />
            </div>

            {/* Password */}
            <div className="sm:col-span-2">
              <label className="block text-[10px] md:text-xs font-bold text-slate-700 uppercase mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            {/* Terms */}
            <div className="sm:col-span-2 flex items-start py-1">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  className="rounded text-orange-600 focus:ring-orange-500 h-4 w-4 cursor-pointer"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                />
              </div>
              <label className="ml-2 text-xs text-slate-600 leading-tight">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-orange-600 font-semibold hover:underline"
                >
                  Terms & Conditions
                </a>
              </label>
            </div>

            {/* Buttons */}
            <div className="sm:col-span-2 flex flex-col gap-3 pt-2">
              <button className="w-full bg-slate-900 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg active:scale-[0.98]">
                Create Account
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-3.5 rounded-xl transition-all duration-300"
              >
                Continue as Guest
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have a chapter with us?{" "}
            <button
              onClick={() => navigate("/auth/login")}
              className="text-orange-600 font-bold hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
