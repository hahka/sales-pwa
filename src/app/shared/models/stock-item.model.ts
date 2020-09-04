import { STOCK_CATEGORIES } from '../../utils/enums';

export class StockItem {
  quantity: number;
  productId: string;
  category: STOCK_CATEGORIES;
}
