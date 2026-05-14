import React from "react";
import { useGetMyDeliveries, useCompleteDelivery } from "../react-query/queriesAndMutations";

function MyDeliveries() {
  // --- DATA FETCHING ---
  const { 
    data: currentDelivery = [], 
    isLoading, 
    error: fetchError 
  } = useGetMyDeliveries();

  // --- MUTATION ---
  const { 
    mutate: markAsDelivered, 
    isPending: isCompleting,
    variables // This allows us to track which specific ID is being processed
  } = useCompleteDelivery();

  if (isLoading) return <div className="p-8 text-center font-medium">Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Your Active Tasks</h2>

      {fetchError && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
          {fetchError.response?.data?.message || "Failed to load deliveries"}
        </div>
      )}

      {currentDelivery.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed rounded-lg">
          <p className="text-gray-500">
            No active deliveries. You are currently available.
          </p>
        </div>
      ) : (
        currentDelivery.map((order) => {
          // Check if this specific order is the one being processed
          const isThisOrderCompleting = isCompleting && variables === order._id;

          return (
            <div key={order._id} className="border rounded-xl p-5 shadow-sm bg-white mb-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded uppercase">
                  {order.orderStatus.replace(/_/g, " ")}
                </span>
                <span className="font-mono text-gray-500">#{order.orderNumber}</span>
              </div>

              <div className="mb-4">
                <h4 className="font-bold text-lg">{order.customer.name}</h4>
                <p className="text-gray-600 text-sm">{order.customer.address}</p>
                <p className="text-blue-600 text-sm font-medium">{order.customer.phone}</p>
              </div>

              <div className="border-t pt-4 flex justify-between items-center">
                <div>
                  <p className="text-xl font-bold">₹{order.totalAmount}</p>
                  <p className="text-xs text-gray-400">
                    {order.paymentMethod} • {order.paymentStatus}
                  </p>
                </div>

                <button
                  onClick={() => markAsDelivered(order._id)}
                  disabled={isCompleting}
                  className={`px-6 py-2 rounded-lg font-bold text-white transition-all ${
                    isThisOrderCompleting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 active:scale-95 disabled:opacity-50"
                  }`}
                >
                  {isThisOrderCompleting ? "Processing..." : "Mark Delivered"}
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default MyDeliveries;