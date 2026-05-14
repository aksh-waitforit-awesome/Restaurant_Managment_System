import { useEffect, useState } from "react"
import useWaiterStore from "../store/useWaiterStore"
import { HiViewGrid, HiOutlineShoppingBag, HiX, HiSearch } from "react-icons/hi"
import { MdChevronLeft, MdChevronRight } from "react-icons/md"
import MenuItemCard from "../components/MenuItemCard"
import OrderSummary from "../components/OrderSummary"
import { useGetMenu, useGetCategories } from "../react-query/queriesAndMutations"

function POS() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isOrderOpen, setIsOrderOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const {
    getCartItemCount,
    getCartTotalPrice,
    page,
    limit,
    setSearchQuery,
    setPage,
    searchQuery,
  } = useWaiterStore()

  const cartCount = getCartItemCount()
  const totalPrice = getCartTotalPrice()

  const { data: categoryData, isPending: isCategoryLoading } = useGetCategories()
  const { data: menuData, isPending: isMenuLoading } = useGetMenu({
    page,
    limit,
    category: selectedCategory,
    search: searchQuery,
  })

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchTerm)
      setPage(1)
    }, 400)
    return () => clearTimeout(handler)
  }, [searchTerm, setSearchQuery, setPage])

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId)
    setPage(1)
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* ── DESKTOP CATEGORY SIDEBAR (lg+) ── */}
      <aside className="hidden lg:flex w-24 xl:w-28 bg-white border-r border-gray-200 flex-col overflow-y-auto no-scrollbar z-30 shadow-sm flex-shrink-0">
        <div className="p-4 border-b border-gray-100 mb-2">
          <h1 className="text-xl font-black text-blue-600 text-center">POS</h1>
        </div>
        <div className="flex flex-col p-2 gap-2 items-center">
          <button
            onClick={() => handleCategorySelect(null)}
            className={`flex flex-col items-center p-2 rounded-2xl transition-all duration-200 w-full ${!selectedCategory ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:bg-gray-50"}`}
          >
            <div className={`p-2.5 rounded-xl mb-1 ${!selectedCategory ? "bg-blue-600 text-white shadow-md" : "bg-gray-100"}`}>
              <HiViewGrid size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">All</span>
          </button>
          {categoryData?.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategorySelect(cat._id)}
              className={`flex flex-col items-center p-2 rounded-2xl transition-all w-full ${selectedCategory === cat._id ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:bg-gray-50"}`}
            >
              <img
                src={cat.icon}
                alt={cat.name}
                className={`w-11 h-11 rounded-xl object-cover mb-1 shadow-sm ${selectedCategory === cat._id ? "ring-2 ring-blue-600 scale-105" : "grayscale-[40%]"}`}
              />
              <span className="text-[10px] font-bold uppercase truncate w-full text-center tracking-tighter">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col min-w-0 bg-gray-50 overflow-hidden">

        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-3 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3 flex-shrink-0">
          {/* Mobile logo */}
          <span className="lg:hidden text-lg font-black text-blue-600 flex-shrink-0">POS</span>

          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search dishes or drinks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm"
            />
          </div>

          {/* Date — md+ only */}
          <p className="hidden md:block text-xs text-gray-400 font-medium flex-shrink-0">
            {new Date().toDateString()}
          </p>

          {/* Cart button in header for sm screens */}
          {cartCount > 0 && (
            <button
              onClick={() => setIsOrderOpen(true)}
              className="lg:hidden flex-shrink-0 flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-xl text-sm font-bold transition-all active:scale-95"
            >
              <div className="relative">
                <HiOutlineShoppingBag size={18} />
                <span className="absolute -top-2 -right-2 bg-white text-blue-600 text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black border border-blue-600">
                  {cartCount}
                </span>
              </div>
              <span className="hidden sm:inline">₹{totalPrice}</span>
            </button>
          )}
        </header>

        {/* MOBILE CATEGORY HORIZONTAL SCROLLER (below md, above lg) */}
        <div className="lg:hidden bg-white border-b border-gray-200 flex-shrink-0">
          <div className="flex overflow-x-auto no-scrollbar px-3 py-2 gap-2">
            {/* All */}
            <button
              onClick={() => handleCategorySelect(null)}
              className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${!selectedCategory ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
            >
              <HiViewGrid size={18} />
              <span className="text-[10px] font-bold uppercase tracking-tight">All</span>
            </button>

            {categoryData?.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategorySelect(cat._id)}
                className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${selectedCategory === cat._id ? "bg-blue-50 text-blue-600 ring-1 ring-blue-400" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
              >
                <img
                  src={cat.icon}
                  alt={cat.name}
                  className={`w-7 h-7 rounded-lg object-cover ${selectedCategory === cat._id ? "" : "grayscale-[50%]"}`}
                />
                <span className="text-[10px] font-bold uppercase tracking-tight whitespace-nowrap">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-5 pb-6">
          {isMenuLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {menuData?.data?.map((item) => (
                <MenuItemCard key={item._id} item={item} />
              ))}
            </div>
          )}

          {!isMenuLoading && menuData?.data?.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-sm">No items found in this category.</p>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        <footer className="bg-white border-t border-gray-200 px-3 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between flex-shrink-0">
          <span className="text-xs sm:text-sm font-medium text-gray-500">
            <span className="hidden sm:inline">Showing </span>
            <span className="text-gray-900 font-bold">{menuData?.data?.length || 0}</span>
            <span className="hidden sm:inline"> items</span>
          </span>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm text-gray-600">
              {page} / {menuData?.totalPages || 1}
            </span>
            <div className="flex gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="p-1.5 sm:p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-30 transition-colors"
              >
                <MdChevronLeft size={18} />
              </button>
              <button
                disabled={page >= (menuData?.totalPages || 1)}
                onClick={() => setPage(page + 1)}
                className="p-1.5 sm:p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-30 transition-colors"
              >
                <MdChevronRight size={18} />
              </button>
            </div>
          </div>
        </footer>
      </main>

      {/* ── ORDER SUMMARY SIDEBAR (always visible lg+, drawer on mobile) ── */}

      {/* Backdrop — mobile/tablet only */}
      {isOrderOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsOrderOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:relative inset-y-0 right-0 z-50
          w-[92vw] sm:w-[400px] lg:w-[380px] xl:w-[420px]
          transform transition-transform duration-300 ease-in-out
          ${isOrderOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
          flex-shrink-0
        `}
      >
        <div className="h-full bg-white flex flex-col shadow-2xl lg:shadow-none lg:border-l lg:border-gray-200">
          {/* Mobile close bar */}
          <div className="lg:hidden px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-white flex-shrink-0">
            <h2 className="font-black text-gray-900">Current Order</h2>
            <button
              onClick={() => setIsOrderOpen(false)}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <HiX size={18} />
            </button>
          </div>
          <OrderSummary />
        </div>
      </aside>
    </div>
  )
}

export default POS