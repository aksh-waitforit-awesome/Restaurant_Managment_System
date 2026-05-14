import React, { useState, useEffect } from "react"
import { BiSearch, BiPlus } from "react-icons/bi"
import { MdEdit, MdChevronLeft, MdChevronRight } from "react-icons/md"

// Custom Stores & Hooks
import useMenuStore from "../store/useMenuStore"
import {
  useGetCategories,
  useGetMenu,
  useToggleMenuStatus,
  useUpsertMenu,
} from "../react-query/queriesAndMutations"

// Components
import ToggleButton from "../components/ToggleButton"
import MenuItemForm from "../components/MenuItemForm"

function Menu() {
  // Zustand State
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setCategory,
    page,
    setPage,
    isModalOpen,
    openModal,
    closeModal,
    formMode,
    selectedItem,
  } = useMenuStore()

  // Local state for UI responsiveness
  const [localSearch, setLocalSearch] = useState(searchQuery)

  // Debounce: Update Zustand store when user stops typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(localSearch)
      setPage(1) // Reset to page 1 on new search
    }, 300)
    return () => clearTimeout(handler)
  }, [localSearch, setSearchQuery, setPage])

  // --- REFACTORED HOOKS ---
  const { data: categoriesData } = useGetCategories()

  const { data: menuData, isLoading } = useGetMenu({
    page,
    search: searchQuery,
    category: selectedCategory,
  })

  const { mutate: toggleStatus } = useToggleMenuStatus()

  const { mutate: upsertItem, isPending: isSaving } = useUpsertMenu(
    formMode,
    closeModal,
  )

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Restaurant Menu</h1>
        <button
          onClick={() => openModal("add")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <BiPlus size={20} /> Add New Dish
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <BiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search dishes..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
        <select
          className="border border-gray-200 rounded-lg px-4 py-2 bg-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          value={selectedCategory}
          onChange={(e) => {
            setCategory(e.target.value)
            setPage(1) // Reset page on category change
          }}
        >
          <option value="all">All Categories</option>
          {categoriesData?.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table Container */}
      <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 uppercase text-xs font-bold text-gray-600 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Icon</th>
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-20 text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading menu items...</span>
                    </div>
                  </td>
                </tr>
              ) : menuData?.data?.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-20 text-gray-500">
                    No items found matching your filters.
                  </td>
                </tr>
              ) : (
                menuData?.data.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <img
                        src={item.image}
                        className="h-12 w-12 rounded-md object-cover border bg-gray-100"
                        alt={item.name}
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {item.category?.name || "Uncategorized"}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-gray-700">
                      {item.hasSizes ? (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          Multiple
                        </span>
                      ) : (
                        `₹${item.basePrice}`
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <ToggleButton
                        item={item}
                        changeStatus={() => toggleStatus(item._id)}
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openModal("edit", item)}
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors"
                        title="Edit Item"
                      >
                        <MdEdit size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
          <span className="text-sm text-gray-600">
            Page <span className="font-bold text-gray-900">{page}</span> of{" "}
            <span className="font-bold text-gray-900">
              {menuData?.totalPages || 1}
            </span>
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-2 border rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-all shadow-sm"
            >
              <MdChevronLeft size={24} />
            </button>
            <button
              disabled={page >= (menuData?.totalPages || 1)}
              onClick={() => setPage(page + 1)}
              className="p-2 border rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-all shadow-sm"
            >
              <MdChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Upsert Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <MenuItemForm
            mode={formMode}
            initialData={selectedItem}
            categories={categoriesData || []}
            onClose={closeModal}
            onSubmit={(data) => upsertItem(data)}
            isLoading={isSaving}
          />
        </div>
      )}
    </div>
  )
}

export default Menu
