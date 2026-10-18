'use client';

import React from 'react';
import { useStockStore } from '@/store/useStockStore';
import StockChart from './StockChart';

export default function StockDetailModal() {
  const { selectedSymbol, setSelectedSymbol, stocks } = useStockStore();

  const selectedStock = stocks.find((s) => s.symbol === selectedSymbol);


  if (!selectedStock) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold tracking-tight">{selectedStock.name}</h2>
              <span className="text-xs px-2 py-0.5 rounded font-mono bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                {selectedStock.symbol}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Sector: {selectedStock.sector}</p>
          </div>

          <button
            onClick={() => setSelectedSymbol(null)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Key Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
              <span className="text-xs text-gray-500">LTP (₹)</span>
              <p className="text-base font-bold font-mono mt-1">₹{selectedStock.price.toLocaleString('en-IN')}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
              <span className="text-xs text-gray-500">24h Change</span>
              <p className={`text-base font-bold font-mono mt-1 ${selectedStock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)}%
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
              <span className="text-xs text-gray-500">Market Cap</span>
              <p className="text-base font-bold font-mono mt-1">₹{selectedStock.marketCap} Cr</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
              <span className="text-xs text-gray-500">P/E Ratio</span>
              <p className="text-base font-bold font-mono mt-1">{selectedStock.peRatio}</p>
            </div>
          </div>

          {/* Interactive TradingView Chart */}
          <StockChart symbol={selectedStock.symbol} basePrice={selectedStock.price} />
        </div>
      </div>
    </div>
  );
}