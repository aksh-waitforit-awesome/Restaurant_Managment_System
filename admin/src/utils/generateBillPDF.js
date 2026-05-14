import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export const generateBillPDF = (data) => {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    const {
      orderNumber, // Added this from the new Order model
      tableNumber,
      items,
      grandTotal,
      //session_id,
      waiter,
      closedAt,
    } = data

    // --- 1. HEADER SECTION ---
    doc.setFontSize(22)
    doc.setTextColor(30, 41, 59)
    doc.text("CURRY CHAPTER", 105, 20, { align: "center" })

    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text("Authentic Indian Cuisine", 105, 26, { align: "center" })

    // --- 2. SESSION & ORDER INFO ---
    doc.setDrawColor(200)
    doc.line(15, 32, 195, 32)

    doc.setFontSize(9)
    doc.setTextColor(40)

    // Prominently display the Order Number
    doc.setFont("helvetica", "bold")
    doc.text(`ORDER NO: #${orderNumber || "N/A"}`, 15, 38)

    doc.setFont("helvetica", "normal")
    doc.text(`Table: ${tableNumber}`, 15, 44)
    doc.text(`Waiter: ${waiter || "Staff"}`, 15, 49)
    //doc.text(`Session: ${session_id?.slice(-6)}`, 15, 54) // Just show last 6 chars for brevity

    const dateStr = closedAt
      ? new Date(closedAt).toLocaleString()
      : new Date().toLocaleString()
    doc.text(`Date: ${dateStr}`, 195, 38, { align: "right" })

    // --- 3. ITEM CONSOLIDATION LOGIC (Stays the same - works great!) ---
    const consolidatedMap = (items || []).reduce((acc, item) => {
      const key = `${item.name}-${item.size}`
      if (!acc[key]) {
        acc[key] = { ...item }
      } else {
        acc[key].quantity += item.quantity
      }
      return acc
    }, {})

    const tableRows = Object.values(consolidatedMap).map((item) => [
      item.name,
      item.size || "Base",
      item.quantity,
      `${Number(item.price).toFixed(2)}`,
      `${(item.price * item.quantity).toFixed(2)}`,
    ])

    // --- 4. TABLE GENERATION ---
    autoTable(doc, {
      startY: 60, // Pushed down slightly for the extra header info
      head: [["Item Description", "Size", "Qty", "Price", "Amount"]],
      body: tableRows,
      theme: "striped",
      headStyles: { fillColor: [30, 41, 59], halign: "center" },
      columnStyles: {
        0: { cellWidth: 80 },
        3: { halign: "right" },
        4: { halign: "right" },
      },
    })

    // --- 5. TOTALS ---
    const finalY = doc.lastAutoTable.finalY + 10
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text(`Grand Total:`, 140, finalY)
    doc.text(`Rs. ${Number(grandTotal).toFixed(2)}`, 195, finalY, {
      align: "right",
    })

    // --- 6. FOOTER ---
    doc.setFontSize(10)
    doc.setFont("helvetica", "italic")
    doc.setTextColor(150)
    doc.text("Thank you for dining at Curry Chapter!", 105, finalY + 20, {
      align: "center",
    })

    const fileName = `Receipt_Order_${orderNumber || tableNumber}.pdf`
    doc.save(fileName)

    return true
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw error
  }
}
