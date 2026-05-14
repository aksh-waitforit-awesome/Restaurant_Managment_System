import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import API from "../api/axios"
import moment from "moment"
import { useGetOrderById } from "../react-query/queriesAndMutations"
function OrderDetail() {
  const { id: orderId } = useParams()
  const navigate = useNavigate()
  const { data: order, isLoading, error } = useGetOrderById(orderId)
  console.log("Fetched Order Details:", order)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="text-gray-500 font-medium">Fetching order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="p-8 text-center bg-gray-50 min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-red-500 text-2xl font-bold mb-2">
          Order Not Found
        </h2>
        <p className="text-gray-500">
          We couldn't retrieve details for Order ID:{" "}
          <span className="font-mono text-xs">{orderId}</span>
        </p>
      </div>
    )
  }

  const statusColors = {
    preparing: "bg-amber-100 text-amber-700 border-amber-200",
    pending: "bg-gray-100 text-gray-700 border-gray-200",
    completed: "bg-green-100 text-green-700 border-green-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
      {/* --- Top Navigation/Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Order #{order?.orderNumber}
            </h1>
            <span
              className={`px-3 py-1 rounded-md border text-xs font-bold uppercase ${statusColors[order?.orderStatus] || statusColors.pending}`}
            >
              {order?.orderStatus}
            </span>
          </div>

          <p className="text-sm text-gray-400 mt-1">
            Placed at{" "}
            {moment(order?.createdAt).format("hh:mm:ss on MMMM Do YYYY")}
          </p>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => window.print()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-100"
          >
            Print Invoice
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-50 transition shadow-sm"
          >
            Back
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- Left Column: Items --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="font-bold text-gray-800 uppercase text-sm tracking-wider">
                Items Summary
              </h2>
              <span className="text-gray-500 text-xs font-medium">
                {order?.items?.length} Items
              </span>
            </div>
            <ul className="divide-y divide-gray-100">
              {order?.items?.map((item) => (
                <li
                  key={item?._id?.$oid}
                  className="px-6 py-5 flex justify-between items-center hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="font-bold text-gray-900 text-lg">
                      {item?.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded uppercase font-bold">
                        {item?.size}
                      </span>
                      <span className="text-sm text-gray-400">
                        Qty: {item?.quantity}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      ${(item?.price * item?.quantity).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">${item?.price} each</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="px-6 py-6 bg-indigo-50 flex justify-between items-center border-t border-indigo-100">
              <div>
                <p className="text-indigo-900 font-bold text-lg">
                  Total Amount
                </p>
                <p className="text-indigo-500 text-xs uppercase font-black">
                  Inclusive of all taxes
                </p>
              </div>
              <span className="text-3xl font-black text-indigo-700">
                ${order?.totalAmount?.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* --- Right Column: Customer & Dynamic Logistics --- */}
        <div className="space-y-6">
          {/* Customer Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-xs font-black tracking-widest text-gray-400 mb-4 uppercase">
              Customer
            </h3>
            <div className="space-y-1">
              <p className="font-bold text-gray-900 text-xl capitalize">
                {order?.customer?.name}
              </p>
              <p className="text-indigo-600 font-medium">
                {order?.customer?.phone}
              </p>
            </div>
          </div>

          {/* Conditional Logistics Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black tracking-widest text-gray-400 uppercase">
                Logistics
              </h3>
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase rounded">
                {order?.orderType}
              </span>
            </div>

            <div className="space-y-4">
              {/* 1. Dining Specific */}
              {order?.orderType === "dining" && (
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Table Number:</span>
                    <span className="font-black text-gray-900">
                      #{order?.tableSession_id || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Assigned Waiter:</span>
                    <span className="font-bold text-gray-700">
                      {order?.waiter_id || "Unassigned"}
                    </span>
                  </div>
                </div>
              )}

              {/* 2. Delivery Specific */}
              {order?.orderType === "delivery" && (
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="mb-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                      Shipping Address
                    </p>
                    <p className="text-sm font-medium text-gray-800 leading-relaxed">
                      {order?.customer?.address}
                    </p>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                    <span className="text-gray-500">Rider:</span>
                    <span className="font-black text-indigo-600">
                      {order?.deliveryGuy || "Searching..."}
                    </span>
                  </div>
                </div>
              )}

              {/* Common Details */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Payment:</span>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 uppercase text-xs">
                      {order?.paymentMethod}
                    </p>
                    <p
                      className={`text-[10px] font-black uppercase ${order?.paymentStatus === "paid" ? "text-green-500" : "text-red-500"}`}
                    >
                      {order?.paymentStatus}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">KOT Status:</span>
                  <span
                    className={`font-bold text-xs ${order?.isKOTPrinted ? "text-green-600" : "text-amber-500"}`}
                  >
                    {order?.isKOTPrinted ? "✓ PRINTED" : "⚠️ PENDING"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction ID Info */}
          <div className="bg-gray-100 p-4 rounded-xl border border-dashed border-gray-300">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
              Stripe Session ID
            </p>
            <p className="text-[10px] font-mono text-gray-500 break-all">
              {order?.stripeSessionId}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
