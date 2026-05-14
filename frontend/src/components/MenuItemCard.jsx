import React, { useState } from "react"
import { useCartStore } from "../store/useCartStore"
// 1. Import the icons
import { HiPlus, HiMinus } from "react-icons/hi"

function MenuItemCard({ item }) {
  const {
    addToCart,
    updateItemQuantity,
    getCartItemQuantity,
    generateCartItemId,
  } = useCartStore()

  const [selectedSize, setSelectedSize] = useState(
    item.hasSizes && item.sizes.length > 0 ? item.sizes[0] : null,
  )

  const currentCartItemId = generateCartItemId(
    item._id,
    selectedSize?.sizeName || "base",
  )
  const quantityInCart = getCartItemQuantity(currentCartItemId)
  const displayPrice = selectedSize ? selectedSize.price : item.basePrice

  return (
    <div className="group bg-surface rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-accent p-4 grid grid-cols-5 gap-4">
      {/* Left Content */}
      <div className="col-span-3 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-primary bg-accent px-2 py-0.5 rounded-md">
              {item.category?.name || "Menu"}
            </span>
          </div>

          <h3 className="text-xl font-extrabold text-text leading-tight">
            {item.name}
          </h3>
          <p className="text-sm text-text opacity-70 line-clamp-2 mt-1 mb-3">
            {item.description}
          </p>

          {item.hasSizes && (
            <div className="flex flex-wrap gap-2 mt-2">
              {item.sizes.map((size) => (
                <button
                  key={size._id || size.sizeName}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 text-xs font-medium rounded-full border transition-all duration-200 ${
                    selectedSize?.sizeName === size.sizeName
                      ? "bg-primary text-surface border-primary shadow-md"
                      : "bg-surface text-text opacity-80 border-accent hover:border-primary"
                  }`}
                >
                  {size.sizeName}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4">
          <p className="text-2xl font-black text-text">₹{displayPrice}</p>
        </div>
      </div>

      {/* Right Content */}
      <div className="col-span-2 relative flex flex-col items-center justify-center">
        <div className="relative w-full aspect-square overflow-hidden rounded-xl shadow-inner bg-accent">
          <img
            src={item.image || "https://via.placeholder.com/150"}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        <div className="absolute -bottom-2 w-[85%] flex justify-center">
          {quantityInCart > 0 ? (
            <div className="flex items-center justify-between w-full bg-primary text-surface rounded-lg shadow-lg overflow-hidden border border-primary">
              {/* Minus Button */}
              <button
                onClick={() =>
                  updateItemQuantity(currentCartItemId, quantityInCart - 1)
                }
                className="p-2 hover:bg-black/10 transition-colors flex items-center justify-center"
                aria-label="Decrease quantity"
              >
                <HiMinus className="w-4 h-4 stroke-2" />
              </button>

              <span className="font-black text-sm tabular-nums">
                {quantityInCart}
              </span>

              {/* Plus Button */}
              <button
                onClick={() =>
                  updateItemQuantity(currentCartItemId, quantityInCart + 1)
                }
                className="p-2 hover:bg-black/10 transition-colors flex items-center justify-center"
                aria-label="Increase quantity"
              >
                <HiPlus className="w-4 h-4 stroke-2" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(item, selectedSize)}
              className="w-full bg-primary text-surface font-bold py-2 rounded-lg shadow-lg hover:brightness-110 hover:-translate-y-1 transition-all active:scale-95 text-sm uppercase tracking-tight flex items-center justify-center gap-2"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MenuItemCard
