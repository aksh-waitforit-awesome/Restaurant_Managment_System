import React from "react"
import { useCartStore } from "../store/useCartStore"
import { HiPlus, HiMinus, HiTrash, HiArrowLeft } from "react-icons/hi"
import { Link, useNavigate } from "react-router-dom"
import useAuthStore from "../store/useAuthStore"

const Cart = () => {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const {
    cart,
    updateItemQuantity,
    removeFromCart,
    getCartTotalPrice,
    clearCart,
  } = useCartStore()
  console.log(cart[0])
  const totalPrice = getCartTotalPrice()

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mb-6">
          <HiTrash className="text-primary w-12 h-12 opacity-20" />
        </div>
        <h2 className="text-3xl font-black text-text mb-2">
          Your cart is empty
        </h2>
        <p className="text-text opacity-60 mb-8">
          Looks like you haven't added anything yet.
        </p>
        <Link
          to="/menu"
          className="bg-primary text-surface px-8 py-3 rounded-xl font-bold hover:brightness-110 transition-all"
        >
          Browse Menu
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Side: Item List */}
      <div className="lg:col-span-2">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-black text-text">Your Order</h1>
          <button
            onClick={clearCart}
            className="text-sm font-bold text-primary hover:underline"
          >
            Clear All
          </button>
        </div>

        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.cartItemId}
              className="bg-surface border border-accent p-4 rounded-2xl flex items-center gap-4 transition-all"
            >
              {/* Item Image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-xl object-cover bg-accent"
              />

              {/* Item Info */}
              <div className="flex-1">
                <h3 className="font-extrabold text-text text-lg leading-tight">
                  {item.name}
                </h3>
                <p className="text-xs font-bold text-primary uppercase tracking-tighter">
                  {/* Updated: Accessing 'size' directly as per store logic */}
                  {item.size === "base" ? "Standard Size" : item.size}
                </p>
                <p className="font-black text-text mt-1">
                  {/* Updated: Changed itemPrice to price */}₹{item.price}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center bg-accent rounded-lg p-1 border border-accent">
                  <button
                    onClick={() =>
                      updateItemQuantity(item.cartItemId, item.quantity - 1)
                    }
                    className="p-1 hover:text-primary transition-colors"
                  >
                    <HiMinus className="w-4 h-4" />
                  </button>
                  <span className="px-3 font-black text-sm tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateItemQuantity(item.cartItemId, item.quantity + 1)
                    }
                    className="p-1 hover:text-primary transition-colors"
                  >
                    <HiPlus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.cartItemId)}
                  className="text-text opacity-40 hover:text-red-500 transition-colors"
                >
                  <HiTrash className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-8 text-text font-bold opacity-60 hover:opacity-100 transition-all"
        >
          <HiArrowLeft /> Continue Shopping
        </Link>
      </div>

      {/* Right Side: Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-surface border-2 border-primary p-6 rounded-3xl sticky top-8 shadow-xl">
          <h2 className="text-2xl font-black text-text mb-6">Bill Details</h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-text opacity-70 font-medium">
              <span>Item Total</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="flex justify-between text-text opacity-70 font-medium">
              <span>Delivery Fee</span>
              <span className="text-green-600 font-bold font-mono">FREE</span>
            </div>
            <hr className="border-accent" />
            <div className="flex justify-between text-xl font-black text-text pt-2">
              <span>To Pay</span>
              <span className="text-primary text-2xl">₹{totalPrice}</span>
            </div>
          </div>

          {isAuthenticated ? (
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-primary text-surface font-black py-4 rounded-2xl shadow-lg shadow-primary/20 hover:brightness-110 hover:-translate-y-1 transition-all active:scale-95 text-lg uppercase"
            >
              Checkout Now
            </button>
          ) : (
            <button
              onClick={() => navigate("/auth/login")}
              className="w-full bg-primary text-surface font-black py-4 rounded-2xl shadow-lg shadow-primary/20 hover:brightness-110 hover:-translate-y-1 transition-all active:scale-95 text-lg uppercase"
            >
              Login to Checkout
            </button>
          )}

          <p className="text-[10px] text-center text-text opacity-40 mt-4 uppercase tracking-widest font-bold">
            Secure SSL Encrypted Payment
          </p>
        </div>
      </div>
    </div>
  )
}

export default Cart
