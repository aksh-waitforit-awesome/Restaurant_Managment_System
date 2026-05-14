import React from "react"
import { useCartStore } from "../store/useCartStore"

function OrderSummary() {
  const cart = useCartStore((state) => state.cart)
  const getCartTotalPrice = useCartStore((state) => state.getCartTotalPrice)

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 sticky top-10">
      <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b">
        Order Summary
      </h2>

      <ul className="space-y-4 mb-6">
        {cart.map((item) => (
          <li key={item.cartItemId} className="flex gap-4">
            <div className="relative">
              <img
                src={item.image}
                className="w-16 h-16 object-cover rounded-lg border"
                alt={item.name}
              />
              <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {item.quantity}
              </span>
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-700">{item.name}</h3>
              {item.selectedSize && (
                <p className="text-xs text-gray-500">
                  Size: {item.selectedSize.sizeName}
                </p>
              )}
            </div>

            <p className="text-sm font-semibold text-gray-900">
              ₹
              {(
                Number(item.quantity) * Number(item.itemPrice)
              ).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>

      <div className="space-y-3 border-t pt-4">
        <div className="flex justify-between text-gray-600"></div>
        <div className="flex justify-between items-center pt-2 text-gray-900">
          <span className="text-lg font-bold">Total</span>
          <span className="text-2xl font-bold text-primary">
            ₹{getCartTotalPrice().toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
