import API from "../api/axios"
export async function getMyOrders() {
  const res = await API.get("order/customer/orders")
  return res?.data
}
export async function getOrderById( id ) {
  const res = await API.get(`/order/${id}`)
  return res.data
}

export const getMenu = async () => {
  const res = await API.get("menu", { params: { limit: 20 } })
  return res?.data?.data
}

export const getCategories = async () => {
  const res = await API.get("category", { params: { limit: 20 } })
  return res?.data?.data
}
