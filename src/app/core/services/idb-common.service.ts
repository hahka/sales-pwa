import { Injectable } from '@angular/core';
import { DBSchema, IDBPDatabase, openDB } from 'idb';
import { MarketSales } from '../../shared/models/market-sales.model';
import { Market } from '../../shared/models/market.model';
import { Product } from '../../shared/models/product.model';
import { Stock } from '../../shared/models/stock.model';
import { IdbStoresEnum } from '../../utils/enums';

interface MyDB extends DBSchema {
  markets: {
    value: Market;
    key: string;
    indexes: any;
  };
  products: {
    value: Product;
    key: string;
    indexes: any;
  };
  stock: {
    value: Stock;
    key: string;
    indexes: any;
  };
  marketSales: {
    value: MarketSales;
    key: string;
    indexes: any;
  };
}

@Injectable({
  providedIn: 'root',
})
export class IdbCommonService<T extends Market | MarketSales | Stock | Product> {
  onlineIdb: IDBPDatabase<MyDB>;

  constructor() {
    this.connectToIDB();
  }

  public async connectToIDB() {
    if (!this.onlineIdb) {
      this.onlineIdb = await openDB<MyDB>('OnlineIdb', 1, {
        upgrade(db) {
          const marketsStore = db.createObjectStore('markets');
          marketsStore.createIndex('nameSortable', 'nameSortable');
          const productsStore = db.createObjectStore('products');
          productsStore.createIndex('nameSortable', 'nameSortable');
          db.createObjectStore('stock');
          db.createObjectStore('marketSales');
        },
      });
    }
  }

  public async putCommon(store: IdbStoresEnum, data: T, id?: string) {
    let dataId = id;
    if (!dataId) {
      dataId = Date.now().toString();
    }
    await this.onlineIdb.put(store, data, id);

    return this.onlineIdb.get(store, dataId);
  }

  public async disconnectFromIDB() {
    this.onlineIdb.close();
  }

  public async getAll(store: IdbStoresEnum) {
    await this.connectToIDB();

    return this.onlineIdb.getAll(store);
  }

  public async getById(store: IdbStoresEnum, id: string) {
    await this.connectToIDB();

    return this.onlineIdb.get(store, id);
  }

  public clearObjectStore(storeName: IdbStoresEnum): Promise<void> {
    return this.onlineIdb.clear(storeName);
  }
}
