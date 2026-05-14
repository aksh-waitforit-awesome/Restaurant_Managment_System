import React, { useState, useEffect } from "react"
import { Stage, Layer, Line, Rect, Circle, Group, Text } from "react-konva"
import TableSidebar from "../components/TableSidebar"
import {
  useGetTables,
  useCreateTable,
  useUpdateTableBulk,
} from "../react-query/queriesAndMutations"

const Floor = () => {
  const [isEditMode, setIsEditMode] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)

  // Local state for dragging/positioning before saving to DB
  const [localTables, setLocalTables] = useState([])

  const gridGap = 40
  const canvasWidth = 1400
  const canvasHeight = 600

  // --- QUERIES & MUTATIONS ---
  const { data: serverData, isLoading: isFetching } = useGetTables()
  const { mutate: createTable } = useCreateTable()
  const { mutate: bulkUpdate, isPending: isSaving } = useUpdateTableBulk(() =>
    setIsEditMode(false),
  )

  // Sync server data to local state
  useEffect(() => {
    if (serverData?.data) {
      setLocalTables(serverData.data)
    }
  }, [serverData])

  // --- DYNAMIC CALCULATIONS ---
  const getTableSize = (table) => {
    const baseSize = 60
    const extraPerPerson = 15
    if (table.shape === "rect") {
      const width =
        baseSize + (Math.ceil(table.capacity / 2) - 1) * extraPerPerson * 2
      return { width, height: baseSize }
    }
    const radius =
      baseSize / 2 + (table.capacity > 4 ? (table.capacity - 4) * 8 : 0)
    return { radius }
  }

  const getChairPositions = (table, size) => {
    const chairs = []
    const chairSize = 14
    const padding = 6

    if (table.shape === "rect") {
      const chairsPerSide = Math.ceil(table.capacity / 2)
      for (let i = 0; i < table.capacity; i++) {
        const isBottom = i >= chairsPerSide
        const colIndex = i % chairsPerSide
        const spacing = size.width / chairsPerSide
        const xPos = colIndex * spacing + spacing / 2 - chairSize / 2
        const yPos = isBottom ? size.height + padding : -chairSize - padding
        chairs.push({ x: xPos, y: yPos })
      }
    } else {
      for (let i = 0; i < table.capacity; i++) {
        const angle = (i * 2 * Math.PI) / table.capacity
        const xPos = (size.radius + padding + chairSize / 2) * Math.cos(angle)
        const yPos = (size.radius + padding + chairSize / 2) * Math.sin(angle)
        chairs.push({ x: xPos - chairSize / 2, y: yPos - chairSize / 2 })
      }
    }
    return chairs
  }

  // --- EVENT HANDLERS ---
  const handleAddTable = (tableData) => {
    createTable({ ...tableData, x: 80, y: 80 })
    setShowSidebar(false)
  }

  const handleDragEnd = (id, e) => {
    const x = Math.round(e.target.x() / gridGap) * gridGap
    const y = Math.round(e.target.y() / gridGap) * gridGap
    setLocalTables((prev) =>
      prev.map((t) => (t._id === id ? { ...t, x, y } : t)),
    )
  }

  const handleCancel = () => {
    setIsEditMode(false)
    setLocalTables(serverData?.data || []) // Revert to server data
  }

  if (isFetching && localTables.length === 0) {
    return (
      <div className="p-10 text-center font-mono">LOADING FLOOR MAP...</div>
    )
  }

  return (
    <div className="flex flex-col h-screen w-full bg-slate-100 font-sans">
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shadow-sm z-20">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Floor Manager</h2>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
            {isEditMode ? "Edit Mode (Snap to Grid)" : "View Mode"}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            disabled={isSaving}
            onClick={() =>
              isEditMode ? bulkUpdate(localTables) : setIsEditMode(true)
            }
            className={`px-5 py-2 rounded-lg font-bold transition-all shadow-sm ${
              isEditMode
                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isSaving
              ? "Saving..."
              : isEditMode
                ? "💾 Save Layout"
                : "✏️ Edit Mode"}
          </button>
          {!isEditMode && (
            <button
              onClick={() => setShowSidebar(true)}
              className="px-5 py-2 bg-white border border-slate-300 rounded-lg font-bold hover:bg-slate-50 transition-all shadow-sm"
            >
              ➕ Add Table
            </button>
          )}
          {isEditMode && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-slate-500 hover:text-red-500 font-bold transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto bg-slate-200 relative cursor-grab active:cursor-grabbing">
          <Stage width={canvasWidth} height={canvasHeight}>
            <Layer>
              {/* Grid Lines */}
              {[...Array(Math.ceil(canvasWidth / gridGap))].map((_, i) => (
                <Line
                  key={`v-${i}`}
                  points={[i * gridGap, 0, i * gridGap, canvasHeight]}
                  stroke="#cbd5e1"
                  strokeWidth={0.5}
                />
              ))}
              {[...Array(Math.ceil(canvasHeight / gridGap))].map((_, i) => (
                <Line
                  key={`h-${i}`}
                  points={[0, i * gridGap, canvasWidth, i * gridGap]}
                  stroke="#cbd5e1"
                  strokeWidth={0.5}
                />
              ))}
            </Layer>

            <Layer>
              {localTables.map((table) => {
                const size = getTableSize(table)
                const chairs = getChairPositions(table, size)
                const isRect = table.shape === "rect"

                return (
                  <Group
                    key={table._id}
                    x={table.x}
                    y={table.y}
                    draggable={isEditMode}
                    onDragEnd={(e) => handleDragEnd(table._id, e)}
                  >
                    {/* CHAIRS */}
                    {chairs.map((chair, index) => (
                      <Rect
                        key={`chair-${index}`}
                        x={chair.x}
                        y={chair.y}
                        width={14}
                        height={14}
                        fill="#cbd5e1"
                        stroke="#94a3b8"
                        strokeWidth={1}
                        cornerRadius={3}
                      />
                    ))}

                    {/* TABLE BODY */}
                    {isRect ? (
                      <Rect
                        width={size.width}
                        height={size.height}
                        fill="#ffffff"
                        stroke={isEditMode ? "#3b82f6" : "#475569"}
                        strokeWidth={2}
                        cornerRadius={4}
                        shadowBlur={isEditMode ? 10 : 2}
                        shadowOpacity={0.2}
                      />
                    ) : (
                      <Circle
                        radius={size.radius}
                        fill="#ffffff"
                        stroke={isEditMode ? "#3b82f6" : "#475569"}
                        strokeWidth={2}
                        shadowBlur={isEditMode ? 10 : 2}
                        shadowOpacity={0.2}
                      />
                    )}

                    <Text
                      text={table.tableNumber}
                      width={isRect ? size.width : size.radius * 2}
                      x={isRect ? 0 : -size.radius}
                      y={isRect ? size.height / 2 - 6 : -6}
                      align="center"
                      fontStyle="bold"
                      fill="#475569"
                      fontSize={12}
                    />
                  </Group>
                )
              })}
            </Layer>
          </Stage>
        </div>

        {showSidebar && (
          <aside className="w-80 h-full bg-white border-l border-slate-200 shadow-xl z-30 p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
            <TableSidebar
              onAdd={handleAddTable}
              onClose={() => setShowSidebar(false)}
            />
          </aside>
        )}
      </main>
    </div>
  )
}

export default Floor
