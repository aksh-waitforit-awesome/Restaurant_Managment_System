import React, { useState, useEffect } from "react"
import API from "../api/axios"

const BookingForm = ({ table, onSuccess }) => {
  const [formData, setFormData] = useState({
    waiter_id: "",
    name: "",
    phone_no: "",
    email: "",
  })

  const [waiters, setWaiters] = useState([])
  const [loading, setLoading] = useState(true)

  // 1. Fetch Waiters for the dropdown
  useEffect(() => {
    async function getWaiters() {
      try {
        const res = await API.get("auth/waiter")
        // Adjusting based on standard API response structures
        const waiterList = res?.data?.waiters || res?.data || []

        setWaiters(waiterList)
      } catch (err) {
        console.error("Failed to fetch waiters", err)
      } finally {
        setLoading(false)
      }
    }
    getWaiters()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        table_id: table._id,
        waiter_id: formData.waiter_id,
        contactDetail: {
          name: formData.name,
          phone_no: formData.phone_no,
          email: formData.email,
        },
      }

      // Ensure we use your configured API instance
      await API.post("/tableSession", payload)
      onSuccess()
    } catch (error) {
      alert(error.response?.data?.message || "Error creating session")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Waiter Selection Dropdown */}
      <div>
        <label className="block text-indigo-300 text-sm mb-2">
          Assign Waiter
        </label>
        <select
          required
          className="w-full bg-slate-800 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 outline-none appearance-none"
          value={formData.waiter_id}
          onChange={(e) =>
            setFormData({ ...formData, waiter_id: e.target.value })
          }
        >
          <option value="" disabled>
            Select a waiter
          </option>
          {waiters.map((waiter) => (
            <option key={waiter._id} value={waiter._id}>
              {waiter.username}
            </option>
          ))}
        </select>
        {loading && (
          <p className="text-xs text-indigo-400 mt-1">Loading staff...</p>
        )}
      </div>

      <div className="pt-4 border-t border-white/5">
        <label className="block text-indigo-300 text-sm mb-2">
          Customer Name
        </label>
        <input
          required
          placeholder="John Doe"
          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 outline-none placeholder:text-white/20"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-indigo-300 text-sm mb-2">
          Phone Number
        </label>
        <input
          required
          type="tel"
          placeholder="+1 234 567 890"
          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 outline-none placeholder:text-white/20"
          value={formData.phone_no}
          onChange={(e) =>
            setFormData({ ...formData, phone_no: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block text-indigo-300 text-sm mb-2">
          Email (Optional)
        </label>
        <input
          type="email"
          placeholder="john@example.com"
          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 outline-none placeholder:text-white/20"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="bg-indigo-500/10 p-4 rounded-lg border border-indigo-500/20">
        <p className="text-indigo-200 text-xs">
          Opening session for <strong>Table {table.tableNumber}</strong>. This
          will mark the table as occupied.
        </p>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
      >
        Open Session
      </button>
    </form>
  )
}

export default BookingForm
