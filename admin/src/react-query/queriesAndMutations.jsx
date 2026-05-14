import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "./queryKeys"

import {
  deleteCategory,
  getCategories,
  getAllCategories,
  getMenuItems,
  toggleCategoryStatus,
  toggleMenuAvailability,
  upsertCategory,
  upsertMenuItem,
  getAdminDashboardStats,
  getStaffMembers,
  createStaffMember,
  getTables,
  createTable,
  updateTableBulk,
  getDeliveryDashboard,
  assignDriver,
  getKitchenLiveStatus,
  updateOnlineOrderStatus,
  updateDinningOrderStatus,
  getWaiterLiveStatus,
  getLiveTableStatus,
  startTableSession,
  endTableSession,
  getSessionSubOrders,
  getUnsettledDinningOrders,
  settleDiningOrder,
  assignDriverToOrder,
  getMyDeliveries,
  completeDelivery,
  getUnsettledTakeawayOrders,
  pickupTakeawayOrder,
  getOrderById,
} from "../services/index"
import useWaiterStore from "../store/useWaiterStore"
import { generateBillPDF } from "../utils/generateBillPDF"
import { toast } from "react-hot-toast"

// --- QUERIES ---

export const useGetCategories = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: getCategories,
  })
}

export const useGetMenu = (params) => {
  return useQuery({
    queryKey: [QUERY_KEYS.MENU, params.page, params.search, params.category],
    queryFn: () => getMenuItems(params),
    keepPreviousData: true,
  })
}
// --- CATEGORY QUERIES ---
export const useGetAllCategories = (params) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.CATEGORIES,
      params?.page,
      params?.search,
      params?.status,
    ],
    queryFn: () => getAllCategories(params),
    keepPreviousData: true,
  })
}

// --- MUTATIONS ---

export const useToggleMenuStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: toggleMenuAvailability,
    onSuccess: () => queryClient.invalidateQueries([QUERY_KEYS.MENU]),
  })
}

export const useUpsertMenu = (mode, onSuccessCallback) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => upsertMenuItem(payload, mode),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.MENU])
      if (onSuccessCallback) onSuccessCallback()
    },
  })
}
export const useUpsertCategory = (mode, onSuccessCallback) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => upsertCategory(payload, mode),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.CATEGORIES])
      queryClient.invalidateQueries(QUERY_KEYS.MENU)
      if (onSuccessCallback) onSuccessCallback()
    },
  })
}
export const useDeleteCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.CATEGORIES])
    },
  })
}
export const useToggleCategoryStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: toggleCategoryStatus,
    onSuccess: () => queryClient.invalidateQueries([QUERY_KEYS.CATEGORIES]),
  })
}

export const useGetAdminDashboard = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_DASHBOARD],
    queryFn: getAdminDashboardStats,
    refetchInterval: 30000, // Optional: Auto-refresh stats every 30 seconds
  })
}

// --- STAFF QUERIES ---

export const useGetStaff = (params) => {
  return useQuery({
    queryKey: [QUERY_KEYS.STAFF, params.search, params.page, params.role],
    queryFn: () => getStaffMembers(params),
    keepPreviousData: true,
  })
}

// --- STAFF MUTATIONS ---

export const useAddStaff = (onSuccessCallback) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createStaffMember,
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.STAFF])
      if (onSuccessCallback) onSuccessCallback()
    },
    onError: (err) => {
      console.error("Failed to add staff:", err)
    },
  })
}

// --- TABLE QUERIES ---

export const useGetTables = () => {
  return useQuery({
    queryKey: ["tables"],
    queryFn: getTables,
  })
}

// --- TABLE MUTATIONS ---

export const useCreateTable = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTable,
    onSuccess: () => {
      queryClient.invalidateQueries(["tables"])
    },
  })
}

export const useUpdateTableBulk = (onSuccessCallback) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateTableBulk,
    onSuccess: () => {
      queryClient.invalidateQueries(["tables"])
      if (onSuccessCallback) onSuccessCallback()
    },
  })
}

// --- DELIVERY QUERIES ---

export const useGetDeliveryDashboard = () => {
  return useQuery({
    queryKey: ["delivery-dashboard"],
    queryFn: getDeliveryDashboard,
    refetchInterval: 15000, // Auto-refresh every 15 seconds for live logistics
  })
}

// --- DELIVERY MUTATIONS ---

