import { PRODUCT_CATEGORIES } from '../../utils/enums';

export class MarketSales {
  marketId: string;
  marketName: string;
  sales: any;
  categories: PRODUCT_CATEGORIES[];

  constructor(obj?: MarketSales) {
    Object.assign(this, obj);
  }
}
