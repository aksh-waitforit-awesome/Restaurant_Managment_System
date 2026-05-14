import React, { useState } from "react"
import useWaiterStore from "../store/useWaiterStore"
import { HiPlus, HiMinus } from "react-icons/hi"

function MenuItemCard({ item }) {
  const {
    addToCart,
    updateItemQuantity,
    getCartItemQuantity,
    generateCartItemId,
  } = useWaiterStore()

  const [selectedSize, setSelectedSize] = useState(
    item.hasSizes && item.sizes.length > 0 ? item.sizes[0] : null,
  )

  const currentCartItemId = generateCartItemId(item._id, selectedSize?.sizeName)
  const quantityInCart = getCartItemQuantity(currentCartItemId)
  const displayPrice = selectedSize ? selectedSize.price : item.basePrice

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-lg transition-all duration-300 overflow-visible relative flex flex-col">

      {/* Image — full width top */}
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-t-2xl bg-gray-50">
        <img
          src={item.image || "https://via.placeholder.com/300"}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category badge */}
        <span className="absolute top-2 left-2 text-[9px] uppercase tracking-wider font-black text-blue-700 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-md shadow-sm">
          {item.category?.name || "Menu"}
        </span>

        {/* Price badge */}
        <span className="absolute top-2 right-2 text-sm font-black text-gray-900 bg-white/95 px-2.5 py-1 rounded-xl shadow-sm">
          ₹{displayPrice}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-3 pb-4 gap-2">

        {/* Name + description */}
        <div>
          <h3 className="font-extrabold text-gray-900 text-sm sm:text-base leading-tight line-clamp-1">
            {item.name}
          </h3>
          <p className="text-[11px] sm:text-xs text-gray-400 line-clamp-2 mt-0.5 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Size selector */}
        {item.hasSizes && item.sizes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.sizes.map((size) => (
              <button
                key={size._id || size.sizeName}
                onClick={() => setSelectedSize(size)}
                className={`px-2 py-0.5 text-[10px] font-bold rounded-md border transition-all duration-150 ${
                  selectedSize?.sizeName === size.sizeName
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-50 text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                {size.sizeName}
              </button>
            ))}
          </div>
        )}

        {/* Spacer to push button to bottom */}
        <div className="flex-1" />

        {/* Add / Quantity control */}
        <div className="mt-1">
          {quantityInCart > 0 ? (
            <div className="flex items-center bg-blue-600 text-white rounded-xl overflow-hidden h-9">
              <button
                onClick={() =>
                  updateItemQuantity(currentCartItemId, Math.max(0, quantityInCart - 1))
                }
                className="flex-1 h-full flex items-center justify-center hover:bg-blue-700 active:bg-blue-800 transition-colors"
              >
                <HiMinus size={14} />
              </button>
              <span className="w-8 text-center font-black text-sm tabular-nums select-none">
                {quantityInCart}
              </span>
              <button
                onClick={() =>
                  updateItemQuantity(currentCartItemId, quantityInCart + 1)
                }
                className="flex-1 h-full flex items-center justify-center hover:bg-blue-700 active:bg-blue-800 transition-colors"
              >
                <HiPlus size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(item, selectedSize)}
              className="w-full h-9 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wide rounded-xl transition-all shadow-sm shadow-blue-200 flex items-center justify-center gap-1.5"
            >
              <HiPlus size={13} />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MenuItemCard