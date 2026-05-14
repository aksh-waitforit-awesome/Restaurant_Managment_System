import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      generateCartItemId: (menuItem_id, sizeName = "base") =>
        `${menuItem_id}-${sizeName}`,

      addToCart: (menuItem, selectedSize = null) => {
        const { cart, generateCartItemId, updateItemQuantity } = get()
        const size = selectedSize?.sizeName || "base"
        const cartItemId = generateCartItemId(menuItem._id, size)

        const existingCartItem = cart.find(
          (item) => item.cartItemId === cartItemId,
        )

        if (existingCartItem) {
          // Re-use update logic to keep it DRY (Don't Repeat Yourself)
          updateItemQuantity(cartItemId, existingCartItem.quantity + 1)
        } else {
          const price = menuItem.hasSizes
            ? selectedSize?.price
            : menuItem.basePrice

          const cartItem = {
            cartItemId,
            _id: menuItem._id, // Helpful to keep for API calls
            name: menuItem.name,
            image: menuItem.image,
            size,
            price,
            quantity: 1,
          }
          set({ cart: [...cart, cartItem] })
        }
      },

      updateItemQuantity: (cartItemId, quantity) => {
        const { cart, removeFromCart } = get()

        // Developer logic: If quantity is 0 or less, remove it
        if (quantity <= 0) {
          removeFromCart(cartItemId)
          return
        }

        set({
          cart: cart.map((item) =>
            item.cartItemId === cartItemId ? { ...item, quantity } : item,
          ),
        })
      },

      removeFromCart: (cartItemId) => {
        set({
          cart: get().cart.filter((item) => item.cartItemId !== cartItemId),
        })
      },

      clearCart: () => {
        set({ cart: [] })
        localStorage.setItem("cart-storage", [])
      },

      // Helpers (Derived State)
      getCartItemCount: () =>
        get().cart.reduce((total, item) => total + item.quantity, 0),

      getCartTotalPrice: () =>
        get().cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        ),

      getCartItemQuantity: (cartItemId) => {
        const item = get().cart.find((item) => item.cartItemId === cartItemId)
        return item ? item.quantity : 0
      },
    }),
    { name: "cart-storage" },
  ),
)
