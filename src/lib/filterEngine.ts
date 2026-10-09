import { Stock, FilterConfig } from '@/types/stock';

export function filterStocks(stocks: Stock[], filters: FilterConfig[], searchQuery: string): Stock[] {
  if (!stocks || stocks.length === 0) return [];

  const query = searchQuery.trim().toLowerCase();

  return stocks.filter((stock) => {
    // 1. Search Query Filter (Symbol or Company Name)
    if (query) {
      const matchesSymbol = stock.symbol.toLowerCase().includes(query);
      const matchesName = stock.companyName.toLowerCase().includes(query);
      if (!matchesSymbol && !matchesName) return false;
    }

    // 2. Multi-Criteria Combinatorial Filters
    for (const filter of filters) {
      if (!filter.enabled) continue;

      const fieldValue = stock[filter.field];
      const targetValue = filter.value;

      switch (filter.operator) {
        case 'eq':
          if (fieldValue !== targetValue) return false;
          break;

        case 'gte':
          if (typeof fieldValue === 'number' && typeof targetValue === 'number') {
            if (fieldValue < targetValue) return false;
          }
          break;

        case 'lte':
          if (typeof fieldValue === 'number' && typeof targetValue === 'number') {
            if (fieldValue > targetValue) return false;
          }
          break;

        case 'between':
          if (
            typeof fieldValue === 'number' &&
            Array.isArray(targetValue) &&
            typeof targetValue[0] === 'number' &&
            typeof targetValue[1] === 'number'
          ) {
            if (fieldValue < targetValue[0] || fieldValue > targetValue[1]) return false;
          }
          break;

        case 'in':
          if (Array.isArray(targetValue)) {
            // Convert both to string for safe comparison
            const strValue = String(fieldValue);
            const strTargetArray = targetValue.map(String);
            if (!strTargetArray.includes(strValue)) return false;
          }
          break;
      }
    }

    return true; // Sab pass hua toh stock include hoga
  });
}
