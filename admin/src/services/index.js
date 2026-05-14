import API from "../api/axios"

// Category Services
export const getCategories = async () => {
  const res = await API.get("category", { params: { limit: 50 } })
  return res.data?.data || []
}

// Menu Services
export const getMenuItems = async ({ page, search, category }) => {
  const res = await API.get("/menu", {
    params: {
      page,
      search,
      category: category !== "all" ? category : undefined,
    },
  })
  return res.data
}

export const toggleMenuAvailability = async (id) => {
  return API.patch(`menu/${id}/available`)
}

export const upsertMenuItem = async (payload, mode) => {
  return mode === "add"
    ? API.post("/menu", payload)
    : API.put(`/menu/${payload._id}`, payload)
}

// --- Category Services ---
export const getAllCategories = async ({ page, search, status }) => {
  const res = await API.get("/category", {
    params: {
      page,
      search,
      status: status !== "all" ? status : undefined,
    },
  })
  console.log("res", res)
  return res.data
}

export const upsertCategory = async (payload, mode) => {
  return mode === "add"
    ? API.post("category", payload)
    : API.put(`category/${payload._id}`, payload)
}

export const deleteCategory = async (id) => {
  return API.delete(`/category/${id}`)
}

export const toggleCategoryStatus = async (id) => {
  return API.patch(`category/${id}/status`)
}

// admin dashboard query
export const getAdminDashboardStats = async () => {
  const res = await API.get("/order/admin/dashboard")
  return res.data
}

// --- Staff Services ---

export const getStaffMembers = async ({ search, page, role }) => {
  const res = await API.get("/auth/staff", {
    params: {
      search: search || "",
      page: page || 1,
      role: role || undefined, // Add role filter to API call if supported
    },
  })
  return res.data
}

export const createStaffMember = async (payload) => {
  const res = await API.post("/auth/staff/add", payload)
  return res.data
}

// --- Table/Floor Services ---

export const getTables = async () => {
  const res = await API.get("/tables")
  return res.data
}

export const createTable = async (payload) => {
  const res = await API.post("/tables", payload)
  return res.data
}

export const updateTableBulk = async (tables) => {
  const res = await API.post("/tables/bulk-update", { tables })
  return res.data
}

// --- Delivery Services ---

export const getDeliveryDashboard = async () => {
  const { data } = await API.get("/delivery")
  return data.data // Returning data.data directly for convenience
}

export const assignDriver = async ({ orderId, driverId }) => {
  const { data } = await API.patch("/delivery/assign", { orderId, driverId })
  return data
}
// kitchen management
export const getKitchenLiveStatus = async () => {
  const res = await API.get("/kitchen/live")
  return res?.data?.data
}
// update online order status
export const updateOnlineOrderStatus = async ({ orderId, newStatus }) => {
  return API.patch(`order/${orderId}/status`, { newStatus })
}
// update dinning order status
export const updateDinningOrderStatus = async ({
  subOrderId,
  itemIds,
  newStatus,
}) => {
  return API.patch(`/subOrder/${subOrderId}/items/status`, {
    itemIds,
    newStatus,
  })
}
export const getWaiterLiveStatus = async () => {
  const res = await API.get("/kitchen/live")
  console.log("suborders", res?.data?.data?.subOrders)
  return res?.data?.data?.subOrders
}
// live table status
export const getLiveTableStatus = async () => {
  const res = await API.get("/tables/live")
  return res?.data
}
export const startTableSession = async (table_id) => {
  const res = await API.post("/tableSession/start", { table_id })
  return res?.data
}
export const endTableSession = async (table_id) => {
  console.log("from api index page", table_id)
  const res = await API.patch("/tableSession/end", { table_id })
  console.log("end session response from service page", res)
  return res?.data
}

export const getSessionSubOrders = async (sessionId) => {
  const res = await API.get(`subOrder/session/${sessionId}`)
  console.log("suborders", res?.data)
  return res?.data?.subOrders
}

export const getUnsettledDinningOrders = async () => {
  const res = await API.get("/order/dinning/unsettled-orders")
  return res.data
}

// api/orderService.js
export const settleDiningOrder = async ({ orderId, method }) => {
  const res = await API.post(`order/settle-dining`, {
    id: orderId,
    paymentMethod: method,
  })
  return res.data
}

export const assignDriverToOrder = async ({ orderId, driverId }) => {
  const res = await API.post(`delivery/assign`, {
    orderId,
    driverId,
  })
  return res.data
}

// api/deliveryService.js
export const getMyDeliveries = async () => {
  const res = await API.get(`delivery/my-orders`)
  return res?.data?.data || []
}

export const completeDelivery = async (orderId) => {
  const res = await API.patch(`delivery/complete`, { orderId })
  return res.data
}

export const getUnsettledTakeawayOrders = async () => {
  const res = await API.get(`/order/takeaway/unsettled`)
  return res?.data
}

export const pickupTakeawayOrder = async ({ orderId, paymentMethod }) => {
  const res = await API.post(`/order/takeaway/pickup/${orderId}`, {
    paymentMethod,
  })
  return res?.data
}
export const getOrderById = async (orderId) => {
  const response = await API.get(`/order/${orderId}`)
  return response?.data
}
