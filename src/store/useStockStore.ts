import { create } from 'zustand';
import { FilterConfig, Stock } from '@/types/stock';

interface StockStore {
  // Universe & Derived Data
  stocks: Stock[];
  searchQuery: string;
  activeFilters: FilterConfig[];
  selectedSymbol: string | null;

  // Actions
  setStocks: (stocks: Stock[]) => void;
  setSearchQuery: (query: string) => void;
  addFilter: (filter: FilterConfig) => void;
  removeFilter: (filterId: string) => void;
  clearAllFilters: () => void;
  setSelectedSymbol: (symbol: string | null) => void;
}

export const useStockStore = create<StockStore>((set) => ({
  stocks: [],
  searchQuery: '',
  activeFilters: [],
  selectedSymbol: null,

  setStocks: (stocks) => set({ stocks }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  addFilter: (filter) =>
    set((state) => ({
      activeFilters: [...state.activeFilters.filter((f) => f.id !== filter.id), filter],
    })),
  removeFilter: (filterId) =>
    set((state) => ({
      activeFilters: state.activeFilters.filter((f) => f.id !== filterId),
    })),
  clearAllFilters: () => set({ activeFilters: [] }),
  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),
}));
