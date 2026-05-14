import { createContext, useContext, useEffect, useRef, useState } from "react"
import useAuthStore from "../store/useAuthStore"
import toast from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query"
const socketContext = createContext()

export function SocketProvider({ children }) {
  const socketRef = useRef(null)
  const [status, setStatus] = useState("disconnected")
  const queryClient = useQueryClient()
  // Pull the token from the store (reactive)
  const accessToken = useAuthStore((state) => state.accessToken)

  useEffect(() => {
    // 1. THE GUARD: If there's no token, don't even try to connect.
    // This also handles the case where a user logs out.
    if (!accessToken) {
      if (socketRef.current) {
        socketRef.current.close()
      }
      setStatus("disconnected")
      return
    }

    const socket = new WebSocket(
      import.meta.env.VITE_NODE_ENV === "production"
        ? import.meta.env.VITE_SOCKET_URL
        : "ws://localhost:3000/ws",
    )
    socketRef.current = socket
    setStatus("connecting")

    socket.onopen = () => {
      // Step 2: Send Auth immediately
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
        if (data.type === "ORDER_STATUS_UPDATED") {
          console.log(data)
          toast.success(data.payload.message)
          queryClient.invalidateQueries(["orders"])
        }
      } catch (err) {
        console.error("Message error:", err)
      }
    }

    socket.onclose = () => {
      socketRef.current = null
      setStatus("disconnected")
    }

    return () => {
      socket.close()
    }
  }, [accessToken]) // Re-runs when user logs in (token becomes valid) or logs out (token becomes null)

  return (
    <socketContext.Provider value={{ status, socket: socketRef.current }}>
      {children}
    </socketContext.Provider>
  )
}

export const useSocket = () => useContext(socketContext)
