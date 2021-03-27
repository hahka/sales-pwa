import { PRODUCT_CATEGORIES } from '../../utils/enums';
import { BaseModel } from './api/base.model';

export class MarketSales implements BaseModel {
  static toValidDto(marketSales: MarketSales) {
    return {
      marketId: marketSales.marketId,
      marketName: marketSales.marketName,
      sales: marketSales.sales || [],
      categories: marketSales.categories,
      startDate: marketSales.startDate,
      income: marketSales.income,
      endDate: marketSales.endDate,
    };
  }

  id?: string;
  marketId: string;
  marketName: string;
  sales?: Sale[];
  categories?: PRODUCT_CATEGORIES[];
  startDate: string;
  endDate?: string;
  isClosed: boolean;
  income: number;

  constructor(obj?: MarketSales) {
    Object.assign(this, obj);
  }

  prepareForIdb() {
    return {
      ...this,
    };
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
