import { useEffect, useState } from "react"
import { Route, Routes } from "react-router-dom"
import Unauthorized from "./pages/Unauthorized"
import Login from "./pages/Login"
import AuthenticateRoute from "./components/AuthenticateRoute"
import ProtectedRoute from "./components/ProtectedRoute"
import MainLayout from "./components/MainLayout"
import useAuthStore from "./store/useAuthStore"
import Category from "./pages/Category"

import Menu from "./pages/Menu"
import Staff from "./pages/Staff"
import KitchenDashboard from "./pages/KitchenDashboard"
import Delivery from "./pages/Delivery"
import MyDeliveries from "./pages/MyDeliveries"
import SessionOverview from "./pages/SessionOverview"
import Floor from "./pages/Floor"
import Home from "./pages/Home"
import POS from "./pages/POS"
import WaiterDispatch from "./pages/WaiterDispatch"
import OrderDetail from "./pages/OrderDetail"
import { SocketProvider } from "./context/socketContext"
import { Toaster } from "react-hot-toast"
import TakeawayPage from "./pages/Takeaway"
import CashierDashboard from "./pages/CashierDashboard"
function App() {
  const { refreshSession, isAuthenticated, logout } = useAuthStore()
  const [isChecking, setIsChecking] = useState(true)
  const [error, setError] = useState(null)

  const initializeAuth = async () => {
    setIsChecking(true)
    setError(null)

    if (isAuthenticated) {
      try {
        await refreshSession()
      } catch (err) {
        // If it's a 401, the interceptor likely handled logout,
        // but if it's a network error (500/Connection), we catch it here.
        console.error("Session refresh failed:", err)
        setError(
          "Unable to connect to the server. Please check your connection.",
        )
      }
    }
    setIsChecking(false)
  }

  useEffect(() => {
    initializeAuth()
  }, [])

  // 1. Loading State
  if (isChecking) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <span className="ml-3 mt-4 text-gray-600 font-medium tracking-wide">
          Restoring Session...
        </span>
      </div>
    )
  }

  // 2. Error State (Server Down / Network Issue)
  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
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
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Connection Error
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={initializeAuth}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                logout()
                setError(null)
              }}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Authenticated Wrapper: Everyone logged in sees the Sidebar/Layout */}
        <Route
          element={
            <AuthenticateRoute>
              <SocketProvider>
                <MainLayout />
              </SocketProvider>
            </AuthenticateRoute>
          }
        >
          {/* Common Routes: Accessible by all staff except customers */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={[
                  "admin","demo_admin",
                  "manager",
                  "waiter",
                  "receptionist",
                  "cashier",
                  "delivery_guy",
                  "cashier",
                  "chef",
                ]}
              />
            }
          >
            <Route path="/" element={<Home />} />
          </Route>

          {/* Admin & Manager Only: Management features */}
          <Route
            element={<ProtectedRoute allowedRoles={["admin","demo_admin", "manager"]} />}
          >
            <Route path="/staff" element={<Staff />} />
            <Route path="/category" element={<Category />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/floor" element={<Floor />} />
            <Route path="/delivery" element={<Delivery />} />
          </Route>

          {/* Waiters Operations */}
          <Route element={<ProtectedRoute allowedRoles={["waiter"]} />}>
            <Route path="/session/:sessionId" element={<SessionOverview />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/waiter/dispatch" element={<WaiterDispatch />} />
          </Route>
          {/* Delivery Only: Specific to Delivery personnel */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["delivery_guy", "admin","demo_admin"]} />
            }
          >
            <Route path="/mydeliveries" element={<MyDeliveries />} />
          </Route>
          <Route
            element={
              <ProtectedRoute allowedRoles={["cashier", "admin","demo_admin", "manager"]} />
            }
          >
            <Route path="/order/:id" element={<OrderDetail />} />
          </Route>
          <Route
            element={
              <ProtectedRoute allowedRoles={["admin","demo_admin", "cashier", "manager"]} />
            }
          >
            <Route path="/takeaway" element={<TakeawayPage />} />
          </Route>
          <Route
            element={
              <ProtectedRoute allowedRoles={["admin","demo_admin", "cashier", "manager"]} />
            }
          >
            <Route
              path="/unsettled-dinning-orders"
              element={<CashierDashboard />}
            />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
