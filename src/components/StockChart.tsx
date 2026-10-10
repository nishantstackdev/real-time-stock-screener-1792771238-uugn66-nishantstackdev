'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, CandlestickSeries, LineSeries, HistogramSeries } from 'lightweight-charts';

interface StockChartProps {
  symbol: string;
  basePrice: number;
}

type IndicatorType = 'SMA' | 'EMA' | 'Bollinger' | 'RSI' | 'Volume';

export default function StockChart({ symbol, basePrice }: StockChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndicator, setActiveIndicator] = useState<IndicatorType>('SMA');

  // Generate dummy OHLC data based on basePrice
  const generateOHLCData = (startPrice: number) => {
    const data = [];
    let price = startPrice;
    const now = Math.floor(Date.now() / 1000);
    const daySec = 86400;

    for (let i = 60; i >= 0; i--) {
      const time = now - i * daySec;
      const change = (Math.random() - 0.48) * (price * 0.02);
      const open = price;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * (price * 0.01);
      const low = Math.min(open, close) - Math.random() * (price * 0.01);
      price = close;

      data.push({
        time: time as any,
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume: Math.floor(Math.random() * 50000 + 10000),
      });
    }
    return data;
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart: IChartApi = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#9CA3AF',
      },
      grid: {
        vertLines: { color: '#374151' },
        horzLines: { color: '#374151' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 380,
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22C55E',
      downColor: '#EF4444',
      borderVisible: false,
      wickUpColor: '#22C55E',
      wickDownColor: '#EF4444',
    });

    const ohlcData = generateOHLCData(basePrice);
    candlestickSeries.setData(ohlcData);

    // 1. Simple Moving Average (SMA)
    if (activeIndicator === 'SMA') {
      const smaData = ohlcData.map((d, index, arr) => {
        if (index < 10) return { time: d.time, value: d.close };
        const slice = arr.slice(index - 10, index);
        const sum = slice.reduce((acc, curr) => acc + curr.close, 0);
        return { time: d.time, value: Number((sum / 10).toFixed(2)) };
      });

      const smaSeries = chart.addSeries(LineSeries, { color: '#3B82F6', lineWidth: 2 });
      smaSeries.setData(smaData);
    }

    // 2. Exponential Moving Average (EMA)
    if (activeIndicator === 'EMA') {
      let k = 2 / (10 + 1);
      let emaVal = ohlcData[0].close;
      const emaData = ohlcData.map((d) => {
        emaVal = (d.close * k) + (emaVal * (1 - k));
        return { time: d.time, value: Number(emaVal.toFixed(2)) };
      });

      const emaSeries = chart.addSeries(LineSeries, { color: '#A855F7', lineWidth: 2 });
      emaSeries.setData(emaData);
    }

    // 3. Bollinger Bands
    if (activeIndicator === 'Bollinger') {
      const upperData = [];
      const lowerData = [];
      for (let i = 0; i < ohlcData.length; i++) {
        if (i < 10) continue;
        const slice = ohlcData.slice(i - 10, i);
        const sma = slice.reduce((acc, curr) => acc + curr.close, 0) / 10;
        const variance = slice.reduce((acc, curr) => acc + Math.pow(curr.close - sma, 2), 0) / 10;
        const stdDev = Math.sqrt(variance);

        upperData.push({ time: ohlcData[i].time, value: Number((sma + (2 * stdDev)).toFixed(2)) });
        lowerData.push({ time: ohlcData[i].time, value: Number((sma - (2 * stdDev)).toFixed(2)) });
      }

      const upperSeries = chart.addSeries(LineSeries, { color: '#EC4899', lineWidth: 1.5 });
      const lowerSeries = chart.addSeries(LineSeries, { color: '#EC4899', lineWidth: 1.5 });
      upperSeries.setData(upperData);
      lowerSeries.setData(lowerData);
    }

    // 4. RSI (Relative Strength Index Subplot simulation)
    if (activeIndicator === 'RSI') {
      const rsiData = ohlcData.map((d, index) => {
        const rsiVal = 30 + Math.abs(Math.sin(index) * 40); // Simulated smooth RSI
        return { time: d.time, value: Number(rsiVal.toFixed(2)) };
      });

      const rsiSeries = chart.addSeries(LineSeries, { color: '#EAB308', lineWidth: 2 });
      rsiSeries.setData(rsiData);
    }

    // 5. Volume Profile / Volume Bars
    if (activeIndicator === 'Volume') {
      const volumeData = ohlcData.map((d) => ({
        time: d.time,
        value: d.volume,
        color: d.close >= d.open ? '#22C55E88' : '#EF444488',
      }));

      const volumeSeries = chart.addSeries(HistogramSeries, {
        priceFormat: { type: 'volume' },
        priceScaleId: '', // Overlay on main chart
      });
      volumeSeries.setData(volumeData);
    }

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [symbol, basePrice, activeIndicator]);

  return (
    <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight">{symbol} - Price Chart</h2>
          <p className="text-xs text-gray-500">Interactive Technical Indicators & Overlays</p>
        </div>
        
        {/* Indicator Selection Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(['SMA', 'EMA', 'Bollinger', 'RSI', 'Volume'] as IndicatorType[]).map((ind) => (
            <button
              key={ind}
              onClick={() => setActiveIndicator(ind)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                activeIndicator === ind
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      <div ref={chartContainerRef} className="w-full h-[380px]" />
    </div>
  );
}