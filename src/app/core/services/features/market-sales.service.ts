import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MarketSales } from '../../../shared/models/market-sales.model';
import { IdbStoresEnum } from '../../../utils/enums';
import { EnvironmentService } from '../environment/environment.service';
import { IdbCommonService } from '../idb-common.service';

@Injectable({
  providedIn: 'root',
})
export class MarketSalesService {
  resource = IdbStoresEnum.MARKET_SALES;

  constructor(
    protected readonly environmentService: EnvironmentService,
    protected readonly httpClient: HttpClient,
    protected readonly idbService: IdbCommonService<MarketSales>,
  ) {}

  public getMarketSales(): Observable<MarketSales | undefined> {
    return from(this.idbService.getAll(this.resource) as Promise<MarketSales[] | undefined>).pipe(
      map((results) => {
        return results && results?.find((result) => !result.endDate);
      }),
    );
  }

  /**
   * Posts or patches a resource via API
   * @param data The data to patch
   */
  public put(data: MarketSales) {
    data.id = data.id || Date.now().toString();

    return from(this.idbService.putCommon(this.resource, new MarketSales(data), data.id));
  }

  public closeMarket(data: MarketSales) {
    data.endDate = new Date().toISOString();

    return this.put(data);
  }

  async synchronize() {
    if (navigator.onLine) {
      let stockSub: Subscription;
      stockSub = this.getMarketSales().subscribe((_marketSales) => {
        if (stockSub && !stockSub.closed) {
          stockSub.unsubscribe();
        }
      });
    } else {
      // TODO : error, offline
    }
  }
}
