import React, { useEffect, useState } from 'react';
import { MdClose, MdCloudUpload } from 'react-icons/md';
const emptyFormData = {
    name: "",
    price: 25,
    icon: "",
    isActive: true
  }
  import API from '../api/axios';
function AddOnForm({closeForm,AddNewAddOn,initialData,formMode,EditAddOn}) {
  const [formData, setFormData] = useState(emptyFormData);
  
  useEffect(()=>{
    if(formMode == "edit" && initialData){
        setFormData(initialData)
    }else{
        setFormData(emptyFormData)
    }
  },[])
  

  function HandleChange(e) {
    const { name, value, type, checked } = e.target;
    // Checkboxes need special handling for the 'checked' property
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  function HandleSubmit(e) {

    e.preventDefault(); // Added 'e' here
    try{
    if(formMode == "add"){
        AddNewAddOn(formData);
    }else{
        EditAddOn(formData,initialData._id)
    }
    
    setFormData({
    name: "",
    price: 25,
    icon: "",
    isActive: true
  })
}catch(err){
    alert(err.message)
}finally{
    closeForm()
}
  }

  return (
    <div className='bg-white border border-gray-200 shadow-xl rounded-xl w-full max-w-md overflow-hidden font-sans'>
      {/* Header */}
      <div className='flex items-center justify-between bg-gray-50 border-b border-gray-200 p-5'>
        <h2 className='text-xl font-bold text-gray-800'>{formMode == "edit" ? "Edit Add-On" : "Create Add-On"}</h2>
        <button onClick={closeForm} type='button' className="text-gray-500 hover:text-red-500 transition-colors">
          <MdClose size={24} />
        </button>
      </div>

      <form onSubmit={HandleSubmit} className='p-6 space-y-5'>
        {/* Name and Price Row */}
        <div className='grid gap-4 grid-cols-2'>
          <div className='flex flex-col gap-1.5'>
            <label htmlFor="name" className="text-sm font-semibold text-gray-700">Name</label>
            <input
              value={formData.name}
              onChange={HandleChange}
              type="text"
              name="name"
              placeholder='e.g. Paneer'
              className='w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all'
            />
          </div>
          <div className='flex flex-col gap-1.5'>
            <label htmlFor="price" className="text-sm font-semibold text-gray-700">Price (₹)</label>
            <input
              value={formData.price}
              onChange={HandleChange}
              type='number'
              name="price"
              className='w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all'
            />
          </div>
        </div>

        {/* Icon URL */}
        <div className='flex flex-col gap-1.5'>
          <label htmlFor="icon" className="text-sm font-semibold text-gray-700">Icon Image URL</label>
          <textarea
            value={formData.icon}
            onChange={HandleChange}
            name="icon"
            placeholder='https://example.com/image.png'
            className='w-full border border-gray-300 rounded-lg py-2 px-3 h-20 focus:ring-2 focus:ring-blue-500 outline-none transition-all'
          />
        </div>

        {/* Preview and Status */}
        <div className='flex items-center gap-6 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300'>
          <div className='h-20 w-20 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300'>
            {formData.icon ? (
              <img className='h-full w-full object-cover' src={formData.icon} alt="Preview" />
            ) : (
              <MdCloudUpload size={30} className="text-gray-400" />
            )}
          </div>
          
          <div className='flex-1 space-y-3'>
            <div className='flex items-center gap-3'>
              <input
                id="isActive"
                name="isActive"
                checked={formData.isActive} // Use checked for checkboxes
                onChange={HandleChange}
                type='checkbox'
                className='w-5 h-5 text-blue-600 rounded focus:ring-blue-500'
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">Available for orders</label>
            </div>
            
            <button 
              type='submit' 
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md active:transform active:scale-95'
            >
              Save Add-On
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddOnForm;