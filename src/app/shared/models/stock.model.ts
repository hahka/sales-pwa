import { StockItem } from './stock-item.model';

export class Stock {
  id: string;
  stock: StockItem[];

  prepareForIdb() {
    return this;
  }
}
