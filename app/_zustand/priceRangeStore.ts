import { create } from "zustand";

interface PriceRangeState {
  categoryMinPrice: number;
  categoryMaxPrice: number;
  setPriceRange: (minPrice: number, maxPrice: number) => void;
}

export const usePriceRangeStore = create<PriceRangeState>((set) => ({
  categoryMinPrice: 0,
  categoryMaxPrice: 10000,
  setPriceRange: (minPrice, maxPrice) => set({ categoryMinPrice: minPrice, categoryMaxPrice: maxPrice }),
}));
