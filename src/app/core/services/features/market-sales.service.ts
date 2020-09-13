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
    return this.idbService.putCommon(this.resource, new MarketSales(data), this.marketSalesOnlyId);
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
        // TODO
        // if (stock && !stock.lastLocalUpdate) {
        //   /* If lastLocalUpdate is missing, it means that there's no stock in IDB
        //   and that the stock has been fetched from server, so we need to put it in IDB */
        //   this.put(new Stock(stock));
        // }
      });
    } else {
      // TODO : error, offline
    }
  }
}