export const useAssignDriver = (onSuccessCallback) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: assignDriver,
    onSuccess: () => {
      queryClient.invalidateQueries(["delivery-dashboard"])
      if (onSuccessCallback) onSuccessCallback()
    },
  })
}

// KITCHEN
export const useGetKitchenLiveStatus = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.KTICHEN_LIVE],
    queryFn: getKitchenLiveStatus,
  })
}

export const useUpdateOnlineOrderStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, newStatus }) =>
      updateOnlineOrderStatus({ orderId, newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.KTICHEN_LIVE])
    },
  })
}
export const useUpdateDinningOrderStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ subOrderId, itemIds, newStatus }) =>
      updateDinningOrderStatus({ subOrderId, itemIds, newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries([
        QUERY_KEYS.KTICHEN_LIVE,
        QUERY_KEYS.WAITER_LIVE,
      ])
    },
  })
}

// Waiter
export const useGetWaiterLiveStatus = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.WAITER_LIVE],
    queryFn: getWaiterLiveStatus,
  })
}
// live table status
export const useGetLiveTableStatus = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.TABLE_LIVE],
    queryFn: getLiveTableStatus,
  })
}

export const useStartTableSession = () => {
  const queryClient = useQueryClient()
  const { closeModal } = useWaiterStore()
  return useMutation({
    mutationFn: (table_id) => startTableSession(table_id),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.TABLE_LIVE])
      closeModal()
    },
  })
}

export const useEndTableSession = () => {
  const queryClient = useQueryClient()
  const { closeModal } = useWaiterStore()
  return useMutation({
    mutationFn: (table_id) => endTableSession(table_id),
    onSuccess: (data) => {
      queryClient.invalidateQueries([QUERY_KEYS.TABLE_LIVE])
      try {
        if (data?.printData) {
          generateBillPDF(data.printData)
        } else {
          toast.error("Failed to generate bill PDF. Please try again.")
        }
      } catch (pdfError) {
        console.log("PDF generation failed:", pdfError)
        toast.error("Failed to generate bill PDF. Please try again.")
        console.error("PDF Generation Error:", pdfError)
      } finally {
        closeModal()
      }
    },
    onError: (err) => {
      console.log(err)
      toast.error(
        err?.response?.data?.message || err.message || "failed to end session",
      )
      closeModal()
    },
  })
}

export const useGetSessionSubOrders = (sessionId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SESSION_SUBORDERS, sessionId],
    queryFn: () => getSessionSubOrders(sessionId),
    enabled: !!sessionId, // Only run this query if sessionId is available
  })
}
export const useGetUnsettledDinningOrders = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.UNSETTLED_ORDERS],
    queryFn: getUnsettledDinningOrders,
  })
}

export const useSettleOrder = (setActiveOrderId) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables) => {
      // Set the active UI state before the request starts
      setActiveOrderId(variables.orderId)
      return settleDiningOrder(variables)
    },
    onSuccess: (data) => {
      if (data.url) {
        // Redirect for Stripe/Online payments
        window.location.href = data.url
      } else {
        // Refresh orders for Cash payments
        queryClient.invalidateQueries(["unsettled_orders"])
        setActiveOrderId(null)
      }
    },
    onError: (error) => {
      const message = error.response?.data?.error || "Settlement failed"
      alert(message)
      setActiveOrderId(null)
    },
  })
}

// Hook to fetch active tasks
export const useGetMyDeliveries = () => {
  return useQuery({
    queryKey: ["my_deliveries"],
    queryFn: getMyDeliveries,
  })
}

// Hook to mark as delivered
export const useCompleteDelivery = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: completeDelivery,
    onSuccess: () => {
      // Invalidate the list to remove the completed order
      queryClient.invalidateQueries({ queryKey: ["my_deliveries"] })
      alert("Delivery marked as completed!")
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to complete order")
    },
  })
}

export const useTakeawayOrders = () => {
  return useQuery({
    queryKey: ["takeaway-orders"],
    queryFn: getUnsettledTakeawayOrders,
    refetchInterval: 10000, // Auto-refresh every 10 seconds
  })
}

export const usePickupMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: pickupTakeawayOrder,
    onSuccess: (data) => {
      if (data.url) {
        // If it's a Stripe session, redirect the user
        window.location.href = data.url
      } else {
        toast.success(data.message || "Order Completed!")
        queryClient.invalidateQueries(["takeaway-orders"])
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to process pickup")
    },
  })
}
export const useGetOrderById = (orderId) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId, // Only fetch if orderId is provided
  })
}
