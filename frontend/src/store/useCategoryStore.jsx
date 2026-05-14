import { create } from "zustand"
const useCategoryStore = create((set) => ({
  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}))

export default useCategoryStore
