import { Navigate, useLocation } from "react-router-dom"
import useAuthStore from "../store/useAuthStore"

const AuthenticateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()

  // 1. If not logged in, send to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 3. Authorized
  return children
}
export default AuthenticateRoute
