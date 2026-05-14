import { create } from "zustand"

/**
 * Waiter Store
 * Manages table sessions, modal states, and the shopping cart for the waiter interface.
 */
const useWaiterStore = create((set, get) => ({
  // --- STATE ---
  selectedTableSessionId: null, // Tracks the active tablesession for a table
  selectedTable: null, // Holds the full table object (number, status, etc.)
  isModalOpen: false, // Controls visibility of the action modal
  modalMode: "Start_Session", // Toggle between 'Start_Session' and 'Close_Session'
  cart: [], // Array of items selected for ordering
  // Filtering and Pagination state could be added here as needed (e.g., searchTerm, currentPage)
  page: 1, // Current page for pagination
  searchQuery: "", // Search term for filtering tables
  limit: 10, // Number of tables to show per page
  // --- TABLE & MODAL ACTIONS ---

  // Sets the current active session ID.
  setSelectedSessionId: (session_id) =>
    set({ selectedTableSessionId: session_id }),

  // Stores the currently interacted-with table.

  setSelectedTable: (table) => set({ selectedTable: table }),

  /**
   * Resets modal state and clears table selection to prevent data leakage
   * between different table interactions.
   */
  closeModal: () =>
    set({
      isModalOpen: false,
      selectedTable: null,
      selectedTableSessionId: null,
    }),

  /**
   * Opens the modal in "Close Session" mode.
   * Populates session ID automatically from the table's current session.
   */
  openCloseModal: (table) =>
    set({
      isModalOpen: true,
      modalMode: "Close_Session",
      selectedTableSessionId: table?.currentSession?._id,
      selectedTable: table,
    }),

  /**
   * Opens the modal in "Start Session" mode for an empty/available table.
   */
  openStartModal: (table) =>
    set({
      isModalOpen: true,
      modalMode: "Start_Session",
      selectedTable: table,
    }),
  // Pagination and search actions could be added here as needed (e.g., setPage, setSearchQuery)

  setPage: (page) => set({ page }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  // --- CART ACTIONS ---

  /**
   * Generates a unique key for cart items based on ID and size.
   * Prevents collisions if the same dish is ordered in different sizes.
   */
  generateCartItemId: (menuItemId, sizeName = "base") => {
    return `${menuItemId}-${sizeName}`
  },

  /**
   * Adds an item to the cart.
   * If the item (with the same size) exists, it increments quantity.
   */
  addToCart: (menuItem, selectedSize = null) => {
    const { cart, generateCartItemId, updateItemQuantity } = get()
    const sizeName = selectedSize?.sizeName || "base"
    const cartItemId = generateCartItemId(menuItem._id, sizeName)

    const existingCartItem = cart.find((item) => item.cartItemId === cartItemId)

    if (existingCartItem) {
      // Logic delegation: reuse updateItemQuantity to keep logic DRY
      updateItemQuantity(cartItemId, existingCartItem.quantity + 1)
    } else {
      // Determine price based on whether the item has multiple size variants
      const price = menuItem.hasSizes ? selectedSize?.price : menuItem.basePrice

      const cartItem = {
        cartItemId,
        menuItemId: menuItem._id,
        name: menuItem.name,
        image: menuItem.image,
        size: sizeName,
        price,
        quantity: 1,
      }

      // Add new item to the front of the array for better UI feedback
      set({ cart: [cartItem, ...cart] })
    }
  },

  /**
   * Updates quantity for a specific cart ID.
   * Automatically removes the item if quantity drops to 0.
   */
  updateItemQuantity: (cartItemId, quantity) => {
    const { cart, removeFromCart } = get()

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

  /**
   * Removes an item from the cart entirely.
   */
  removeFromCart: (cartItemId) => {
    set({
      cart: get().cart.filter((item) => item.cartItemId !== cartItemId),
    })
  },

  /**
   * Wipes the cart (e.g., after a successful order submission).
   */
  clearCart: () => set({ cart: [] }),

  // --- HELPERS (Derived State) ---

  /**
   * Returns the total number of physical items in the cart.
   */
  getCartItemCount: () =>
    get().cart.reduce((total, item) => total + item.quantity, 0),

  /**
   * Calculates the grand total for all items in the cart.
   */
  getCartTotalPrice: () =>
    get().cart.reduce((total, item) => total + item.price * item.quantity, 0),

  /**
   * Gets the quantity of a specific item (used for UI counters).
   */
  getCartItemQuantity: (cartItemId) => {
    const item = get().cart.find((item) => item.cartItemId === cartItemId)
    return item ? item.quantity : 0
  },
}))

export default useWaiterStore
