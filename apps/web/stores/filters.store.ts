import { create } from 'zustand';

export const useFiltersStore = create((set) => ({
  filters: {},
  setFilters: (filters) => set({ filters }),
}));
