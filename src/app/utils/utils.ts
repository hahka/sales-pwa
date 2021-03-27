import { formatDate } from '@angular/common';
import { MarketSales } from '../shared/models/market-sales.model';

export const computeTva = (price: number | undefined) => {
  return (((price || 0) * 5.5) / 100).toFixed(2);
};

export const formatMarketSalesDate = (marketSales?: MarketSales) => {
  if (!marketSales || !marketSales.startDate) {
    return '';
  }

  return `${formatDate(new Date(marketSales.startDate), 'dd MMM yyyy', 'fr')}${
    marketSales.endDate
      ? ` au ${formatDate(new Date(marketSales.endDate), 'dd MMM yyyy', 'fr')}`
      : ''
  }`;
};
