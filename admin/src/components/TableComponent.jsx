import React from "react";
import { Rect, Circle, Group, Text } from "react-konva";

const TableComponent = ({ table, onTableClick }) => {
  // 1. Calculate table dimensions
  const getTableSize = (table) => {
    const baseSize = 60;
    const extraPerPerson = 15;
    if (table.shape === "rect") {
      const width = baseSize + (Math.ceil(table.capacity / 2) - 1) * extraPerPerson * 2;
      return { width, height: baseSize };
    } else {
      const radius = baseSize / 2 + (table.capacity > 4 ? (table.capacity - 4) * 8 : 0);
      return { radius };
    }
  };

  // 2. Calculate chair positions
  const getChairPositions = (table, size) => {
    const chairs = [];
    const chairSize = 14;
    const padding = 6;

    if (table.shape === "rect") {
      const chairsPerSide = Math.ceil(table.capacity / 2);
      for (let i = 0; i < table.capacity; i++) {
        const isBottom = i >= chairsPerSide;
        const colIndex = i % chairsPerSide;
        const spacing = size.width / chairsPerSide;
        const xPos = colIndex * spacing + spacing / 2 - chairSize / 2;
        const yPos = isBottom ? size.height + padding : -chairSize - padding;
        chairs.push({ x: xPos, y: yPos });
      }
    } else {
      for (let i = 0; i < table.capacity; i++) {
        const angle = (i * 2 * Math.PI) / table.capacity;
        const xPos = (size.radius + padding + chairSize / 2) * Math.cos(angle);
        const yPos = (size.radius + padding + chairSize / 2) * Math.sin(angle);
        chairs.push({ x: xPos - chairSize / 2, y: yPos - chairSize / 2 });
      }
    }
    return chairs;
  };

  const size = getTableSize(table);
  const chairs = getChairPositions(table, size);
  const themeColor = table.isOccupied ? "#EF4444" : "#10B981";

  return (
    <Group
      x={table.x}
      y={table.y}
      rotation={table.rotation}
      onClick={() => onTableClick(table)}
      onTap={() => onTableClick(table)} // Mobile support
    >
      {/* Chairs */}
      {chairs.map((pos, idx) => (
        <Rect
          key={`chair-${table._id}-${idx}`}
          x={pos.x}
          y={pos.y}
          width={14}
          height={14}
          fill="#9CA3AF"
          stroke="#4B5563"
          strokeWidth={1}
          cornerRadius={3}
        />
      ))}

      {/* Main Table Body */}
      {table.shape === "circle" ? (
        <Circle
          radius={size.radius}
          fill={themeColor}
          stroke="#1F2937"
          strokeWidth={2}
          shadowBlur={4}
        />
      ) : (
        <Rect
          width={size.width}
          height={size.height}
          fill={themeColor}
          stroke="#1F2937"
          strokeWidth={2}
          cornerRadius={8}
          shadowBlur={4}
        />
      )}

      {/* Label */}
      <Text
        text={table.tableNumber}
        width={table.shape === "circle" ? size.radius * 2 : size.width}
        offsetX={table.shape === "circle" ? size.radius : 0}
        align="center"
        y={table.shape === "circle" ? -7 : size.height / 2 - 7}
        fill="white"
        fontStyle="bold"
        fontSize={14}
        listening={false}
      />
    </Group>
  );
};

export default TableComponent;