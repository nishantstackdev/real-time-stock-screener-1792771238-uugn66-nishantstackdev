import { Stock, Sector } from '@/types/stock';

const SECTORS: Sector[] = ['IT', 'Banking', 'Pharma', 'Auto', 'FMCG', 'Metal', 'Energy', 'Realty', 'Telecom', 'Infrastructure', 'Media', 'Others'];

export function generateMockStocks(count = 5000): Stock[] {
  return Array.from({ length: count }, (_, i) => {
    const sector = SECTORS[i % SECTORS.length];
    const marketCap = Math.floor(Math.random() * 200000) + 100;
    
    let marketCapCategory: Stock['marketCapCategory'] = 'Micro Cap';
    if (marketCap > 50000) marketCapCategory = 'Large Cap';
    else if (marketCap > 10000) marketCapCategory = 'Mid Cap';
    else if (marketCap > 1000) marketCapCategory = 'Small Cap';

    const price = +(Math.random() * 4500 + 50).toFixed(2);
    const changePercent = +((Math.random() * 12) - 6).toFixed(2);
    const changeAbsolute = +((price * changePercent) / 100).toFixed(2);

    return {
      symbol: `STOCK_${i + 1}`,
      companyName: `${sector} Company ${i + 1}`,
      sector,
      industry: `${sector} Sub-Sector`,
      marketCapCategory,
      indexMembership: marketCap > 50000 ? ['NIFTY 50'] : ['NIFTY SMALLCAP'],
      lastPrice: price,
      previousClose: +(price - changeAbsolute).toFixed(2),
      dayOpen: +(price - (Math.random() * 10)).toFixed(2),
      dayHigh: +(price + (Math.random() * 15)).toFixed(2),
      dayLow: +(price - (Math.random() * 15)).toFixed(2),
      changePercent,
      changeAbsolute,
      volume: Math.floor(Math.random() * 5000000) + 10000,
      avgVolume20D: Math.floor(Math.random() * 3000000) + 10000,
      week52High: +(price * 1.3).toFixed(2),
      week52Low: +(price * 0.7).toFixed(2),
      marketCap,
      pe: +(Math.random() * 50 + 8).toFixed(2),
      pb: +(Math.random() * 8 + 0.5).toFixed(2),
      dividendYield: +(Math.random() * 4).toFixed(2),
      eps: +(Math.random() * 100 + 5).toFixed(2),
      roe: +(Math.random() * 30 + 2).toFixed(2),
      roce: +(Math.random() * 35 + 5).toFixed(2),
      debtToEquity: +(Math.random() * 2).toFixed(2),
      currentRatio: +(Math.random() * 3 + 0.5).toFixed(2),
      promoterHolding: +(Math.random() * 50 + 25).toFixed(2),
      revenueGrowthYoY: +(Math.random() * 40 - 5).toFixed(2),
      profitGrowthYoY: +(Math.random() * 50 - 10).toFixed(2),
      rsi14: Math.floor(Math.random() * 60) + 20,
      sma50: +(price * 0.98).toFixed(2),
      sma200: +(price * 0.92).toFixed(2),
      beta: +(Math.random() * 1.5 + 0.5).toFixed(2),
      atr: +(price * 0.02).toFixed(2),
      macdSignal: i % 3 === 0 ? 'Bullish' : i % 3 === 1 ? 'Bearish' : 'Neutral',
      bollingerPosition: 'Within',
      volumeVsAvg: 'Above',
    };
  });
}
