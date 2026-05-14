import React, { useState } from "react";
import {
  HiOutlineClock,
  HiCreditCard,
  HiCash,
  HiOutlineEmojiSad,
} from "react-icons/hi";
import {
  useGetUnsettledDinningOrders,
  useSettleOrder,
} from "../react-query/queriesAndMutations";

function CashierDashboard() {
  
  
  // State to track which specific card is being processed
  const [activeOrderId, setActiveOrderId] = useState(null);

  // 1. Fetching unsettled orders
  const { 
    data: unSettledOrders, 
    isPending: loadingUnSettledOrder 
  } = useGetUnsettledDinningOrders();

  // 2. Settlement mutation (Pass setActiveOrderId so the hook can clear it on success/error)
  const { 
    mutate: settleOrder, 
    isPending: isSettlingOrder 
  } = useSettleOrder(setActiveOrderId);

  // 3. Action Handler
  const handleSettle = (id, paymentMethod) => {
    setActiveOrderId(id); // Set local state for UI feedback
    settleOrder({ orderId: id, method: paymentMethod });
  };

  // --- LOADING STATE ---
  if (loadingUnSettledOrder) {
    return (
      <div className="p-10 text-center font-bold text-slate-500">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* --- HEADER --- */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">
            Bill Counter
          </h2>
          <p className="text-slate-500 font-medium">
            Dining Orders Awaiting Settlement
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-200">
          <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
          <p className="text-lg font-black text-slate-700">
            {unSettledOrders?.length || 0} Open Tables
          </p>
        </div>
      </div>

      {/* --- EMPTY STATE --- */}
      {unSettledOrders?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
          <HiOutlineEmojiSad size={48} className="text-slate-300 mb-2" />
          <p className="text-slate-400 font-bold">
            All clear! No bills pending.
          </p>
        </div>
      )}

      {/* --- GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {unSettledOrders?.map((order) => (
          <div
            key={order._id}
            className={`bg-white rounded-2xl shadow-sm border transition-all overflow-hidden flex flex-col ${
              activeOrderId === order._id
                ? "border-blue-500 ring-2 ring-blue-100"
                : "border-slate-200"
            }`}
          >
            {/* Table / Order Info */}
            <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Table
                </span>
                <span className="text-lg font-black text-blue-600 leading-none">
                  #{order.tableSession_id || order.orderNumber.slice(-3)}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <HiOutlineClock />
                {new Date(order.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {/* Items List */}
            <div className="p-4 flex-1 max-h-48 overflow-y-auto bg-white">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between text-sm mb-2 pb-2 border-b border-slate-50 last:border-0"
                >
                  <span className="text-slate-600">
                    <span className="font-black text-slate-900">
                      {item.quantity}x
                    </span>{" "}
                    {item.name}
                  </span>
                  <span className="font-bold text-slate-700">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-slate-50/80 border-t border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black text-slate-400 uppercase">
                  Total Bill
                </span>
                <span className="text-2xl font-black text-slate-900">
                  ₹{order.totalAmount}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Cash Button */}
                <button
                  onClick={() => handleSettle(order._id, "cod")}
                  disabled={!!activeOrderId}
                  className="flex flex-col items-center justify-center gap-1 bg-white border-2 border-emerald-500 text-emerald-600 py-3 rounded-xl hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-emerald-600"
                >
                  <HiCash size={20} />
                  <span className="text-[10px] font-black uppercase">Cash</span>
                </button>

                {/* Card Button */}
                <button
                  onClick={() => handleSettle(order._id, "card")}
                  disabled={!!activeOrderId}
                  className="flex flex-col items-center justify-center gap-1 bg-white border-2 border-blue-500 text-blue-600 py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-blue-600"
                >
                  <HiCreditCard size={20} />
                  <span className="text-[10px] font-black uppercase">
                    Stripe / Card
                  </span>
                </button>
              </div>

              {activeOrderId === order._id && (
                <p className="text-[10px] text-center mt-3 text-blue-500 font-bold animate-pulse">
                  Processing Payment...
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CashierDashboard;