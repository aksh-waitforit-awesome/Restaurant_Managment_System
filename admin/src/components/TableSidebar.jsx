import React, { useState } from 'react';

const TableSidebar = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    tableNumber: '',
    capacity: 4,
    shape: 'rect'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.tableNumber) return alert("Table number is required");
    onAdd(formData);
    onClose(); // Hide sidebar after adding
  };

  return (
    <div style={sidebarContainer}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Configure Table</h3>
        <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>✖</button>
      </div>
      <form onSubmit={handleSubmit} style={formStyle}>
        <label>Table Name/No.</label>
        <input 
          style={inputStyle}
          type="text" 
          placeholder="e.g., T-1" 
          onChange={e => setFormData({...formData, tableNumber: e.target.value})} 
        />
        
        <label>Seating Capacity</label>
        <input 
          style={inputStyle}
          type="number" 
          defaultValue={4} 
          onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} 
        />

        <label>Shape</label>
        <select style={inputStyle} onChange={e => setFormData({...formData, shape: e.target.value})}>
          <option value="rect">Rectangle</option>
          <option value="circle">Circle</option>
        </select>

        <button type="submit" style={addBtnStyle}>Add to Floor</button>
      </form>
    </div>
  );
};

// Styles
const sidebarContainer = { width: '300px', background: '#fff', padding: '20px', borderLeft: '1px solid #ddd', boxShadow: '-2px 0 5px rgba(0,0,0,0.1)', height: '100%' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' };
const inputStyle = { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' };
const addBtnStyle = { padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };

export default TableSidebar;