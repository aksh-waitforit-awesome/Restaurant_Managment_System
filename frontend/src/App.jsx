import { Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"

// Layouts & Providers
import MainLayout from "./Layout/MainLayout"
import { ThemeProvider } from "./context/ThemeContext"

// Components
import LoadingScreen from "./components/LoadingScreen"
import ErrorScreen from "./components/ErrorScreen"

// Hooks & Store
import useAuthInitialization from "./hooks/useAuthInitialization"

// Pages
import {
  Home,
  Menu,
  Cart,
  Checkout,
  Login,
  Register,
  Orders,
  OrderSuccess,
  OrderDetail,
} from "./pages"
import { SocketProvider } from "./context/SocketContext"

function App() {
  const { isChecking, error, initializeAuth } = useAuthInitialization()

  if (isChecking) return <LoadingScreen />
  if (error) return <ErrorScreen error={error} retry={initializeAuth} />

  return (
    <ThemeProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Main Application Routes */}
        <Route
          element={
            <SocketProvider>
              <MainLayout />
            </SocketProvider>
          }
        >
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="customer-orders" element={<Orders />} />
          <Route path="order/:id" element={<OrderDetail />} />
          <Route path="order-success/:id" element={<OrderSuccess />} />
        </Route>

        {/* Auth Routes */}
        <Route path="auth">
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Miscellaneous */}

        <Route
          path="*"
          element={
            <div className="p-10 text-center text-2xl">404 Not Found</div>
          }
        />
      </Routes>
    </ThemeProvider>
  )
}

export default App
