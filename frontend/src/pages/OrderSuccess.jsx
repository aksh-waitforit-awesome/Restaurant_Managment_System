import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import API from "../api/axios"
import moment from "moment"
import {
  CheckCircle,
  Package,
  Truck,
  Utensils,
  Motorbike,
  Salad,
  ArrowLeft,
} from "lucide-react"
import { useCartStore } from "../store/useCartStore"

const OrderSuccess = () => {
  const { id: orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const clearCart = useCartStore((state) => state.clearCart)

  useEffect(() => {
    let interval
    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/order/${orderId}`)
        setOrder(data)
        if (data.paymentStatus === "paid") {
          clearCart()
          if (interval) clearInterval(interval)
        }
      } catch (err) {
        console.error("Error fetching order:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
    interval = setInterval(() => {
      if (order && order.paymentStatus !== "paid") {
        fetchOrder()
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [orderId, order?.paymentStatus, clearCart])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] bg-surface">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-primary"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-red-50 text-red-600 rounded-2xl border border-red-100 mx-4">
        <p className="font-bold uppercase tracking-tight">Order Not Found</p>
      </div>
    )
  }

  // Dynamic Status Steps logic
  const statusSteps =
    order.orderType === "delivery"
      ? ["placed", "preparing", "ready", "out_for_delivery", "completed"]
      : ["placed", "preparing", "ready", "completed"]

  const currentStep = statusSteps.indexOf(order.orderStatus)

  return (
    <div className="min-h-screen bg-surface py-6 md:py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Navigation Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-text/50 hover:text-primary mb-6 font-bold text-sm uppercase tracking-widest transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>

        <div className="bg-surface rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl shadow-primary/5 overflow-hidden border border-accent">
          {/* Header Section */}
          <div className="bg-primary p-6 md:p-10 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <Utensils className="absolute -top-4 -left-4 w-20 h-20 md:w-32 md:h-32 rotate-12" />
              <Package className="absolute -bottom-4 -right-4 w-20 h-20 md:w-32 md:h-32 -rotate-12" />
            </div>

            <CheckCircle className="w-12 h-12 md:w-20 md:h-20 mx-auto mb-4 animate-bounce drop-shadow-lg" />
            <h1 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter">
              Order Confirmed!
            </h1>
            <div className="flex flex-col items-center gap-1 mt-2">
              <p className="opacity-90 font-mono text-sm md:text-lg font-bold">
                Order #{order.orderNumber}
              </p>
              {order.paymentStatus === "pending" && (
                <span className="text-[10px] md:text-xs bg-white/20 px-3 py-1 rounded-full animate-pulse uppercase font-black">
                  Confirming Payment...
                </span>
              )}
            </div>
          </div>

          {/* Real-time Status Tracker */}
          <div className="p-6 md:p-10 border-b border-accent overflow-x-auto no-scrollbar">
            <div
              className={`flex justify-between items-center relative px-2 ${statusSteps.length > 4 ? "min-w-[500px]" : "min-w-full"}`}
            >
              {statusSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex flex-col items-center z-10 w-full"
                >
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-700 shadow-lg ${
                      index <= currentStep
                        ? "bg-primary text-white scale-110"
                        : "bg-accent text-text/20"
                    }`}
                  >
                    {step === "placed" && (
                      <Package size={18} className="md:w-[22px]" />
                    )}
                    {step === "preparing" && (
                      <Utensils size={18} className="md:w-[22px]" />
                    )}
                    {step === "ready" && (
                      <CheckCircle size={18} className="md:w-[22px]" />
                    )}
                    {step === "out_for_delivery" && (
                      <Motorbike size={18} className="md:w-[22px]" />
                    )}
                    {step === "completed" && (
                      <Salad size={18} className="md:w-[22px]" />
                    )}
                  </div>
                  <p
                    className={`text-[8px] md:text-[10px] mt-4 font-black uppercase tracking-[0.1em] md:tracking-[0.15em] whitespace-nowrap ${
                      index <= currentStep ? "text-primary" : "text-text/20"
                    }`}
                  >
                    {step.replace(/_/g, " ")}
                  </p>
                </div>
              ))}

              {/* Background Progress Line */}
              <div className="absolute top-5 md:top-6 left-0 w-full h-1 bg-accent -z-0 rounded-full"></div>
              <div
                className="absolute top-5 md:top-6 left-0 h-1 bg-primary transition-all duration-1000 -z-0 rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                style={{
                  width: `${(currentStep / (statusSteps.length - 1)) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Receipt Summary */}
          <div className="p-6 md:p-10">
            <h2 className="font-black text-xl md:text-2xl uppercase italic tracking-tighter mb-6 text-text">
              Receipt Summary
            </h2>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-start text-text/70 group"
                >
                  <div className="flex flex-col">
                    <span className="font-bold group-hover:text-primary transition-colors text-sm md:text-base text-text">
                      {item.name}
                      <span className="text-primary/50 text-xs ml-1 font-black">
                        ×{item.quantity}
                      </span>
                    </span>
                    <span className="text-[9px] md:text-[10px] uppercase font-black opacity-40 tracking-widest">
                      Size: {item.size}
                    </span>
                  </div>
                  <span className="font-black text-text italic text-sm md:text-base">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              <div className="border-t-2 border-dashed border-accent pt-6 mt-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] md:text-xs font-black uppercase opacity-40 tracking-widest">
                    Paid via {order.paymentMethod}
                  </span>
                  <span className="text-[9px] md:text-xs font-black uppercase opacity-40 tracking-widest">
                    Total Amount
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-xs md:text-sm font-bold opacity-60 italic pb-1">
                    {moment(order.createdAt).format("MMM DD, hh:mm A")}
                  </span>
                  <span className="text-3xl md:text-4xl font-black text-text italic tracking-tighter">
                    ₹{order.totalAmount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="p-6 md:p-8 bg-accent/30 flex flex-col gap-4">
            <p className="text-[10px] text-center font-bold text-text/40 uppercase tracking-widest">
              A copy of this receipt was sent to your phone
            </p>
            <Link
              to="/"
              className="block w-full text-center bg-primary text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
            >
              Order More Food
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess
