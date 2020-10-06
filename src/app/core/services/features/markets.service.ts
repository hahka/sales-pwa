import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { Market } from 'src/app/shared/models/market.model';
import { IdbStoresEnum } from '../../../utils/enums';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class MarketsService extends ApiService<Market> {
  resource = IdbStoresEnum.MARKETS;
  offlineRights = {
    read: true,
    manage: false,
  };

  idbSearch(data: Market, keyword: string): boolean {
    return data.name.toUpperCase().indexOf(keyword.toUpperCase()) !== -1;
  }

  async synchronizeDown() {
    if (navigator.onLine) {
      await this.idbService.clearObjectStore(IdbStoresEnum.MARKETS);
      let marketsSub: Subscription;
      marketsSub = this.getAll().subscribe((markets) => {
        if (marketsSub && !marketsSub.closed) {
          marketsSub.unsubscribe();
        }
        markets.forEach((market) => {
          const marketForIdb = new Market(market);
          this.idbService.put(IdbStoresEnum.MARKETS, marketForIdb, market.id);
        });
      });
    } else {
      // TODO : error, offline
    }
  }
}
