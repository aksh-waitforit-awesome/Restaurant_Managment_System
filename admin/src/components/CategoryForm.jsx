import React, { useEffect, useState } from "react"

const emptyFormData = {
  name: "",
  desc: "",
  icon: "",
  available: true,
}

function CategoryForm({
  formMode,
  closeForm,
  initialData,
  onSubmit, // We'll use a single onSubmit prop for simplicity
  isLoading,
}) {
  const [formData, setFormData] = useState(emptyFormData)

  useEffect(() => {
    if (formMode === "edit" && initialData) {
      setFormData(initialData)
    } else {
      setFormData(emptyFormData)
    }
  }, [formMode, initialData])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const isUrl = (str) =>
    str?.startsWith("http") || str?.startsWith("data:image")

  return (
    <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
        <h2 className="text-xl font-bold text-gray-800">
          {formMode === "edit" ? "Update Category" : "Create New Category"}
        </h2>
        <button
          onClick={closeForm}
          className="text-gray-400 hover:text-red-500 text-2xl"
          disabled={isLoading}
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                Name
              </label>
              <input
                name="name"
                required
                className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                Description
              </label>
              <textarea
                name="desc"
                rows="3"
                className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                value={formData.desc}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                Icon URL / Emoji
              </label>
              <input
                name="icon"
                className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.icon}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 border-2 border-dashed rounded flex items-center justify-center bg-gray-50 overflow-hidden">
                {formData.icon ? (
                  isUrl(formData.icon) ? (
                    <img
                      src={formData.icon}
                      className="h-full w-full object-cover"
                      alt="preview"
                    />
                  ) : (
                    <span className="text-3xl">{formData.icon}</span>
                  )
                ) : (
                  <span className="text-[10px] text-gray-400">Preview</span>
                )}
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="available"
                  className="w-4 h-4 accent-blue-600"
                  checked={formData.available}
                  onChange={handleChange}
                />
                <span className="text-sm font-medium text-gray-700">
                  Active
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={closeForm}
            className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md disabled:bg-blue-300 transition-colors"
          >
            {isLoading
              ? "Saving..."
              : formMode === "edit"
                ? "Save Changes"
                : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  )
}
export default CategoryForm
