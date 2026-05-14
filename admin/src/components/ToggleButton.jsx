import React from "react"

function ToggleButton({ changeStatus, item }) {
  return (
    <div className="flex jusitfy-center items-center gap-3">
      <button
        onClick={() => changeStatus()}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          item?.available ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
            item?.available ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      <span className="text-sm font-medium text-gray-700">
        {item?.available ? "Available" : "Sold Out"}
      </span>
    </div>
  )
}

export default ToggleButton
