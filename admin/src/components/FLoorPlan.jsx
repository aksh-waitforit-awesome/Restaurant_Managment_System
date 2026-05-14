import React, { useState } from "react"
import { Stage, Layer } from "react-konva"
import { motion, AnimatePresence } from "framer-motion"
import TableComponent from "./TableComponent"
import BookingForm from "./BookingForm" // We will create this next

const FloorPlan = ({ tables, onSessionCreated }) => {
  const [selectedTable, setSelectedTable] = useState(null)

  const handleTableClick = (table) => {
    // Only open sidebar if the table is free
    if (!table.isOccupied) {
      setSelectedTable(table)
    } else {
      console.log("Table is already occupied. Opening session details...")
      // Logic for viewing active session can go here
    }
  }

  return (
    <div className="relative min-h-screen w-full flex overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      {/* Main Floor Area */}
      <div
        className={`transition-all duration-500 ease-in-out ${selectedTable ? "w-2/3" : "w-full"} flex flex-col items-center justify-center p-4`}
      >
        <div className="w-full max-w-[1400px] overflow-x-auto custom-scrollbar pb-6">
          <div className="inline-block relative p-4 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 shadow-2xl">
            <Stage width={2000} height={700}>
              <Layer>
                {tables.map((table) => (
                  <TableComponent
                    key={table._id}
                    table={table}
                    onTableClick={handleTableClick}
                  />
                ))}
              </Layer>
            </Stage>
          </div>
        </div>
      </div>

      {/* Slide-in Sidebar */}
      <AnimatePresence>
        {selectedTable && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-1/3 bg-slate-900/80 backdrop-blur-2xl border-l border-white/10 p-8 shadow-2xl z-50"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">
                Book Table {selectedTable.tableNumber}
              </h2>
              <button
                onClick={() => setSelectedTable(null)}
                className="text-white/50 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <BookingForm
              table={selectedTable}
              onSuccess={() => {
                setSelectedTable(null)
                onSessionCreated() // Refresh data
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
export default FloorPlan
