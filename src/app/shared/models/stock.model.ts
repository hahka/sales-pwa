import { StockItem } from './stock-item.model';

export class Stock {
  id: string;
  stock: StockItem[] = [];
  lastUpdate: string;

  prepareForIdb() {
    return this;
  }
}
