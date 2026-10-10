'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { SlidersHorizontal } from 'lucide-react';
import { generateMockStocks } from '@/lib/mockDataGenerator';
import { useStockStore } from '@/store/useStockStore';
import { filterStocks } from '@/lib/filterEngine';
import DataGrid from '@/components/DataGrid';
import FilterPanel from '@/components/FilterPanel';

const StockChart = dynamic<{ symbol: string; basePrice: number }>(
  () => import('@/components/StockChart'),
  { ssr: false }
);

export default function Home() {
  const { stocks, setStocks, searchQuery, activeFilters, selectedSymbol, setSelectedSymbol } = useStockStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const data = generateMockStocks(5000);
    setStocks(data);
    if (data.length > 0) setSelectedSymbol(data[0].symbol);
  }, [setStocks, setSelectedSymbol]);

  const filteredStocks = useMemo(() => {
    return filterStocks(stocks, activeFilters, searchQuery);
  }, [stocks, activeFilters, searchQuery]);

  const selectedStockObj = useMemo(() => {
    return stocks.find((s) => s.symbol === selectedSymbol) || stocks[0];
  }, [stocks, selectedSymbol]);

  if (!isMounted) return null;

  return (
    <main className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">EquityPulse Screener 🔥</h1>
          <p className="text-xs md:text-sm text-gray-500">Real-time Stock Data Grid with 5,000+ Virtualised Rows & Financial Charting</p>
        </div>

        {/* Mobile/Tablet Filter Toggle Button */}
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="lg:hidden flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md transition"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters {activeFilters.length > 0 ? `(${activeFilters.length})` : ''}</span>
        </button>
      </div>

      {/* Selected Stock Chart */}
      {selectedStockObj && (
        <div className="w-full overflow-hidden">
          <StockChart symbol={selectedStockObj.symbol} basePrice={selectedStockObj.lastPrice} />
        </div>
      )}

      {/* Responsive Layout */}
      <div className="flex gap-6 items-start relative">
        {/* Filter Panel (Drawer on mobile, sticky sidebar on desktop) */}
        <FilterPanel 
          isOpen={isMobileFilterOpen} 
          onClose={() => setIsMobileFilterOpen(false)} 
        />
        
        {/* Data Grid */}
        <div className="w-full overflow-x-auto flex-1">
          <DataGrid data={filteredStocks} />
        </div>
      </div>
    </main>
  );
}