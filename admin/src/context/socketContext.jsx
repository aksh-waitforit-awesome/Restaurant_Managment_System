import { createContext, useContext, useState, useEffect, useRef } from "react"
import useAuthStore from "../store/useAuthStore"
import { Query, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { QUERY_KEYS } from "../react-query/queryKeys"
// 1. Initialized with null for better type safety/checks
const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const socketRef = useRef(null)
  const [status, setStatus] = useState("disconnected")
  const queryClient = useQueryClient()
  const accessToken = useAuthStore((state) => state.accessToken)

  useEffect(() => {
    console.log("Socket Effect Triggered. Token exists:", !!accessToken)
    // Prevent connection attempt if no token exists
    if (!accessToken) {
      if (socketRef.current) {
        socketRef.current.close()
      }
      setStatus("disconnected")
      return
    }
    console.log("Attempting Connection to: ws://localhost:3000/ws")

    const socket = new WebSocket(
      import.meta.env.VITE_NODE_ENV === "production"
        ? import.meta.env.VITE_SOCKET_URL
        : "ws://localhost:3000/ws",
    )
    socketRef.current = socket
    setStatus("connecting")

    socket.onopen = () => {
      // Send auth token immediately upon connection
      socket.send(JSON.stringify({ type: "AUTH", token: accessToken }))
    }

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === "AUTH_SUCCESS") {
          setStatus("authenticated")
          toast.success("Real-time connection active")
        }

        if (data.type === "AUTH_ERROR") {
          toast.error("Session invalid")
          socket.close()
        }

        if (data.type === "SESSION_CREATED") {
          toast.success(data.message)

          console.log("🛠️ Patching Cache for Table:", data.tableId)

          queryClient.setQueryData([QUERY_KEYS.TABLE_LIVE], (oldData) => {
            // Safety check: if no data exists yet, let the first fetch handle it
            if (!oldData || !oldData.data) {
              console.warn("⚠️ Cache empty, ignoring manual update.")
              return oldData
            }

            return {
              ...oldData,
              data: oldData.data.map((table) => {
                if (table._id === data.tableId) {
                  console.log(
                    `✅ Table ${table.tableNumber} status updated to Occupied.`,
                  )
                  return {
                    ...table,
                    isOccupied: true,
                    currentSession: data.newSession,
                  }
                }
                return table
              }),
            }
          })
        }
        if (data.type === "EMPTY_SESSION_DELETE") {
          const { tableNumber } = data.payload
          toast.success(
            `empty table session of table no ${tableNumber} is deleted`,
          )
          queryClient.invalidateQueries(
            QUERY_KEYS.TABLE_LIVE,
            QUERY_KEYS.WAITER_LIVE,
          )
        }
        if (data.type === "SESSION_COMPLETED") {
          toast.success(data.message)

          // ACTION 1: Waiter's Floor Plan (Make table available)
          queryClient.setQueryData([QUERY_KEYS.TABLE_LIVE], (old) => {
            if (!old?.data) return old
            return {
              ...old,
              data: old.data.map((t) =>
                t._id === data.tableId
                  ? { ...t, isOccupied: false, currentSession: null }
                  : t,
              ),
            }
          })

          // ACTION 2: Cashier's List (Add new unsettled order)
          queryClient.setQueryData([QUERY_KEYS.UNSETTLED_ORDERS], (old) => {
            const currentOrders = Array.isArray(old) ? old : []
            // Put new bill at the top
            return [data.newUnsettledOrder, ...currentOrders]
          })
        }
        if (data.type == "NEW_ONLINE_ORDER_PLACED") {
          toast.success(`new order is placed ${data.orderId}`)
          queryClient.invalidateQueries([QUERY_KEYS.KTICHEN_LIVE])
        }
        if (data.type == "KITCHEN_TICKET") {
          toast.success(data.message)
          queryClient.setQueryData([QUERY_KEYS.KTICHEN_LIVE], (old) => {
            if (!old) return old
            const subOrders = [data.payload, ...old.subOrders]
            return {
              ...old,
              subOrders: subOrders,
            }
          })
          queryClient.setQueryData([QUERY_KEYS.WAITER_LIVE], (old) => {
            if (!old) return old
            return [data.payload, ...old] // Prepend new ticket to the list
          })
        }
        if (data.type === "SUBORDER_STATUS_UPDATED") {
          const { subOrderId, subOrder } = data.payload
          toast.success(data.message)

          // --- UPDATE WAITER VIEW ---
          // Key: [QUERY_KEYS.WAITER_LIVE] -> Data: Array of SubOrders
          queryClient.setQueryData([QUERY_KEYS.WAITER_LIVE], (oldData) => {
            if (!oldData) return oldData
            // Map through the array and replace the updated sub-order
            return oldData.map((so) => (so._id === subOrderId ? subOrder : so))
          })

          // --- UPDATE KITCHEN VIEW ---
          // Key: [QUERY_KEYS.KTICHEN_LIVE] -> Data: { subOrders: [], orders: [] }
          queryClient.setQueryData([QUERY_KEYS.KTICHEN_LIVE], (oldData) => {
            if (!oldData || !oldData.subOrders) return oldData
            return {
              ...oldData,
              subOrders: oldData.subOrders.map((so) =>
                so._id === subOrderId ? subOrder : so,
              ),
            }
          })
        }
        if (data.type == "DEMO_DATA_CLEANUP") {
          toast.success(`${data.payload.userId}:${data.message}`)
          queryClient.invalidateQueries([
            QUERY_KEYS.ADMIN_DASHBOARD,
            QUERY_KEYS.KTICHEN_LIVE,
            QUERY_KEYS.TABLE_LIVE,
            QUERY_KEYS.WAITER_LIVE,
            QUERY_KEYS.SESSION_SUBORDERS,
            QUERY_KEYS.UNSETTLED_ORDERS,
          ])
        }
        console.log("WS Message:", data)
      } catch (err) {
        console.error("Failed to parse WS message", err)
      }
    }

    socket.onerror = (error) => {
      console.error("WS Error:", error)
      setStatus("error")
    }

    socket.onclose = () => {
      socketRef.current = null
      setStatus("disconnected")
    }

    // Cleanup: Close socket when component unmounts or token changes
    return () => {
      if (
        socket.readyState === WebSocket.OPEN ||
        socket.readyState == WebSocket.CONNECTING
      ) {
        // 0 (CONNECTING) or 1 (OPEN)
        socket.close()
        socketRef.current = null
        setStatus("disconnectedd")
      }
    }
  }, [accessToken]) // 2. Added accessToken to dependency array

  return (
    // 3. Pass the ref.current or the socket object to the provider
    <SocketContext.Provider value={{ status, socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider")
  }
  return context
}
