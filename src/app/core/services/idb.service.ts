import { Injectable } from '@angular/core';
import { SearchDto } from '../../shared/models/api/search-dto.model';
import { Market } from '../../shared/models/market.model';
import { Product } from '../../shared/models/product.model';
import { IdbStoresEnum } from '../../utils/enums';
import { Page, PageRequest } from './api';
import { IdbCommonService } from './idb-common.service';

@Injectable({
  providedIn: 'root',
})
export class IdbService<T extends Market | Product> extends IdbCommonService<T> {
  constructor() {
    super();
  }

  public async put(store: IdbStoresEnum, data: T, id?: string) {
    let dataId = id;
    if (!dataId) {
      dataId = Date.now().toString();
      data.id = dataId;
    }

    return super.putCommon(store, data.prepareForIdb() as any, dataId);
  }

  public async search(
    storeName: IdbStoresEnum,
    pageRequest: PageRequest<T>,
    _dto: SearchDto,
    idbSearch: (data: any, keyword: string) => boolean,
  ): Promise<Page<any>> {
    await super.connectToIDB();
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
