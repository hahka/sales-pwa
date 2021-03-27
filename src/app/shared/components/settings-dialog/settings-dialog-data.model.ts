import { MarketSales } from '../../models/market-sales.model';

export interface SettingsDialogData {
  marketSales: MarketSales;
  forHistory?: boolean;
}
