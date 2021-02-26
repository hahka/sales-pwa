import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, from, Observable, Subscription } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { MarketSales } from '../../../shared/models/market-sales.model';
import { IdbStoresEnum } from '../../../utils/enums';
import { TypeHelper } from '../../../utils/type-helper';
import { ApiService } from '../api/api.service';
import { EnvironmentService } from '../environment/environment.service';
import { IdbService } from '../idb.service';

@Injectable({
  providedIn: 'root',
})
export class MarketSalesService extends ApiService<MarketSales> {
  offlineRights: { read: boolean; manage: boolean };
  resource = IdbStoresEnum.MARKET_SALES;

  constructor(
    protected readonly environmentService: EnvironmentService,
    protected readonly httpClient: HttpClient,
    protected readonly idbService: IdbService<MarketSales>,
  ) {
    super(environmentService, httpClient, idbService);
  }

  public getCurrentMarketSales(): Observable<MarketSales | undefined> {
    return from(this.idbService.getAll(this.resource) as Promise<MarketSales[] | undefined>).pipe(
      map((results) => {
        return results && results?.find((result) => !result.isClosed);
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
    data.isClosed = true;

    return this.put(data);
  }

  idbSearch(data: MarketSales, keyword: string): boolean {
    return data.marketName.toLowerCase().indexOf(keyword) !== -1;
  }

  async synchronizeUp() {
    if (navigator.onLine) {
      this.getClosedMarketSales()
        .pipe(
          filter(TypeHelper.isNotNullOrUndefined),
          filter((marketSales) => !!marketSales && marketSales.length > 0),
          switchMap((marketSales) =>
            forkJoin(
              marketSales.map((marketSale) => {
                return this.httpClient
                  .post<MarketSales>(this.getFormattedUrl(), MarketSales.toValidDto(marketSale))
                  .pipe(
                    tap((results) => console.log(results)),
                    filter((result) => !!result.id),
                    switchMap(() =>
                      this.idbService.deleteByID(this.resource, marketSale.id as string),
                    ),
                  );
              }),
            ),
          ),
        )
        .subscribe();
    } else {
      // TODO : error, offline
    }
  }

  private getClosedMarketSales(): Observable<MarketSales[] | undefined> {
    return from(this.idbService.getAll(this.resource) as Promise<MarketSales[] | undefined>).pipe(
      map((results) => results && results.filter((r) => r.isClosed)),
    );
  }
}
