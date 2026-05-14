import { useState, useEffect } from "react"
import useCategoryStore from "../store/useCategoryStore"
import {
  useGetAllCategories,
  useUpsertCategory,
  useToggleCategoryStatus,
} from "../react-query/queriesAndMutations"
import { MdEdit, MdChevronLeft, MdChevronRight } from "react-icons/md"
import { BiPlus, BiSearch } from "react-icons/bi"
import CategoryForm from "../components/CategoryForm"
import ToggleButton from "../components/ToggleButton"

function Category() {
  // 1. Zustand Store State
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    currentPage,
    setPage,
    isFormVisible,
    openForm,
    closeForm,
    formMode,
    initialData,
  } = useCategoryStore()

  // 2. Local search state for debouncing
  const [localSearch, setLocalSearch] = useState(searchTerm)

  useEffect(() => {
    const handler = setTimeout(() => setSearchTerm(localSearch), 400)
    return () => clearTimeout(handler)
  }, [localSearch, setSearchTerm])

  // 3. Data Fetching Hook (Fixed the previous mistake here)
  const { data: categoryData, isLoading } = useGetAllCategories({
    page: currentPage,
    search: searchTerm,
    status: statusFilter,
  })
  console.log("data from category page", categoryData)
  // 4. Mutations
  const { mutate: toggleStatus } = useToggleCategoryStatus()

  // Note: Pass closeForm as a callback to the mutation to close modal on success
  const { mutate: upsertCategory, isPending: isSaving } = useUpsertCategory(
    formMode,
    closeForm,
  )

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Menu Categories</h2>
          <p className="text-gray-500">
            Organize and manage your restaurant menu sections
          </p>
        </div>
        <button
          onClick={() => openForm("add")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-all shadow-md font-semibold"
        >
          <BiPlus size={22} /> Add New Category
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="relative flex-1">
          <BiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search category name..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
        <select
          className="border border-gray-200 rounded-lg px-4 py-2 bg-white outline-none cursor-pointer focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="true">Active Only</option>
          <option value="false">Inactive Only</option>
        </select>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Icon</th>
                <th className="px-6 py-4">Category Name</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-20 text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading categories...</span>
                    </div>
                  </td>
                </tr>
              ) : categoryData?.data?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-20 text-gray-500">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categoryData?.data.map((cat) => (
                  <tr
                    key={cat._id}
                    className="hover:bg-blue-50/30 group transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="h-12 w-12 rounded-lg border border-gray-200 flex items-center justify-center bg-gray-50 text-2xl overflow-hidden shadow-sm">
                        {cat.icon?.startsWith("http") ? (
                          <img
                            className="h-full w-full object-cover"
                            src={cat.icon}
                            alt={cat.name}
                          />
                        ) : (
                          <span>{cat.icon || "📁"}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {cat.name}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm max-w-xs truncate">
                      {cat.desc || "No description provided"}
                    </td>
                    <td className="px-6 py-4">
                      <ToggleButton
                        item={cat}
                        changeStatus={() => toggleStatus(cat._id)}
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openForm("edit", cat)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit Category"
                      >
                        <MdEdit size={22} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <span className="text-sm text-gray-600">
            Page <span className="font-bold text-gray-900">{currentPage}</span>{" "}
            of{" "}
            <span className="font-bold text-gray-900">
              {categoryData?.totalPages || 1}
            </span>
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1 || isLoading}
              onClick={() => setPage(currentPage - 1)}
              className="p-2 border rounded-lg bg-white disabled:opacity-40 hover:bg-gray-50 transition-all shadow-sm"
            >
              <MdChevronLeft size={24} />
            </button>
            <button
              disabled={
                currentPage >= (categoryData?.totalPages || 1) || isLoading
              }
              onClick={() => setPage(currentPage + 1)}
              className="p-2 border rounded-lg bg-white disabled:opacity-40 hover:bg-gray-50 transition-all shadow-sm"
            >
              <MdChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {isFormVisible && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm p-4">
          <CategoryForm
            formMode={formMode}
            initialData={initialData}
            closeForm={closeForm}
            onSubmit={(data) => upsertCategory(data)}
            isLoading={isSaving}
          />
        </div>
      )}
    </div>
  )
}

export default Category
