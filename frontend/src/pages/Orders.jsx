import { Link } from "react-router-dom"
import moment from "moment"
import { Package, ChevronRight, Clock, MapPin, Receipt } from "lucide-react"
import { useGetMyOrders } from "../react-query/queriesAndMutations"

const Orders = () => {
  const { data, isLoading, isError, error } = useGetMyOrders()
  console.log(data)
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] bg-surface">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-primary"></div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex items-center gap-3">
        <span className="font-bold">Error:</span>{" "}
        {error?.message || "Something went wrong"}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-text">
              Order History
            </h2>
          </div>
          <p className="text-text/50 text-sm font-medium">
            Review your past cravings and track active deliveries
          </p>
        </header>

        <div className="space-y-6">
          {data?.map((order) => (
            <div
              key={order._id}
              className="group bg-surface border border-accent rounded-3xl shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 overflow-hidden"
            >
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Left side: Metadata */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs font-black px-3 py-1 bg-accent text-text/70 rounded-full border border-accent">
                      #{order.orderNumber}
                    </span>
                    <span
                      className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                        order.orderStatus === "placed"
                          ? "bg-primary/20 text-primary"
                          : "bg-green-500/10 text-green-500"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                    <span className="text-xs font-bold text-text/40 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {moment(order.createdAt).format("h:mm A • MMM D, YYYY")}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-text flex items-center gap-2">
                      <Receipt className="w-5 h-5 opacity-20" />
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "Item" : "Items"}
                      <span className="text-primary ml-1">
                        ₹{order.totalAmount}
                      </span>
                    </h3>
                    <p className="text-sm text-text/60 flex items-center gap-1 font-medium">
                      <MapPin className="w-4 h-4 opacity-40" />
                      {order.customer.address}
                    </p>
                  </div>
                </div>

                {/* Right side: Summary & Button */}
                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-accent pt-4 md:pt-0">
                  <div className="md:text-right">
                    <p className="text-[10px] uppercase font-black text-text/30 tracking-[0.2em]">
                      Service
                    </p>
                    <p className="text-sm font-bold text-text capitalize">
                      {order.orderType}
                    </p>
                  </div>

                  <Link
                    to={`/order/${order._id}`}
                    className="flex items-center gap-2 bg-primary text-white font-black uppercase tracking-tighter py-3 px-8 rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
                  >
                    Details
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {(!data || data.length === 0) && (
            <div className="text-center py-24 bg-accent/30 rounded-[2rem] border-2 border-dashed border-accent">
              <Package className="w-16 h-16 text-text/10 mx-auto mb-4" />
              <p className="text-text/40 font-black uppercase tracking-widest">
                No orders found yet
              </p>
              <Link
                to="/menu"
                className="text-primary font-bold text-sm mt-2 inline-block hover:underline"
              >
                Start your first order →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Orders
