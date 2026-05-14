import React, { useState, useEffect } from "react"
import { useStaffStore } from "../store/useStaffStore"
import { MdChevronLeft, MdChevronRight } from "react-icons/md"
import { BiSearch } from "react-icons/bi"

// Custom Hooks
import { useGetStaff, useAddStaff } from "../react-query/queriesAndMutations"

// Components
import AddStaffModal from "../components/AddModalStaff"

const ROLE_STYLES = {
  admin: "bg-purple-100 text-purple-700 border-purple-200",
  manager: "bg-blue-100 text-blue-700 border-blue-200",
  chef: "bg-orange-100 text-orange-700 border-orange-200",
  waiter: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cashier: "bg-pink-100 text-pink-700 border-pink-200",
}

const STAFF_ROLES = [
  { value: "", label: "All Roles" },
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "waiter", label: "Waiter" },
  { value: "chef", label: "Chef" },
  { value: "receptionist", label: "Receptionist" },
  { value: "cashier", label: "Cashier" },
  { value: "delivery_guy", label: "Delivery Driver" },
]

function Staff() {
  const {
    page,
    searchQuery,
    selectedRole,
    open,
    openModal,
    closeModal,
    setSearchQuery,
    setSelectedRole,
    setPage,
  } = useStaffStore()

  const [localSearch, setLocalSearch] = useState(searchQuery)

  // Debounce Search
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(localSearch)
      setPage(1) // Reset page on new search
    }, 300)
    return () => clearTimeout(handler)
  }, [localSearch, setSearchQuery, setPage])

  // --- REFACTORED HOOKS ---
  const { data, isLoading } = useGetStaff({
    search: searchQuery,
    page: page,
    role: selectedRole,
  })

  const { 
    mutate: addStaff, 
    isPending: isAdding, 
    error: serverError 
  } = useAddStaff(closeModal)

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Staff Directory</h1>
            <p className="text-gray-500">Manage team members and system access.</p>
          </div>
          <button
            onClick={openModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm"
          >
            + Add Staff Member
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by username..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value)
              setPage(1) // Reset page on filter change
            }}
            className="border border-gray-200 rounded-lg px-4 py-2 bg-white outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {STAFF_ROLES.map((role) => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-200 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Staff Member</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-20 text-center">
                      <div className="flex justify-center items-center gap-2 text-gray-400">
                        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        Loading team...
                      </div>
                    </td>
                  </tr>
                ) : data?.data?.length > 0 ? (
                  data.data.map((member) => (
                    <tr key={member._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold border border-indigo-100">
                            {member.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{member.username}</p>
                            <p className="text-sm text-gray-500">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${ROLE_STYLES[member.role] || "bg-gray-100 text-gray-600"}`}>
                          {member.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${member.isActive ? "bg-green-500 animate-pulse" : "bg-gray-300"}`} />
                          <span className={`text-sm font-medium ${member.isActive ? "text-green-700" : "text-gray-400"}`}>
                            {member.isActive ? "Active" : "Disabled"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(member.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-20 text-center text-gray-400 italic">
                      No staff members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <span className="text-sm text-gray-600">
              Page <b>{page}</b> of <b>{data?.totalPages || 1}</b>
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1 || isLoading}
                onClick={() => setPage(page - 1)}
                className="p-2 border rounded-lg bg-white disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                <MdChevronLeft size={24} />
              </button>
              <button
                disabled={page >= (data?.totalPages || 1) || isLoading}
                onClick={() => setPage(page + 1)}
                className="p-2 border rounded-lg bg-white disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                <MdChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddStaffModal
        open={open}
        closeModal={closeModal}
        isLoading={isAdding}
        onSubmit={(data) => addStaff(data)}
        serverError={serverError}
      />
    </div>
  )
}

export default Staff