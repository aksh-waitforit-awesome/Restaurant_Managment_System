import React, { useState } from "react"
import {
  useGetDeliveryDashboard,
  useAssignDriver,
} from "../react-query/queriesAndMutations"

const DeliveryDashboard = () => {
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [driverId, setDriverId] = useState("")

  // --- REFACTORED HOOKS ---
  const { data, isLoading } = useGetDeliveryDashboard()

  const { mutate: assign, isPending: isAssigning } = useAssignDriver(() => {
    setSelectedOrder(null)
    setDriverId("")
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center animate-pulse">
          <div className="text-2xl font-black text-gray-400 uppercase">
            Loading Fleet Data...
          </div>
        </div>
      </div>
    )
  }

  // Fallback values to prevent crashes
  const pending = data?.pendingDeliveries || []
  const ongoing = data?.ongoingDeliveries || []
  const drivers = data?.availableDrivers || []

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-3xl font-black text-gray-800 mb-8 uppercase tracking-tight">
        Delivery Command Center
      </h1>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard label="Pending" count={pending.length} color="bg-blue-600" />
        <StatCard
          label="In Transit"
          count={ongoing.length}
          color="bg-orange-500"
        />
        <StatCard
          label="Idle Fleet"
          count={drivers.length}
          color="bg-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Column */}
        <Column title="Needs Driver">
          {pending.map((o) => (
            <div
              key={o._id}
              className="bg-white p-5 rounded-xl shadow-sm border-l-8 border-blue-600 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between font-bold text-lg italic">
                <span>#{o.orderNumber}</span>
                <span>₹{o.totalAmount}</span>
              </div>
              <p className="text-gray-600 font-medium mt-1">
                {o.customer?.name}
              </p>
              <button
                onClick={() => setSelectedOrder(o)}
                className="mt-4 w-full bg-gray-900 text-white py-2.5 rounded-lg text-xs font-black tracking-widest hover:bg-blue-700 transition-all"
              >
                OPEN ASSIGNMENT FORM
              </button>
            </div>
          ))}
        </Column>

        {/* Ongoing Column */}
        <Column title="On the Road">
          {ongoing.map((o) => (
            <div
              key={o._id}
              className="bg-white p-5 rounded-xl shadow-sm border-l-8 border-orange-500"
            >
              <span className="font-bold text-lg">#{o.orderNumber}</span>
              <p className="text-sm text-gray-500">{o.customer?.name}</p>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-50 p-2 rounded">
                🚚 DRIVER: {o.deliveryGuy?.username}
              </div>
            </div>
          ))}
        </Column>

        {/* Driver Column */}
        <Column title="Available Drivers">
          {drivers.map((d) => (
            <div
              key={d._id}
              className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between border-l-8 border-emerald-500"
            >
              <span className="font-bold text-gray-700">{d.username}</span>
              <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
            </div>
          ))}
        </Column>
      </div>

      {/* --- ASSIGNMENT MODAL --- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-black text-gray-800 mb-1">
              Assign Driver
            </h2>
            <p className="text-gray-500 text-sm mb-6 underline">
              Order #{selectedOrder.orderNumber} •{" "}
              {selectedOrder.customer?.name}
            </p>

            <select
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl p-4 mb-8 focus:border-blue-500 outline-none font-bold transition-colors cursor-pointer"
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
            >
              <option value="">Select a Driver...</option>
              {drivers.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.username}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedOrder(null)}
                className="py-4 font-bold text-gray-400 hover:text-gray-800 transition-colors"
              >
                CANCEL
              </button>
              <button
                disabled={!driverId || isAssigning}
                onClick={() => assign({ orderId: selectedOrder._id, driverId })}
                className="bg-blue-600 text-white rounded-xl font-black py-4 disabled:bg-gray-200 disabled:text-gray-400 shadow-lg shadow-blue-200 transition-all"
              >
                {isAssigning ? "ASSIGNING..." : "CONFIRM"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Internal Components (Keep these clean)
const StatCard = ({ label, count, color }) => (
  <div
    className={`${color} p-6 rounded-2xl text-white shadow-lg transform hover:scale-[1.02] transition-transform`}
  >
    <p className="text-xs font-black uppercase tracking-widest opacity-70 mb-1">
      {label}
    </p>
    <p className="text-4xl font-black">{count}</p>
  </div>
)

const Column = ({ title, children }) => (
  <div className="bg-gray-200/40 p-6 rounded-3xl min-h-[600px] border border-gray-200/50">
    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 pl-2">
      {title}
    </h3>
    <div className="space-y-4">
      {children.length > 0 ? (
        children
      ) : (
        <p className="text-center text-gray-400 py-10 italic text-sm">
          Clear for now
        </p>
      )}
    </div>
  </div>
)

export default DeliveryDashboard
