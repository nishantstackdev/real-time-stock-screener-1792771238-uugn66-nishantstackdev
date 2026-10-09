export type Sector = 
  | 'IT' | 'Banking' | 'Pharma' | 'Auto' | 'FMCG' 
  | 'Metal' | 'Energy' | 'Realty' | 'Telecom' | 'Infrastructure' 
  | 'Media' | 'Others';

export interface Stock {
  symbol: string;
  companyName: string;
  sector: Sector;
  industry: string;
  marketCapCategory: 'Large Cap' | 'Mid Cap' | 'Small Cap' | 'Micro Cap';
  indexMembership: string[];
  
  // Price Data
  lastPrice: number;
  previousClose: number;
  dayOpen: number;
  dayHigh: number;
  dayLow: number;
  changePercent: number;
  changeAbsolute: number;
  volume: number;
  avgVolume20D: number;
  week52High: number;
  week52Low: number;

  // Fundamentals
  marketCap: number; // INR Crores
  pe: number | null;
  pb: number;
  dividendYield: number;
  eps: number;
  roe: number;
  roce: number;
  debtToEquity: number;
  currentRatio: number;
  promoterHolding: number;
  revenueGrowthYoY: number;
  profitGrowthYoY: number;

  // Technicals
  rsi14: number;
  sma50: number;
  sma200: number;
  beta: number;
  atr: number;
  macdSignal: 'Bullish' | 'Bearish' | 'Neutral';
  bollingerPosition: 'Above' | 'Within' | 'Below';
  volumeVsAvg: 'Below' | 'Above' | '2x' | '3x';
}

export type FilterOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'between' | 'in' | 'notIn' | 'contains';

export interface FilterConfig {
  id: string;
  field: keyof Stock;
  operator: FilterOperator;
  value: number | string | boolean | number[] | string[];
  enabled: boolean;
}
