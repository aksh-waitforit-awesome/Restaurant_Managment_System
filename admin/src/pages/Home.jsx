import React from "react"
import WaiterDashBoard from "./WaiterDashBoard"
import useAuthStore from "../store/useAuthStore"
import KitchenDashboard from "./KitchenDashboard"
import CashierDashboard from "./CashierDashboard"
import AdminDashboard from "./AdminDashboard"
import MyDeliveries from "./MyDeliveries"
function Home() {
  const user = useAuthStore((state) => state.user)
  if (user.role == "admin" || user.role == "demo_admin") {
    return <AdminDashboard />
  }
  if (user.role == "waiter") {
    return <WaiterDashBoard />
  }
  if (user.role == "chef") {
    return <KitchenDashboard />
  }
  if (user.role == "cashier") {
    return <CashierDashboard />
  }
  if (user.role == "delivery_guy") {
    return <MyDeliveries />
  }
  return <div>Home</div>
}

export default Home
