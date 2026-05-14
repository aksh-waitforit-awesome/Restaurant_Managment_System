import React, { useState, useEffect } from 'react';
import { MdClose, MdAdd, MdDelete, MdImageNotSupported } from 'react-icons/md';

function MenuItemForm({ mode, initialData, categories, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    hasSizes: false,
    basePrice: "",
    sizes: [{ sizeName: "", price: "" }],
    dietary: "Veg",
    image: "" // This stores the URL
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData(initialData);
    }
  }, [mode, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSizeChange = (index, e) => {
    const newSizes = [...formData.sizes];
    newSizes[index][e.target.name] = e.target.value;
    setFormData({ ...formData, sizes: newSizes });
  };

  const addSize = () => setFormData({ ...formData, sizes: [...formData.sizes, { sizeName: "", price: "" }] });
  const removeSize = (index) => setFormData({ ...formData, sizes: formData.sizes.filter((_, i) => i !== index) });

  return (
    <div className='bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
      <div className='flex justify-between p-5 border-b sticky top-0 bg-white z-10'>
        <h2 className='text-xl font-bold text-gray-800'>{mode === "edit" ? "Edit" : "Add"} Menu Item</h2>
        <button onClick={onClose} className="hover:text-red-500 transition-colors"><MdClose size={24} /></button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className='p-6 space-y-6'>
        
        {/* Image Section */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 items-start'>
          <div className='md:col-span-1'>
            <label className='text-sm font-semibold block mb-2'>Item Preview</label>
            <div className='aspect-square w-full rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50'>
              {formData.image ? (
                <img 
                  src={formData.image} 
                  alt="Preview" 
                  className='w-full h-full object-cover'
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Invalid+URL'; }} 
                />
              ) : (
                <div className='text-center text-gray-400'>
                  <MdImageNotSupported size={40} className='mx-auto' />
                  <span className='text-xs'>No Image</span>
                </div>
              )}
            </div>
          </div>

          <div className='md:col-span-2 space-y-4'>
            <div className='flex flex-col gap-1'>
              <label className='text-sm font-semibold'>Image URL</label>
              <input 
                name="image" 
                placeholder="https://example.com/dish.jpg"
                value={formData.image} 
                onChange={handleChange} 
                className='border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none' 
              />
            </div>
            
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-1'>
                <label className='text-sm font-semibold'>Item Name</label>
                <input name="name" value={formData.name} onChange={handleChange} className='border p-2 rounded' required />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='text-sm font-semibold'>Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className='border p-2 rounded' required>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Rest of the form */}
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-semibold'>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className='border p-2 rounded h-24' />
        </div>

        <div className='flex items-center gap-4 p-3 bg-blue-50 border border-blue-100 rounded-lg'>
          <label className='flex items-center gap-2 cursor-pointer'>
            <input type="checkbox" name="hasSizes" checked={formData.hasSizes} onChange={handleChange} className='w-4 h-4' />
            <span className='font-medium text-blue-900'>This item has multiple sizes (e.g. Half/Full)</span>
          </label>
        </div>

        {!formData.hasSizes ? (
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-semibold'>Base Price (₹)</label>
            <input type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} className='border p-2 rounded w-1/3' required />
          </div>
        ) : (
          <div className='space-y-3 bg-gray-50 p-4 rounded-lg'>
            <label className='text-sm font-semibold block'>Sizes & Pricing</label>
            {formData.sizes.map((size, index) => (
              <div key={index} className='flex gap-2 items-center'>
                <input name="sizeName" placeholder="Size (e.g. Full)" value={size.sizeName} onChange={(e) => handleSizeChange(index, e)} className='border p-2 rounded flex-1' required />
                <input name="price" placeholder="Price" type="number" value={size.price} onChange={(e) => handleSizeChange(index, e)} className='border p-2 rounded flex-1' required />
                {formData.sizes.length > 1 && (
                  <button type="button" onClick={() => removeSize(index)} className='text-red-500 hover:bg-red-50 p-1 rounded'><MdDelete size={20} /></button>
                )}
              </div>
            ))}
            <button type="button" onClick={addSize} className='text-blue-600 flex items-center text-sm font-bold hover:underline'><MdAdd /> Add Another Size</button>
          </div>
        )}

        <button type="submit" className='w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-[0.98]'>
          {mode === "edit" ? "Update Menu Item" : "Create Menu Item"}
        </button>
      </form>
    </div>
  );
}

export default MenuItemForm;