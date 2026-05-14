import { create } from 'zustand';

const useMenuStore = create((set) => ({
  // Filter & Pagination State
  searchQuery: "",
  selectedCategory: "all",
  page: 1,

  // Modal State
  isModalOpen: false,
  formMode: "add",
  selectedItem: null,

  // Actions
  setSearchQuery: (query) => set({ searchQuery: query, page: 1 }),
  setCategory: (category) => set({ selectedCategory: category, page: 1 }),
  setPage: (page) => set({ page }),
  
  openModal: (mode, item = null) => set({ 
    isModalOpen: true, 
    formMode: mode, 
    selectedItem: item 
  }),
  
  closeModal: () => set({ 
    isModalOpen: false, 
    selectedItem: null, 
    formMode: "add" 
  }),
}));

export default useMenuStore;