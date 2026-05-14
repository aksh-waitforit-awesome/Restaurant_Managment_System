import useCartStore from "../store/useCartStore"
import { Trash2, Plus, Minus, XCircle } from "lucide-react" // Using lucide-react for icons

function CartSidebar({ tableId }) {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCartStore()

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  )

  return (
    <div className="w-96 bg-white border-l flex flex-col h-full shadow-xl">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center bg-gray-50">
        <div>
          <h3 className="font-bold text-lg text-gray-800">Current Order</h3>
          <p className="text-xs text-blue-600 font-semibold uppercase">
            Table: {tableId}
          </p>
        </div>
        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
          >
            <XCircle size={16} /> CLEAR
          </button>
        )}
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              🍽️
            </div>
            <p>Cart is empty</p>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.cartId}
              className="flex flex-col gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">
                    {item.name}
                  </h4>
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase">
                    {item.sizeName}
                  </span>
                </div>
                <button
                  onClick={() => removeFromCart(item.cartId)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-3 bg-white border rounded-lg p-1">
                  <button
                    onClick={() => updateQuantity(item.cartId, -1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-gray-600"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-bold text-sm w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.cartId, 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-gray-600"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="font-black text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer / Checkout */}
      <div className="p-6 border-t bg-gray-50 space-y-4">
        <div className="flex justify-between items-center text-gray-500 text-sm">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-xl font-black text-gray-900">
          <span>Total</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <button
          disabled={cart.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
        >
          SEND TO KITCHEN
        </button>
      </div>
    </div>
  )
}

export default CartSidebar
