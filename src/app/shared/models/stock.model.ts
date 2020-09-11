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
}
