import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import API from "../api/axios"
import {
  useGetWaiterLiveStatus,
  useUpdateDinningOrderStatus,
} from "../react-query/queriesAndMutations"

function WaiterDispatch() {
  const queryClient = useQueryClient()

  // 1. Fetch orders that have items ready to be served
  const { data: subOrders, isLoading, isError } = useGetWaiterLiveStatus()
  const { mutateAsync: updateDinningOrderStatus } =
    useUpdateDinningOrderStatus()

  const handleServeItem = (subOrderId, itemId) => {
    updateDinningOrderStatus({
      subOrderId,
      itemIds: [itemId],
      newStatus: "served",
    })
  }

  const handleServeAllInOrder = (order) => {
    const readyItemIds = order.items
      .filter((i) => i.itemStatus === "ready_to_serve")
      .map((i) => i._id)

    if (readyItemIds.length > 0) {
      updateDinningOrderStatus({
        subOrderId: order._id,
        itemIds: readyItemIds,
        newStatus: "served",
      })
    }
  }

  if (isLoading)
    return (
      <div className="p-10 text-center text-gray-500">
        Waiting for kitchen updates...
      </div>
    )
  if (isError)
    return (
      <div className="p-10 text-center text-red-500">Connection Error.</div>
    )

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Waiter Dispatch</h1>
          <p className="text-slate-500">
            Pick up ready dishes from the counter
          </p>
        </div>
        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
          Live Sync Active
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subOrders
          ?.filter((order) => !order.allServed)
          .map((order) => {
            const readyCount = order.items.filter(
              (i) => i.itemStatus === "ready_to_serve",
            ).length

            return (
              <div
                key={order._id}
                className={`bg-white rounded-2xl shadow-sm border-2 ${readyCount > 0 ? "border-green-500" : "border-transparent"}`}
              >
                <div className="p-4 border-b flex justify-between items-center bg-slate-50 rounded-t-2xl">
                  <div>
                    <h2 className="font-bold text-slate-700 text-lg">
                      Table Session: {order.tableSession_id.slice(-5)}
                      <br />
                      Table Number: {order.tableNumber}
                    </h2>
                    <p className="text-xs text-slate-400 font-mono">
                      {order._id}
                    </p>
                  </div>
                  {readyCount > 0 && (
                    <button
                      onClick={() => handleServeAllInOrder(order)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition shadow-sm"
                    >
                      Serve All {readyCount}
                    </button>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className={`flex justify-between items-center p-4 rounded-xl border ${
                        item.itemStatus === "ready_to_serve"
                          ? "bg-green-50 border-green-200 ring-1 ring-green-100"
                          : "bg-gray-50 border-gray-100 opacity-60"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="text-xs bg-slate-200 px-2 py-0.5 rounded text-slate-600">
                            {item.size}
                          </span>
                        </div>
                        <p
                          className={`text-xs mt-1 font-bold ${item.itemStatus === "ready_to_serve" ? "text-green-600" : "text-slate-400"}`}
                        >
                          {item.itemStatus.replace(/_/g, " ").toUpperCase()}
                        </p>
                      </div>

                      {item.itemStatus === "ready_to_serve" && (
                        <button
                          onClick={() => handleServeItem(order._id, item._id)}
                          className="ml-4 p-2 bg-white border-2 border-green-500 text-green-600 rounded-full hover:bg-green-500 hover:text-white transition"
                          title="Mark as Served"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default WaiterDispatch
