import React from "react"
import useWaiterStore from "../store/useWaiterStore"
import { HiTrash, HiPlus, HiMinus, HiOutlineShoppingBag } from "react-icons/hi"
import { useMutation } from "@tanstack/react-query"
import API from "../api/axios"
import { toast } from "react-hot-toast"
import { NavLink, useNavigate } from "react-router-dom"

function OrderSummary() {
  const navigate = useNavigate()
  const {
    cart,
    updateItemQuantity,
    removeFromCart,
    getCartTotalPrice,
    setSelectedSessionId,
    setSelectedTable,
    selectedTableSessionId,
    selectedTable,
    clearCart,
  } = useWaiterStore()

  const totalPrice = getCartTotalPrice()

  const orderMutation = useMutation({
    mutationFn: async (orderData) => {
      const res = await API.post("/subOrder", orderData)
      return res.data
    },
    onSuccess: () => {
      toast.success("Order sent to kitchen!")
      clearCart()
      navigate("/")
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || error.message || "Failed to send order"
      )
    },
  })

  const handlePlaceOrder = () => {
    if (!selectedTableSessionId) return toast.error("Please select a table first!")
    const orderData = {
      tableSession_id: selectedTableSessionId,
      items: cart.map((item) => ({
        menuItem: item.menuItemId,
        name: item.name,
        quantity: item.quantity,
        size: item.size,
        price: item.price,
      })),
      orderType: "dining",
    }
    orderMutation.mutate(orderData)
  }

  return (
    <div className="flex flex-col h-full bg-white w-full overflow-hidden">

      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-100 bg-white flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <HiOutlineShoppingBag className="text-blue-600" size={20} />
            Order
          </h2>
          <div className="flex flex-col items-end max-w-[55%]">
            {selectedTable?.tableNumber ? (
              <div className="text-right">
                <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider block">
                  Table {selectedTable.tableNumber}
                </span>
                <span className="text-[9px] text-gray-400 font-medium mt-0.5 block truncate">
                  {selectedTableSessionId}
                </span>
              </div>
            ) : (
              <span className="bg-red-50 text-red-500 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                No Table
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 no-scrollbar">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <HiOutlineShoppingBag size={40} className="opacity-20 mb-2" />
            <p className="font-medium text-sm">Your cart is empty</p>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.cartItemId}
              className="flex items-start gap-3 p-3 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 rounded-xl object-cover bg-gray-100 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-1">
                  <h4 className="font-bold text-sm text-gray-900 truncate leading-tight">
                    {item.name}
                  </h4>
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 ml-1"
                  >
                    <HiTrash size={15} />
                  </button>
                </div>
                <p className="text-[10px] text-blue-600 font-black uppercase mb-2">
                  {item.size}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm">
                    <button
                      onClick={() => updateItemQuantity(item.cartItemId, item.quantity - 1)}
                      className="p-1 hover:bg-gray-50 text-gray-500 rounded-l-lg"
                    >
                      <HiMinus size={11} />
                    </button>
                    <span className="px-2 text-xs font-black text-gray-900 min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateItemQuantity(item.cartItemId, item.quantity + 1)}
                      className="p-1 hover:bg-gray-50 text-gray-500 rounded-r-lg"
                    >
                      <HiPlus size={11} />
                    </button>
                  </div>
                  <p className="font-bold text-sm text-gray-900">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-4 bg-gray-50 border-t border-gray-200 space-y-3 flex-shrink-0">
        <div className="space-y-1.5">
          <div className="flex justify-between text-gray-500 text-xs font-bold uppercase tracking-widest">
            <span>Subtotal</span>
            <span>₹{totalPrice}</span>
          </div>
          <div className="flex justify-between items-center pt-1.5 border-t border-gray-200">
            <span className="text-sm font-black text-gray-900 uppercase">Total</span>
            <span className="text-xl font-black text-blue-600">₹{totalPrice}</span>
          </div>
        </div>

        {!selectedTableSessionId ? (
          <NavLink
            to="/"
            className="w-full inline-flex py-3.5 items-center justify-center rounded-2xl font-black text-white uppercase tracking-wide text-sm bg-red-500 hover:bg-red-600 shadow-lg transition-all active:scale-95"
          >
            Please select a table
          </NavLink>
        ) : (
          <button
            onClick={handlePlaceOrder}
            disabled={cart.length === 0 || orderMutation.isPending}
            className={`w-full py-3.5 rounded-2xl font-black text-white uppercase tracking-widest text-sm transition-all shadow-lg active:scale-95 ${
              cart.length > 0 && !orderMutation.isPending
                ? "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                : "bg-gray-300 cursor-not-allowed shadow-none"
            }`}
          >
            {orderMutation.isPending ? "Sending to Kitchen..." : "Place Order"}
          </button>
        )}
      </div>
    </div>
  )
}

export default OrderSummary
