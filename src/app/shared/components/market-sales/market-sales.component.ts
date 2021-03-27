import { MarketSalesService } from '../../../core/services/features/market-sales.service';
import { PRODUCT_CATEGORIES as PC, STOCK_CATEGORIES as SC } from '../../../utils/enums';
import { MarketSales } from '../../models/market-sales.model';

export abstract class MarketSalesComponent {
  categories: SC[] = [];
  marketSales: MarketSales | undefined;

  constructor(protected readonly marketSalesService: MarketSalesService) {
    this.loadMarketSales();
  }

  abstract marketNotReadyHandler(): void;

  updateCategories() {
    if (this.marketSales && this.marketSales.categories) {
      this.categories = this.marketSales.categories.map((category) => {
        switch (category) {
          case PC.FROZEN:
            return SC.SMALL_FREEZER;
          case PC.PASTEURIZED:
            return SC.PASTEURIZED_FOR_MARKET;
          case PC.FRESH:
          default:
            return SC.FRESH;
        }
      });
    } else {
      this.categories = [];
    }
  }

  protected loadMarketSales() {
    this.marketSalesService.getCurrentMarketSales().subscribe((marketSales) => {
      this.marketSales = new MarketSales(marketSales);
      if (!this.marketSales.categories || !this.marketSales.categories.length) {
        this.marketNotReadyHandler();
      } else {
        this.updateCategories();
      }
    });
  }
}
