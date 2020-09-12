import { StockItem } from './stock-item.model';

export class Stock {
  id: string;
  stock: StockItem[] = [];
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
      this.stock = this.stock.map((stockItem) => {
        return {
          category: stockItem.category,
          productId: stockItem.productId,
          quantity: stockItem.quantity,
        };
      });
    }
  }
}
