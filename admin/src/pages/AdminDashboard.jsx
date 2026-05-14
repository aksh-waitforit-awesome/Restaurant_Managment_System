import React from "react"
import { useGetAdminDashboard } from "../react-query/queriesAndMutations"

function AdminDashboard() {
  const { data, isLoading, isError } = useGetAdminDashboard()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
        <div className="text-center font-mono animate-pulse text-indigo-600 font-bold">
          CALCULATING STATS...
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-10 text-center text-red-500">
        Error loading dashboard data. Please try again later.
      </div>
    )
  }

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
          Executive Overview
        </h1>
        <p className="text-slate-500">
          Real-time performance for Curry Chapter
        </p>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-hover hover:shadow-md">
          <p className="text-slate-400 text-xs font-bold uppercase mb-1">
            Total Revenue
          </p>
          <h2 className="text-3xl font-black text-indigo-600">
            ₹{data?.summary?.totalRevenue?.toLocaleString() || 0}
          </h2>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-hover hover:shadow-md">
          <p className="text-slate-400 text-xs font-bold uppercase mb-1">
            Total Orders
          </p>
          <h2 className="text-3xl font-black text-slate-800">
            {data?.summary?.totalOrders || 0}
          </h2>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-hover hover:shadow-md">
          <p className="text-slate-400 text-xs font-bold uppercase mb-1">
            Avg. Order Value
          </p>
          <h2 className="text-3xl font-black text-slate-800">
            ₹{data?.summary?.avgOrderValue?.toFixed(0) || 0}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Type Breakdown */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
            Order Channels
          </h3>
          {data?.types?.map((t) => (
            <div
              key={t._id}
              className="bg-white p-4 rounded-xl border flex justify-between items-center hover:border-indigo-200 transition-colors"
            >
              <div>
                <p className="capitalize font-bold text-slate-800">{t._id}</p>
                <p className="text-xs text-slate-400">{t.count} Orders</p>
              </div>
              <p className="font-black text-slate-700">
                ₹{t.revenue.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
            <span className="font-bold text-slate-700">Live Order Feed</span>
            <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-md font-bold uppercase">
              Latest {data?.recentOrders?.length || 0}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b">
                <tr>
                  <th className="px-6 py-3 text-left">Order</th>
                  <th className="px-6 py-3 text-left">Type</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.recentOrders?.map((order) => (
                  <tr
                    key={order._id}
                    className="text-sm hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      #{order.orderNumber}
                    </td>
                    <td className="px-6 py-4 capitalize text-slate-500">
                      {order.orderType}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      ₹{order.totalAmount}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-black px-2 py-1 rounded-full uppercase border ${
                          order.orderStatus === "completed"
                            ? "bg-green-50 text-green-600 border-green-100"
                            : "bg-amber-50 text-amber-600 border-amber-100"
                        }`}
                      >
                        {order.orderStatus.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
