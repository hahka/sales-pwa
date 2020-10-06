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
  static upgradeToV1(db: IDBPDatabase<MyDB>) {
    const marketsStore = db.createObjectStore(IdbStoresEnum.MARKETS);
    marketsStore.createIndex('nameSortable', 'nameSortable');
    const productsStore = db.createObjectStore(IdbStoresEnum.PRODUCTS);
    productsStore.createIndex('nameSortable', 'nameSortable');
  }

  static upgradeToV2(db: IDBPDatabase<MyDB>) {
    db.createObjectStore(IdbStoresEnum.STOCK);
    db.createObjectStore(IdbStoresEnum.MARKET_SALES);
  }

  onlineIdb: IDBPDatabase<MyDB>;

  databaseName = 'OnlineIdb';
  databaseVersion = 2;

  constructor() {
    this.connectToIDB();
  }

  public async connectToIDB() {
    if (!this.onlineIdb) {
      this.onlineIdb = await openDB<MyDB>(this.databaseName, this.databaseVersion, {
        upgrade(db, oldVersion, newVersion) {
          if (newVersion) {
            let currentVersion = oldVersion;

            while (currentVersion < newVersion) {
              switch (currentVersion) {
                case 0:
                  IdbCommonService.upgradeToV1(db);
                  break;
                case 1:
                  IdbCommonService.upgradeToV2(db);
                  break;
                default:
                  break;
              }

              currentVersion++;
            }
          }
        },
      });
    }
  }

  public async putCommon(store: IdbStoresEnum, data: T, id?: string) {
    const dataId = id || Date.now().toString();
    await this.onlineIdb.put(store, data, dataId);

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

  public async deleteByID(store: IdbStoresEnum, id: string) {
    await this.connectToIDB();

    return this.onlineIdb.delete(store, id);
  }

  public clearObjectStore(storeName: IdbStoresEnum): Promise<void> {
    return this.onlineIdb.clear(storeName);
  }
}
