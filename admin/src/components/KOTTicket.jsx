import React from 'react';

const KOTTicket = ({ order }) => {
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="w-80 bg-white border-2 border-dashed border-gray-400 p-4 shadow-md font-mono">
      {/* Header: Order Number & Type */}
      <div className="text-center border-b-2 border-black pb-2 mb-2">
        <h2 className="text-2xl font-bold">KOT: #{order.orderNumber}</h2>
        <p className="uppercase font-semibold text-sm bg-black text-white inline-block px-2">
          {order.orderType}
        </p>
        <p className="text-xs mt-1 text-gray-600">
          Ordered At: {formatTime(order.createdAt)}
        </p>
      </div>

      {/* Customer Info */}
      <div className="mb-3 text-sm">
        <p><strong>Cust:</strong> {order.customer.name}</p>
        {order.customer.address !== "Takeaway Order" && (
            <p className="truncate"><strong>Addr:</strong> {order.customer.address}</p>
        )}
      </div>

      {/* Items List */}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-black text-sm">
            <th className="py-1 w-12">QTY</th>
            <th className="py-1">ITEM [SIZE]</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item._id} className="border-b border-gray-200">
              <td className="py-2 text-xl font-bold">x{item.quantity}</td>
              <td className="py-2">
                <span className="font-bold block text-sm uppercase">{item.name}</span>
                {item.size !== "base" && (
                  <span className="text-xs italic text-gray-600">Size: {item.size}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer */}
      <div className="mt-4 pt-2 border-t-2 border-black text-center italic text-xs">
        <p>Kitchen Copy - Preparing</p>
      </div>
    </div>
  );
};

export default KOTTicket;