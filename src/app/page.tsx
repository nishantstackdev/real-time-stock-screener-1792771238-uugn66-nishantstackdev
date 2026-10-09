'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { generateMockStocks } from '@/lib/mockDataGenerator';
import { useStockStore } from '@/store/useStockStore';
import { filterStocks } from '@/lib/filterEngine';
import DataGrid from '@/components/DataGrid';
import FilterPanel from '@/components/FilterPanel';

// SSR disabled dynamic imports to completely eliminate Next.js prerender hydration errors
const StockChart = dynamic(() => import('@/components/StockChart'), { ssr: false });

export default function Home() {
  const { stocks, setStocks, searchQuery, activeFilters, selectedSymbol, setSelectedSymbol } = useStockStore();
  const [isMounted, setIsMounted] = useState(false);

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

  if (!isMounted) return null; // Hydration mismatch dead-stop

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">EquityPulse Screener 🔥</h1>
        <p className="text-sm text-gray-500">Real-time Stock Data Grid with 5,000+ Virtualised Rows & Financial Charting</p>
      </div>

      {/* Selected Stock Chart */}
      {selectedStockObj && (
        <StockChart symbol={selectedStockObj.symbol} basePrice={selectedStockObj.lastPrice} />
      )}

      {/* Filter + Data Grid */}
      <div className="flex gap-6 items-start">
        <FilterPanel />
        <div className="flex-1">
          <DataGrid data={filteredStocks} />
        </div>
      </div>
    </main>
  );
}
