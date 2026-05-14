import { create } from "zustand"

export const useStaffStore = create((set, get) => ({
  // STATE
  // pagination and filtering
  searchQuery: "",
  selectedRole: "",
  page: 1,
  // model
  open: false,
  //Actions
  openModal: () => set({ open: true }),
  closeModal: () => set({ open: false }),
  setSearchQuery: (query) => set({ searchQuery: query, page: 1 }),
  setSelectedRole: (role) => set({ selectedRole: role, page: 1 }),
  setPage: (page) => set({ page }),
}))
