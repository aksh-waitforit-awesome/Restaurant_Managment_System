import { NavLink, Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import useAuthStore from "../store/useAuthStore"
import {
  HiOutlineUserCircle,
  HiLogout,
  HiLogin,
  HiUserAdd,
} from "react-icons/hi"

const MainLayout = () => {
  const { user, isAuthenticated, logout } = useAuthStore()
  console.log("MainLayout - isAuthenticated:", user)
  return (
    <div className="flex flex-col min-h-screen bg-surface text-text transition-colors duration-300">
      {/* MODERNIZED TOP UTILITY BAR 
         Switched to a more professional 'surface' feel with a bottom border
      */}
      <div className="bg-surface border-b border-accent px-6 py-2">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center text-xs md:text-sm">
          {/* Left Side: Tagline or Delivery Info */}
          <div className="hidden sm:block text-text opacity-50 font-medium tracking-tight">
            Free delivery on orders over{" "}
            <span className="text-primary font-bold">₹500</span>
          </div>

          {/* Right Side: Auth Actions */}
          <div className="flex items-center gap-6 ml-auto">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 group cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <HiOutlineUserCircle className="text-xl" />
                  </div>
                  <span className="font-bold text-text/80  ">
                    Hey, <span className="text-primary">{user?.username}</span>
                  </span>
                </div>
                <div className="h-4 w-[1px] bg-accent" /> {/* Divider */}
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 font-black uppercase tracking-widest text-[10px] text-red-500 hover:text-red-600 transition-colors"
                >
                  <HiLogout className="text-sm" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <NavLink
                  to="/auth/login"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 font-black uppercase tracking-widest text-[10px] transition-all hover:text-primary ${
                      isActive ? "text-primary" : "text-text/60"
                    }`
                  }
                >
                  <HiLogin className="text-sm" />
                  Sign In
                </NavLink>

                <div className="h-4 w-[1px] bg-accent" />

                <NavLink
                  to="/auth/register"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 font-black uppercase tracking-widest text-[10px] transition-all hover:text-primary ${
                      isActive ? "text-primary" : "text-text/60"
                    }`
                  }
                >
                  <HiUserAdd className="text-sm" />
                  Join Now
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>

      <Navbar />

      {/* Main Content Area */}
      {/* Changed container to max-w-[1600px] to match your new 3-column menu */}
      <main className="flex-grow w-full max-w-[1600px] mx-auto">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default MainLayout
