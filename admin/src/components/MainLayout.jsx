import { useState } from "react"
import { Outlet, NavLink, useNavigate } from "react-router-dom"
import useAuthStore from "../store/useAuthStore"
import { navItems } from "../nav"
import { HiMenuAlt1, HiX, HiLogout, HiUserCircle } from "react-icons/hi"

const MainLayout = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  // Default to false so sidebar is hidden on load
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  const allowedNavItems = navItems.filter((item) =>
    item.roles.includes(user?.role),
  )

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* --- SIDEBAR OVERLAY --- */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- SLIDE-OUT SIDEBAR --- */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out transform
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xl text-blue-200 font-black tracking-tight">
            Curry <span className="text-blue-400">Chapter</span>
          </span>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400"
          >
            <HiX size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {allowedNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)} // Close on click
              className={({ isActive }) =>
                `flex items-center gap-4 p-3.5 rounded-xl font-bold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                    : "hover:bg-slate-800 text-slate-400 hover:text-white"
                }`
              }
            >
              <div className="w-2 h-2 rounded-full bg-current opacity-40" />
              <span className="uppercase text-xs tracking-widest">
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer User Info */}
        <div className="p-6 bg-slate-950/50 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-white uppercase">
                {user?.username}
              </p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                {user?.role?.replace("_", " ")}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* --- REFINED HEADER --- */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 z-30">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-3 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-2xl text-gray-500 transition-all active:scale-95"
            >
              <HiMenuAlt1 size={26} />
            </button>
            <div>
              <h1 className="text-xl font-black text-gray-900 uppercase tracking-tighter">
                Management <span className="text-blue-600">Portal</span>
              </h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">
                Curry Chapter Admin v2.0
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop User Info */}
            <div className="hidden sm:flex flex-col items-end border-r border-gray-100 pr-4 mr-2">
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                Active Session
              </span>
              <span className="text-sm font-bold text-gray-700 capitalize">
                {user?.username} ({user?.role?.replace("_", " ")})
              </span>
            </div>

            {/* HEADER LOGOUT BUTTON */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all border border-red-100 hover:border-red-500 shadow-sm active:scale-95"
            >
              <HiLogout size={18} />
              <span className="hidden lg:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* --- PAGE CONTENT --- */}
        <div className="flex-1 overflow-auto bg-gray-50/50">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default MainLayout
