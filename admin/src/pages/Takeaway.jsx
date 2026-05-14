import React from "react"
import {
  useTakeawayOrders,
  usePickupMutation,
} from "../react-query/queriesAndMutations"

const TakeawayPage = () => {
  const { data, isLoading, isError } = useTakeawayOrders()
  const pickupMutation = usePickupMutation()

  if (isLoading)
    return <div className="p-10 text-center">Loading Orders...</div>
  if (isError)
    return (
      <div className="p-10 text-center text-red-500">Error loading orders.</div>
    )

  const handlePickup = (orderId, status, currentMethod) => {
    if (status === "paid") {
      pickupMutation.mutate({ orderId, paymentMethod: currentMethod })
    } else {
      pickupMutation.mutate({ orderId, paymentMethod: currentMethod })
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Takeaway Pickup Dashboard</h1>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {data?.takeawayOrders?.map((order) => (
          <div
            key={order._id}
            className="bg-white p-4 rounded-lg shadow border border-gray-200"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-bold text-lg">Order #{order.orderNumber}</p>
                <p className="text-sm text-gray-500">
                  {order.customer?.name || "Guest"}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                  order.paymentStatus === "paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>

            <div className="border-t border-b py-2 my-2 text-sm">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-4">
              <p className="font-bold text-xl text-blue-600">
                ₹{order.totalAmount}
              </p>
              {order.paymentStatus == "paid" && (
                <button
                  onClick={() =>
                    handlePickup(order._id, order.paymentStatus, "card")
                  }
                  className="bg-green-500 text-xl text-white p-2 rounded-md"
                >
                  Confirm pickup
                </button>
              )}
              {order.paymentStatus !== "paid" && (
                <div className="flex gap-4">
                  <button
                    onClick={() =>
                      handlePickup(order._id, order.paymentStatus, "cod")
                    }
                    className="bg-green-500 text-xl text-white p-2 rounded-md min-w-24"
                  >
                    Cash
                  </button>
                  <button
                    onClick={() =>
                      handlePickup(order._id, order.paymentStatus, "card")
                    }
                    className="bg-indigo-500 text-xl text-white p-2 rounded-md min-w-24"
                  >
                    Card
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {data?.takeawayOrders?.length === 0 && (
        <p className="text-center text-gray-400 mt-20">
          No pending takeaway orders found.
        </p>
      )}
    </div>
  )
}

export default TakeawayPage
