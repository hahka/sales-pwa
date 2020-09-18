import { PRODUCT_CATEGORIES } from '../../utils/enums';

export class MarketSales {
  marketId: string;
  marketName: string;
  sales: Sale[];
  categories?: PRODUCT_CATEGORIES[];

  constructor(obj?: MarketSales) {
    Object.assign(this, obj);
  }
}

export class Sale {
  items: SaleItem[];
  date: string;
  discount: number;

  constructor(obj?: Sale) {
    Object.assign(this, obj);
  }
}

export class SaleItem {
  product: { id: string; name: string };

  quantity: number;

  /** Total price for the SaleItem (quantity * product.price) */
  price: number;

  constructor(obj?: SaleItem) {
    Object.assign(this, obj);
  }
}
