import { Injectable } from '@angular/core';
import { DBSchema, IDBPDatabase, openDB } from 'idb';
import { BaseModel } from '../../shared/models/api/base.model';
import { SearchDto } from '../../shared/models/api/search-dto.model';
import { Market } from '../../shared/models/market.model';
import { Product } from '../../shared/models/product.model';
import { PageRequest, Page } from './api';

export enum StoresEnum {
  MARKETS = 'markets',
  PRODUCTS = 'products',
}

export enum UnsyncedTables {
  UNSYNCED_MARKETS = 'unsynced_markets',
}

interface MyDB extends DBSchema {
  markets: {
    value: Market;
    key: string;
    indexes: { name: string };
  };
  unsynced_markets: {
    value: Market;
    key: string;
    indexes: { name: string };
  };
  products: {
    value: Product;
    key: string;
    indexes: { name: string };
  };
}

@Injectable({
  providedIn: 'root',
})
export class IdbService<T extends BaseModel> {
  onlineIdb: IDBPDatabase<MyDB>;

  constructor() {
    this.connectToIDB();
  }

  public async connectToIDB() {
    if (!this.onlineIdb) {
      this.onlineIdb = await openDB<MyDB>('OnlineIdb', 1, {
        upgrade(db) {
          const marketsStore = db.createObjectStore('markets');
          marketsStore.createIndex('name', 'name');
          const unsyncedMarketsStore = db.createObjectStore('unsynced_markets');
          unsyncedMarketsStore.createIndex('name', 'name');
        },
      });
    }
  }

  public async disconnectFromIDB() {
    this.onlineIdb.close();
  }

  public async getAll(store: StoresEnum) {
    await this.connectToIDB();

    return this.onlineIdb.getAll(store);
  }

  public async getById(store: StoresEnum, id: string) {
    await this.connectToIDB();

    return this.onlineIdb.get(store, id);
  }

  public async put(store: StoresEnum, data: any, id?: string) {
    await this.connectToIDB();
    let dataId = id;
    if (!dataId) {
      dataId = Date.now().toString();
      data.id = dataId;
    }
    await this.onlineIdb.put(store, data, dataId);

    return this.onlineIdb.get(store, dataId);
  }

  public async search(
    storeName: StoresEnum,
    _pageRequest: PageRequest<T>,
    _dto: SearchDto,
  ): Promise<Page<any>> {
    await this.connectToIDB();
    // const store = this.onlineIdb.transaction(storeName).store.index('name');
    // let cursor = await store.openCursor();
    const data = await this.onlineIdb.getAll(storeName);

    return {
      data,
      pagination: { page: 0, length: data.length, total: data.length },
    };
  }
}
