import { useState } from "react"
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom"
import {
  Menu,
  X,
  ShoppingCart,
  LogIn,
  LogOut,
  Sun,
  Moon,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react"
import useAuthStore from "../store/useAuthStore"
import { useTheme } from "../context/ThemeContext"
import { useCartStore } from "../store/useCartStore"

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation() // To detect if we are on the menu page
  const { theme, setTheme } = useTheme()
  const { getCartItemCount } = useCartStore()
  const cartItemCount = getCartItemCount()
  const { isAuthenticated, logout } = useAuthStore() // Destructure logout here

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "Orders", path: "/customer-orders" },
  ]

  const isMenuPage = location.pathname === "/menu"

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("theme-luxury")
    else setTheme("light")
  }

  return (
    <>
      <nav className="h-20 bg-surface border-b border-accent sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-[1600px] mx-auto h-full px-6 flex items-center justify-between">
          {/* LEFT: Brand Name */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary rounded-lg group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
              <UtensilsCrossed className="text-surface" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-text">
              Curry<span className="text-primary">Chapter</span>
            </span>
          </Link>

          {/* RIGHT SIDE: Navigation + Actions combined */}
          <div className="flex items-center gap-2 md:gap-8">
            {/* Desktop Links - Now positioned to the right */}
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-4 py-2 text-sm font-black uppercase tracking-widest transition-all ${
                      isActive
                        ? "text-primary bg-primary/5 rounded-lg"
                        : "text-text opacity-60 hover:opacity-100"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
            <div className="h-6 w-[1px] bg-accent hidden md:block" />{" "}
            {/* Vertical Divider */}
            {/* Icons Section */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2.5 hover:bg-accent rounded-xl text-text transition-all active:scale-90"
              >
                {theme === "dark" ? (
                  <Sun size={20} />
                ) : theme === "theme-luxury" ? (
                  <Sparkles size={20} />
                ) : (
                  <Moon size={20} />
                )}
              </button>

              {/* Hide Navbar Cart on Menu Page (because we have the FAB) */}
              {!isMenuPage && (
                <NavLink
                  to="/cart"
                  className="relative p-2.5 hover:bg-accent rounded-xl text-text transition-all"
                >
                  <ShoppingCart size={20} />
                  {cartItemCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 bg-primary text-surface text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                      {cartItemCount}
                    </span>
                  )}
                </NavLink>
              )}

              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2.5 text-text hover:bg-accent rounded-xl"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MOBILE SIDEBAR --- */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* --- MOBILE SIDEBAR --- */}
      <aside
        className={`fixed top-0 right-0 w-[300px] h-full bg-surface z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* CHANGE: Added 'pb-32' (bottom padding) to ensure the Login button 
      is pushed above the Floating Cart Button 
  */}
        <div className="p-8 pb-32 flex flex-col h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-12">
            <span className="font-black uppercase tracking-widest text-sm opacity-40">
              Menu
            </span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 hover:bg-accent rounded-full"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `text-3xl font-black transition-all ${isActive ? "text-primary translate-x-2" : "text-text opacity-70"}`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* The Auth Section at the bottom */}
          <div className="mt-auto pt-10">
            <div className="h-[1px] bg-accent w-full mb-6" />

            {isAuthenticated ? (
              <button
                className="w-full flex items-center justify-center gap-3 bg-red-500/10 text-red-500 py-4 rounded-2xl font-black uppercase tracking-widest text-xs"
                onClick={() => {
                  logout()
                  setIsSidebarOpen(false)
                }}
              >
                <LogOut size={18} /> Logout
              </button>
            ) : (
              <button
                className="w-full flex items-center justify-center gap-3 bg-primary text-surface py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg"
                onClick={() => {
                  navigate("/auth/login")
                  setIsSidebarOpen(false)
                }}
              >
                <LogIn size={18} /> Login / Sign Up
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}

export default Navbar
