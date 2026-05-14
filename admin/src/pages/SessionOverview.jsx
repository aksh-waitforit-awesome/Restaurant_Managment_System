import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import API from "../api/axios"
import { ArrowLeft, RefreshCw, Clock, User, Utensils, Info } from "lucide-react"
import { useGetSessionSubOrders } from "../react-query/queriesAndMutations"



const SessionOverview = () => {
  const { sessionId } = useParams()
  const navigate = useNavigate()

  const {
    data: subOrders,
    isPending,
    isError,
    refetch,
    isFetching,
  } = useGetSessionSubOrders(sessionId)

  // Calculate the running total of all items across all sub-orders
  const runningTotal =
    subOrders?.reduce((acc, sub) => {
      return (
        acc +
        sub.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      )
    }, 0) || 0

  if (isPending)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading Session Detail...
      </div>
    )
  if (isError)
    return (
      <div className="p-10 text-center text-red-500">
        Error loading table data.
      </div>
    )
    console.log(subOrders)
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Section */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full transition"
          >
            <ArrowLeft size={22} className="text-slate-700" />
          </button>

          <div className="text-center">
            <h1 className="text-lg font-bold text-slate-900">Table Session</h1>
            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">
              {sessionId}
            </p>
          </div>

          <button
            onClick={() => refetch()}
            className={`p-2 hover:bg-slate-100 rounded-full transition ${isFetching ? "animate-spin" : ""}`}
          >
            <RefreshCw size={20} className="text-blue-600" />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {/* Summary Card */}
        <div className="bg-slate-900 rounded-2xl p-5 mb-6 text-white shadow-xl shadow-slate-200 flex justify-between items-center">
          <div>
            <p className="text-slate-400 text-xs uppercase font-semibold">
              Running Total
            </p>
            <p className="text-3xl font-bold">₹{runningTotal}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-xs uppercase font-semibold">
              Rounds
            </p>
            <p className="text-2xl font-bold text-blue-400">
              {subOrders?.length || 0}
            </p>
          </div>
        </div>

        {/* List of Rounds (SubOrders) */}
        <div className="space-y-4">
          {subOrders?.map((sub, index) => (
            <div
              key={sub._id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm"
            >
              {/* Round Header */}
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-400 uppercase">
                    Round {index + 1}
                  </span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock size={12} />{" "}
                    {new Date(sub.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="text-[11px] font-medium text-slate-600 flex items-center gap-1">
                  <User size={12} className="text-blue-500" />{" "}
                  {sub.waiter_id?.username}
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-50">
                {sub.items.map((item) => (
                  <div
                    key={item._id}
                    className="p-4 flex justify-between items-center"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${item.itemStatus === "served" ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"}`}
                      >
                        <Utensils size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-500">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs text-slate-500">
                            {item.size}
                          </span>
                        </div>
                        {item.notes && (
                          <p className="text-[11px] text-orange-600 flex items-center gap-1 mt-1">
                            <Info size={10} /> {item.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">
                        ₹{item.price * item.quantity}
                      </p>
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded mt-1 inline-block tracking-tighter ${
                          item.itemStatus === "served"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.itemStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {subOrders?.length === 0 && (
          <div className="text-center py-20">
            <Utensils className="mx-auto text-slate-200 mb-2" size={48} />
            <p className="text-slate-400">No items ordered yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SessionOverview
