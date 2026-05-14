import { create } from "zustand"

const useCategoryStore = create((set) => ({
  // Filter & Pagination State
  searchTerm: "",
  statusFilter: "all",
  currentPage: 1,

  // Modal & Form State
  isFormVisible: false,
  formMode: "add",
  initialData: null,

  // Actions
  setSearchTerm: (term) => set({ searchTerm: term, currentPage: 1 }),
  setStatusFilter: (status) => set({ statusFilter: status, currentPage: 1 }),
  setPage: (page) => set({ currentPage: page }),

  openForm: (mode, data = null) =>
    set({
      isFormVisible: true,
      formMode: mode,
      initialData: data,
    }),

  closeForm: () =>
    set({
      isFormVisible: false,
      initialData: null,
    }),
}))

export default useCategoryStore
