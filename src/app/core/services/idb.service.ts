import { Injectable } from '@angular/core';
import { DBSchema, IDBPDatabase, openDB } from 'idb';
import { BaseModel } from '../../shared/models/api/base.model';
import { SearchDto } from '../../shared/models/api/search-dto.model';
import { Market } from '../../shared/models/market.model';
import { Product } from '../../shared/models/product.model';
import { Page, PageRequest } from './api';

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
    indexes: any;
  };
  products: {
    value: Product;
    key: string;
    indexes: any;
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
          marketsStore.createIndex('nameSortable', 'nameSortable');
          const productsStore = db.createObjectStore('products');
          productsStore.createIndex('nameSortable', 'nameSortable');
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

  public async put(store: StoresEnum, data: T, id?: string) {
    await this.connectToIDB();
    let dataId = id;
    if (!dataId) {
      dataId = Date.now().toString();
      data.id = dataId;
    }
    await this.onlineIdb.put(store, data.prepareForIdb(), dataId);

    return this.onlineIdb.get(store, dataId);
  }

  public async search(
    storeName: StoresEnum,
    pageRequest: PageRequest<T>,
    _dto: SearchDto,
    idbSearch: (data: any, keyword: string) => boolean,
  ): Promise<Page<any>> {
    await this.connectToIDB();
    const store = this.onlineIdb.transaction(storeName, 'readonly').store;

    const sort = pageRequest.sort;
    const indexedStore = store.index(sort ? `${sort.field}Sortable` : 'nameSortable');

    let cursor = await indexedStore.openCursor(
      undefined,
      sort && sort.order === -1 ? 'prev' : 'next',
    );

    let total = 0;

    const data = [];
    let dataRemaining = pageRequest.length;
    while (true) {
      if (cursor) {
        const value = cursor.value;

        if (idbSearch(value, _dto.search)) {
          if (dataRemaining > 0) {
            data.push(value);
            dataRemaining -= 1;
          }
          total += 1;
        }
        cursor = await cursor.continue();
      } else {
        break;
      }
    }

    return {
      data,
      pagination: { page: 0, length: data.length, total },
    };
  }
}
