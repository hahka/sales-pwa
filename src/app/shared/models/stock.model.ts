import { StockItem } from './stock-item.model';

export class Stock {
  static staticCleanItems(items: StockItem[]): StockItem[] {
    return items.map((stockItem) => {
      return new StockItem({
        category: stockItem.category,
        order: stockItem.order,
        productId: stockItem.productId,
        quantity: stockItem.quantity,
      });
    });
  }

  id: string;
  stock: StockItem[] = [];

  /** Timestamp of the last update, set by the server */
  lastUpdate: string;

  /** This property is only returned by the local IDB. If missing, data has been returned by the server. */
  lastLocalUpdate?: string;

  constructor(obj?: Stock) {
    Object.assign(this, obj);
  }

  prepareForIdb() {
    return this;
  }

  /**
   * Clean items in order to remove properties (like name) that have been added in order to display more easily the form
   */
  cleanItems() {
    if (this.stock) {
      this.stock = Stock.staticCleanItems(this.stock);
    }
  }
}
