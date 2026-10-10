'use client';

import React from 'react';
import { useStockStore } from '@/store/useStockStore';
import { X } from 'lucide-react';

const SECTORS = ['IT', 'Banking', 'Pharma', 'Auto', 'FMCG', 'Metal', 'Energy', 'Realty', 'Telecom'];

interface FilterPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function FilterPanel({ isOpen = true, onClose }: FilterPanelProps) {
  const { searchQuery, setSearchQuery, activeFilters, addFilter, removeFilter, clearAllFilters } = useStockStore();

  const handleSectorChange = (sector: string, isChecked: boolean) => {
    const existingFilter = activeFilters.find((f) => f.id === 'sector_filter');
    let currentSectors: string[] = (existingFilter?.value as string[]) || [];

    if (isChecked) {
      currentSectors = [...currentSectors, sector];
    } else {
      currentSectors = currentSectors.filter((s) => s !== sector);
    }

    if (currentSectors.length > 0) {
      addFilter({
        id: 'sector_filter',
        field: 'sector',
        operator: 'in',
        value: currentSectors,
        enabled: true,
      });
    } else {
      removeFilter('sector_filter');
    }
  };

  const handleMinMarketCap = (val: string) => {
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      addFilter({
        id: 'min_mcap',
        field: 'marketCap',
        operator: 'gte',
        value: num,
        enabled: true,
      });
    } else {
      removeFilter('min_mcap');
    }
  };

  return (
    <>
      {/* Backdrop for mobile drawer */}
      {isOpen && onClose && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs" 
        />
      )}

      {/* Panel Container */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-80 p-4 border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 space-y-6 overflow-y-auto transition-transform duration-300 shadow-2xl lg:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-800">
          <h2 className="font-bold text-lg">Filters</h2>
          <div className="flex items-center gap-2">
            {activeFilters.length > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-red-500 hover:underline font-semibold"
              >
                Clear All
              </button>
            )}
            {/* Close button for mobile */}
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Search Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-gray-500">Search</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Symbol or Name..."
            className="w-full px-3 py-2 text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Market Cap Filter */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-gray-500">Min Market Cap (₹ Cr)</label>
          <input
            type="number"
            placeholder="e.g. 10000"
            onChange={(e) => handleMinMarketCap(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Sector Multi-Select */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-gray-500">Sectors</label>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2">
            {SECTORS.map((sector) => {
              const currentSectors = (activeFilters.find((f) => f.id === 'sector_filter')?.value as string[]) || [];
              const isChecked = currentSectors.includes(sector);

              return (
                <label key={sector} className="flex items-center gap-2 text-sm cursor-pointer hover:text-blue-500">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => handleSectorChange(sector, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{sector}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}