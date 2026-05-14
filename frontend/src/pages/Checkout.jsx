import React, { useState } from "react"
import { useCartStore } from "../store/useCartStore"
import API from "../api/axios"
import { ShoppingBag, MapPin, CreditCard, User } from "lucide-react"

const CheckoutPage = () => {
  const { cart, getCartTotalPrice, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    orderType: "takeaway",
    paymentMethod: "card",
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const mappedItems = cart.map((item) => ({
        menuItem: item._id,
        name: item.name,
        quantity: item.quantity,
        size: item.size,
        price: item.price,
      }))

      const orderData = {
        customer: {
          name: formData.name,
          phone: formData.phone,
          address:
            formData.orderType === "delivery"
              ? formData.address
              : "Takeaway Order",
        },
        items: mappedItems,
        orderType: formData.orderType,
        paymentMethod: formData.paymentMethod,
        totalAmount: getCartTotalPrice(),
      }

      const response = await API.post("order/checkout", orderData)

      if (formData.paymentMethod === "card") {
        window.location.href = response.data.url
      } else {
        clearCart()
        window.location.href = `/order-success/${response.data.orderId}`
      }
    } catch (error) {
      console.error("Checkout Error:", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface text-text py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Section - 7 Columns on Large Screens */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-surface border border-accent/20 p-6 rounded-3xl shadow-xl shadow-primary/5">
            <h2 className="text-2xl font-black uppercase italic tracking-tight mb-6 flex items-center gap-2">
              <User className="text-primary w-6 h-6" />
              Customer Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase opacity-60 ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    required
                    className="w-full bg-accent border border-accent rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-text/30"
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase opacity-60 ml-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="e.g. 9876543210"
                    required
                    className="w-full bg-accent border border-accent rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-text/30"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Order Type Toggle */}
              <div className="p-1 bg-accent rounded-2xl flex gap-1">
                {["takeaway", "delivery"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, orderType: type })
                    }
                    className={`flex-1 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
                      formData.orderType === type
                        ? "bg-primary text-white shadow-lg"
                        : "text-text opacity-40 hover:opacity-100"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {formData.orderType === "delivery" && (
                <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-xs font-bold uppercase opacity-60 ml-1">
                    Delivery Address
                  </label>
                  <textarea
                    name="address"
                    placeholder="Street, Landmark, Apartment..."
                    required
                    rows="3"
                    className="w-full bg-accent border border-accent rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-text/30"
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="pt-4 border-t border-accent/50">
                <h3 className="font-black uppercase tracking-tight mb-4 flex items-center gap-2">
                  <CreditCard className="text-primary w-5 h-5" />
                  Payment Method
                </h3>
                <select
                  name="paymentMethod"
                  className="w-full bg-accent border border-accent rounded-xl p-3 font-bold focus:ring-2 focus:ring-primary outline-none"
                  onChange={handleChange}
                >
                  <option value="card">Online Payment (Stripe)</option>
                  <option value="cod">Cash on Delivery</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading || cart.length === 0}
                className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xl uppercase tracking-tighter hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-40 shadow-xl shadow-primary/20 flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  `Pay ₹${getCartTotalPrice().toFixed(2)}`
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Summary Section - 5 Columns */}
        <div className="lg:col-span-5 h-fit sticky top-10">
          <div className="bg-accent/40 border border-accent rounded-3xl p-6 backdrop-blur-sm">
            <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
              <ShoppingBag className="text-primary w-5 h-5" />
              Order Summary
            </h2>

            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex justify-between gap-4 group"
                >
                  <div className="flex-1">
                    <p className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">
                      {item.name}
                    </p>
                    <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mt-1">
                      {item.size} • Qty {item.quantity}
                    </p>
                  </div>
                  <p className="font-black text-sm">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t-2 border-dashed border-accent">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold opacity-50 uppercase tracking-widest">
                  Subtotal
                </span>
                <span className="font-bold">
                  ₹{getCartTotalPrice().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-primary">
                <span className="text-xl font-black uppercase tracking-tighter">
                  Total Amount
                </span>
                <span className="text-3xl font-black">
                  ₹{getCartTotalPrice().toFixed(2)}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-center opacity-30 mt-6 uppercase font-bold italic">
              Secure Checkout • No hidden fees
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
