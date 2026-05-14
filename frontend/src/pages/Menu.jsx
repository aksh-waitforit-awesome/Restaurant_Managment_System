import React, { useState, useMemo } from "react"
// component
import MenuItemCard from "../components/MenuItemCard"
// cart
import { useCartStore } from "../store/useCartStore"
// icons
import { HiViewGrid, HiOutlineShoppingBag } from "react-icons/hi"
// link
import { Link } from "react-router-dom"
// store for active category
import useCategoryStore from "../store/useCategoryStore"
// query
import {
  useGetCategories,
  useGetMenu,
} from "../react-query/queriesAndMutations"
const Menu = () => {
  const { selectedCategory, setSelectedCategory } = useCategoryStore()
  const { cart, getCartTotalPrice } = useCartStore()

  // Data Fetching
  const { data: menuItems, isLoading: menuLoading } = useGetMenu()

  const { data: categories, isLoading: catLoading } = useGetCategories()
  console.log(menuItems)
  console.log(categories)
  // Memoized Filter Logic
  const filteredItems = useMemo(() => {
    if (!selectedCategory) return menuItems
    return menuItems?.filter((item) => item.category._id === selectedCategory)
  }, [selectedCategory, menuItems])

  if (menuLoading || catLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    )

  return (
    <div className="max-w-[1600px] mx-auto min-h-screen bg-background flex flex-col md:flex-row">
      {/* 1st COLUMN: Small Category Sidebar (Slider/Scroll) */}
      <aside className="w-full md:w-24 lg:w-32 bg-surface border-r border-accent sticky top-0 md:h-screen flex md:flex-col overflow-x-auto md:overflow-y-auto no-scrollbar z-20 p-2 gap-4">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`flex flex-col items-center min-w-[70px] p-2 rounded-xl transition-all ${!selectedCategory ? "bg-primary/10 text-primary" : "text-text opacity-60"}`}
        >
          <div
            className={`p-3 rounded-full mb-1 ${!selectedCategory ? "bg-primary text-white" : "bg-accent"}`}
          >
            <HiViewGrid />
          </div>
          <span className="text-[10px] font-bold uppercase">All</span>
        </button>

        {categories?.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setSelectedCategory(cat._id)}
            className={`flex flex-col items-center min-w-[70px] p-2 rounded-xl transition-all ${selectedCategory === cat._id ? "bg-primary/10 text-primary" : "text-text opacity-60"}`}
          >
            <img
              src={cat.icon}
              alt=""
              className={`w-12 h-12 rounded-full object-cover mb-1 border-2 ${selectedCategory === cat._id ? "border-primary" : "border-transparent"}`}
            />
            <span className="text-[10px] font-bold uppercase text-center leading-tight">
              {cat.name}
            </span>
          </button>
        ))}
      </aside>

      {/* 2nd COLUMN: Main Menu Section (Biggest) */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">
            {selectedCategory
              ? categories?.find((c) => c._id === selectedCategory)?.name
              : "Full Menu"}
          </h1>
          <p className="text-text opacity-50 text-sm">
            {filteredItems?.length || 0} items found
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems?.map((item) => (
            <MenuItemCard key={item._id} item={item} />
          ))}
        </div>
      </main>

      {/* 3rd COLUMN: Cart Section (Medium - Disappears on Mobile) */}
      <aside className="hidden lg:block w-80 lg:w-96 bg-surface border-l border-accent p-6 sticky top-0 h-screen overflow-y-auto">
        <h2 className="text-2xl font-black mb-6">Your Order</h2>
        {cart.length > 0 ? (
          <div className="flex flex-col h-[calc(100%-100px)]">
            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.cartItemId} className="flex gap-3 items-center">
                  <img
                    src={item.image}
                    className="w-12 h-12 rounded-lg object-cover"
                    alt=""
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold leading-tight">
                      {item.name}
                    </p>
                    <p className="text-xs opacity-50">x{item.quantity}</p>
                    <p className="text-sm font-medium text-primary">
                      {item.size}
                    </p>
                  </div>
                  <p className="font-bold text-sm">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>
            <div className="pt-6 border-t border-accent mt-4">
              <div className="flex justify-between font-black text-xl mb-4">
                <span>Total</span>
                <span>₹{getCartTotalPrice()}</span>
              </div>
              <Link
                to="/cart"
                className="block w-full bg-primary text-center text-white font-black py-4 rounded-xl hover:brightness-110"
              >
                PROCEED TO CHECKOUT
              </Link>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-30">
            <HiOutlineShoppingBag size={48} />
            <p className="mt-2 font-bold">Your cart is empty</p>
          </div>
        )}
      </aside>

      {/* MOBILE FLOATING CART BUTTON */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-[90%]">
        <Link
          to="/cart"
          className="bg-primary text-white flex items-center justify-between px-6 py-4 rounded-2xl shadow-2xl shadow-primary/40 animate-bounce-subtle"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <HiOutlineShoppingBag size={24} />
              <span className="absolute -top-2 -right-2 bg-text text-surface text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-primary">
                {cart.length}
              </span>
            </div>
            <span className="font-black uppercase tracking-widest text-sm">
              View Cart
            </span>
          </div>
          <span className="font-black text-lg">₹{getCartTotalPrice()}</span>
        </Link>
      </div>
    </div>
  )
}

export default Menu
