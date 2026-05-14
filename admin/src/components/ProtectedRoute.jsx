import useAuthStore from "../store/useAuthStore"

import { Navigate, Outlet } from "react-router-dom"

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) return <Navigate to="/login" replace />

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  // Render 'children' if used as a wrapper, OR 'Outlet' if used as a Layout Route
  return children ? children : <Outlet />
}
export default ProtectedRoute
