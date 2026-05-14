import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import API from "../api/axios"
import {
  useGetKitchenLiveStatus,
  useUpdateDinningOrderStatus,
  useUpdateOnlineOrderStatus,
} from "../react-query/queriesAndMutations"

// Status Color Mapping Helper
const getStatusStyles = (status) => {
  switch (status) {
    case "placed":
      return {
        cardBorder: "border-l-amber-500",
        bg: "bg-amber-50",
        text: "text-amber-700",
        button: "bg-amber-600 hover:bg-amber-500",
        badge: "bg-amber-100 text-amber-600",
      }
    case "preparing":
      return {
        cardBorder: "border-l-blue-500",
        bg: "bg-blue-50",
        text: "text-blue-700",
        button: "bg-blue-600 hover:bg-blue-500",
        badge: "bg-blue-100 text-blue-600",
      }
    case "ready_to_serve":
    case "ready":
      return {
        cardBorder: "border-l-green-500",
        bg: "bg-green-50",
        text: "text-green-700",
        button: "bg-green-600 hover:bg-green-500",
        badge: "bg-green-100 text-green-600",
      }
    default:
      return {
        cardBorder: "border-l-gray-300",
        bg: "bg-gray-50",
        text: "text-gray-500",
        button: "bg-gray-400",
        badge: "bg-gray-100 text-gray-400",
      }
  }
}

function KitchenDashboard() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useGetKitchenLiveStatus()

  const { mutateAsync: updateDinningOrderStatus } =
    useUpdateDinningOrderStatus()
  const { mutateAsync: updateOnlineOrderStatus } = useUpdateOnlineOrderStatus()
  if (isLoading)
    return <div className="p-10 text-center font-sans">Syncing Kitchen...</div>

  const { subOrders = [], orders = [] } = data || {}

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <header className="mb-10 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
          KITCHEN LIVE <span className="text-blue-600">FEED</span>
        </h1>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase">
              Dining Orders
            </p>
            <p className="text-2xl font-black text-blue-600">
              {subOrders.length}
            </p>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase">
              Online Orders
            </p>
            <p className="text-2xl font-black text-indigo-600">
              {orders.length}
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* DINING SUB-ORDERS */}
        <section className="space-y-6">
          <h2 className="font-bold text-gray-500 uppercase tracking-widest text-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full" /> In-House Table
            Service
          </h2>
          {subOrders
            .filter((so) => !so.allServed)
            .map((so) => (
              <div
                key={so._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
                  <span className="text-xl font-black">
                    TABLE {so.tableNumber}
                  </span>
                  <span className="text-xs font-mono opacity-60">
                    {new Date(so.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  {so.items.map((item) => {
                    const style = getStatusStyles(item.itemStatus)
                    return (
                      <div
                        key={item._id}
                        className={`flex justify-between items-center p-4 rounded-xl border-l-4 transition-all ${style.cardBorder} ${style.bg}`}
                      >
                        <div>
                          <p className={`text-lg font-bold ${style.text}`}>
                            {item.quantity}x {item.name}
                          </p>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            {item.size} • {item.itemStatus.replace("_", " ")}
                          </span>
                        </div>
                        {item.itemStatus !== "ready_to_serve" && (
                          <button
                            onClick={() => {
                              const next =
                                item.itemStatus === "placed"
                                  ? "preparing"
                                  : "ready_to_serve"
                              updateDinningOrderStatus({
                                subOrderId: so._id,
                                itemIds: item._id,
                                newStatus: next,
                              })
                            }}
                            className={`px-5 py-2 rounded-lg font-black text-xs text-white shadow-sm transition-transform active:scale-95 ${style.button}`}
                          >
                            {item.itemStatus === "placed" ? "START" : "FINISH"}
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
        </section>

        {/* ONLINE ORDERS */}
        <section className="space-y-6">
          <h2 className="font-bold text-gray-500 uppercase tracking-widest text-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full" /> Delivery &
            Takeaway
          </h2>
          {orders.map((o) => {
            const style = getStatusStyles(o.orderStatus)
            return (
              <div
                key={o._id}
                className={`bg-white rounded-2xl shadow-sm border-l-8 overflow-hidden transition-all ${style.cardBorder}`}
              >
                <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-black text-slate-800">
                      #{o.orderNumber}
                    </h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                      {o.orderType} • {o.customer.name}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${style.badge}`}
                  >
                    {o.orderStatus}
                  </span>
                </div>
                <div className="p-4">
                  <ul className="space-y-2 mb-4">
                    {o.items.map((i) => (
                      <li
                        key={i._id}
                        className="text-sm font-bold text-slate-600 flex justify-between"
                      >
                        <span>
                          {i.quantity}x {i.name}
                        </span>
                        <span className="text-gray-300 font-normal">
                          {i.size}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-gray-400 truncate italic">
                    📍 {o.customer.address}
                  </p>
                </div>
                {o.orderStatus !== "ready" && (
                  <div className="p-4 border-t border-gray-50">
                    <button
                      onClick={() => {
                        updateOnlineOrderStatus({
                          orderId: o._id,
                          newStatus:
                            o.orderStatus === "placed" ? "preparing" : "ready",
                        })
                      }}
                      className="px-5 py-2 bg-indigo-500 text-white rounded-lg font-black text-xs shadow-sm transition-transform active:scale-95 hover:bg-indigo-600"
                    >
                      {o.orderStatus === "placed" ? "START PREP" : "MARK READY"}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </section>
      </div>
    </div>
  )
}

export default KitchenDashboard
