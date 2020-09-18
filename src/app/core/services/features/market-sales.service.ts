import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, Subscription } from 'rxjs';
import { MarketSales } from '../../../shared/models/market-sales.model';
import { Stock } from '../../../shared/models/stock.model';
import { IdbStoresEnum } from '../../../utils/enums';
import { EnvironmentService } from '../environment/environment.service';
import { IdbCommonService } from '../idb-common.service';

@Injectable({
  providedIn: 'root',
})
export class MarketSalesService {
  resource = IdbStoresEnum.MARKET_SALES;

  marketSalesOnlyId = 'MARKET_SALES';

  constructor(
    protected readonly environmentService: EnvironmentService,
    protected readonly httpClient: HttpClient,
    protected readonly idbService: IdbCommonService<MarketSales>,
  ) {}

  public getMarketSales(): Observable<MarketSales | undefined> {
    return from(
      this.idbService.getById(this.resource, this.marketSalesOnlyId) as Promise<
        MarketSales | undefined
      >,
    );
  }

  /**
   * Posts or patches a resource via API
   * @param data The data to patch
   */
  public put(data: MarketSales) {
    return from(
      this.idbService.putCommon(this.resource, new MarketSales(data), this.marketSalesOnlyId),
    );
  }

  public getLocalStock() {
    return from(this.idbService.getById(this.resource, this.marketSalesOnlyId) as Promise<Stock>);
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
