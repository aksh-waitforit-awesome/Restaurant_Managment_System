import React, { useEffect } from "react"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { NavLink, useNavigate } from "react-router-dom"
import {
  Users,
  PlayCircle,
  XCircle,
  PlusCircle,
  Eye,
  LayoutDashboard,
  Clock,
  CheckCircle2,
} from "lucide-react"
import { generateBillPDF } from "../utils/generateBillPDF"
import API from "../api/axios"
import useWaiterStore from "../store/useWaiterStore"
import {
  useEndTableSession,
  useGetLiveTableStatus,
  useStartTableSession,
} from "../react-query/queriesAndMutations"

function WaiterDashBoard() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  // zustand store for managing modal state and selected table/session
  const {
    selectedTable,
    isModalOpen,
    modalMode,
    closeModal,
    setSelectedTable,
  } = useWaiterStore()
  // query to fetch live table status
  const { data, isLoading } = useGetLiveTableStatus()
  // mutations for starting and ending table sessions
  const { mutateAsync: startTableSession, isPending: starting_table_session } =
    useStartTableSession()
  const {
    mutateAsync: endTableSession,
    isPending: ending_table_session,
    onError = (err) => {
      console.log(err)
      toast.error(err.message)
      closeModal()
    },
  } = useEndTableSession()

  // confirmation handler for modal actions
  const handleConfirmAction = () => {
    if (modalMode === "Start_Session") {
      startTableSession(selectedTable._id)
    } else {
      endTableSession(selectedTable._id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50">
        <div className="h-12 wedge-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
        <p className="mt-4 font-bold text-slate-400 tracking-widest uppercase text-sm">
          Loading Tables
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* --- HEADER --- */}
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Floor Plan
            </h2>
            <p className="text-slate-500 font-medium">
              Manage live tables and active sessions
            </p>
          </div>
          <div className="flex items-center gap-6 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-200">
            <StatusIndicator color="bg-emerald-500" label="Available" />
            <StatusIndicator color="bg-rose-500" label="Occupied" />
          </div>
        </div>

        {/* --- TABLE GRID --- */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data?.data.map((table) => (
            <TableCard key={table._id} table={table} navigate={navigate} />
          ))}
        </div>
      </div>

      {/* --- MODERN MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={closeModal}
          ></div>
          <div className="relative w-full max-w-sm transform overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-2xl transition-all">
            <div
              className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${
                modalMode === "Start_Session"
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-rose-100 text-rose-600"
              }`}
            >
              {modalMode === "Start_Session" ? (
                <PlayCircle size={32} />
              ) : (
                <XCircle size={32} />
              )}
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-black text-slate-900">
                {modalMode === "Start_Session" ? "Open Table?" : "Close Table?"}
              </h3>
              <p className="mt-2 text-slate-500">
                Confirming action for{" "}
                <span className="font-bold text-slate-900">
                  Table {selectedTable?.tableNumber}
                </span>
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={handleConfirmAction}
                disabled={starting_table_session || ending_table_session}
                className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 ${
                  modalMode === "Start_Session"
                    ? "bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700"
                    : "bg-rose-600 shadow-rose-200 hover:bg-rose-700"
                }`}
              >
                {starting_table_session || ending_table_session
                  ? "Syncing..."
                  : "Confirm Action"}
              </button>
              <button
                onClick={closeModal}
                className="w-full py-4 rounded-2xl font-bold text-slate-400 bg-slate-100 hover:bg-slate-200 transition-all"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const TableCard = ({ table, navigate }) => {
  const {
    openCloseModal,
    openStartModal,
    setSelectedTable,
    setSelectedSessionId,
  } = useWaiterStore()

  const isOcc = table.isOccupied

  const handleOrderMore = () => {
    setSelectedTable(table)
    setSelectedSessionId(table?.currentSession?._id)
    navigate("/pos")
  }

  return (
    <div
      className={`group relative flex flex-col rounded-[2.5rem] border-2 p-6 transition-all duration-300 ${
        isOcc
          ? "bg-white border-rose-100 shadow-xl shadow-rose-50"
          : "bg-white border-slate-100 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-50"
      }`}
    >
      {/* Top Row: Capacity & Status */}
      <div className="flex items-center justify-between mb-4">
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
            isOcc ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-500"
          }`}
        >
          <Users size={12} /> {table.capacity} Guests
        </div>
        {isOcc && (
          <div className="flex items-center gap-1 text-emerald-500 font-bold text-[10px] uppercase">
            <Clock size={12} /> Active
          </div>
        )}
      </div>

      {/* Center: Table Number */}
      <div className="flex flex-col items-center py-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Table
        </span>
        <h2
          className={`text-6xl font-black leading-none ${isOcc ? "text-rose-600" : "text-slate-900"}`}
        >
          {table.tableNumber}
        </h2>
      </div>

      {/* Footer: Actions */}
      <div className="mt-auto space-y-2 pt-4">
        {isOcc ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleOrderMore}
                className="flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-2xl text-xs font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
              >
                <PlusCircle size={14} /> POS
              </button>
              <NavLink
                to={`/session/${table?.currentSession?._id}`}
                className="flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-black transition-all"
              >
                <Eye size={14} /> View
              </NavLink>
            </div>
            <button
              onClick={() => openCloseModal(table)}
              className="w-full py-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl text-xs font-bold hover:bg-rose-600 hover:text-white transition-all"
            >
              End Session
            </button>
          </>
        ) : (
          <button
            onClick={() => openStartModal(table)}
            className="flex w-full items-center justify-center gap-2 py-4 bg-emerald-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95"
          >
            <PlayCircle size={18} /> Open Table
          </button>
        )}
      </div>
    </div>
  )
}

const StatusIndicator = ({ color, label }) => (
  <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
    <div
      className={`h-2.5 w-2.5 ${color} rounded-full ring-4 ${color.replace("bg-", "ring-").replace("500", "100")}`}
    ></div>
    {label}
  </span>
)

export default WaiterDashBoard
