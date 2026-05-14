import { useState } from "react"

const inputClass =
  "w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"

function OrderForm() {
  const [formMode, setFormMode] = useState("delivery")

  return (
    <div className="space-y-8">
      {/* Segmented Control */}
      <div className="flex p-1 bg-gray-100 rounded-xl w-full max-w-md mx-auto">
        <button
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
            formMode === "delivery"
              ? "bg-white shadow-sm text-primary"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setFormMode("delivery")}
        >
          Delivery
        </button>
        <button
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
            formMode === "takeaway"
              ? "bg-white shadow-sm text-primary"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setFormMode("takeaway")}
        >
          Takeaway
        </button>
      </div>

      <form className="space-y-6 bg-white p-2">
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+91 00000 00000"
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {formMode === "delivery" && (
          <section className="animate-in fade-in slide-in-from-top-2">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Shipping Address
            </h2>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Address Details
              </label>
              <textarea
                rows="3"
                placeholder="Flat no, Building, Street name..."
                className={inputClass}
              />
            </div>
          </section>
        )}

        <button className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
          Complete Order
        </button>
      </form>
    </div>
  )
}

export default OrderForm
