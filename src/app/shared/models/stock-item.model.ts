import { STOCK_CATEGORIES } from '../../utils/enums';

export class StockItem {
  category: STOCK_CATEGORIES;
  productId: string;
  quantity: number;
  order: number;

  constructor(obj?: StockItem) {
    Object.assign(this, obj);
  }
}
