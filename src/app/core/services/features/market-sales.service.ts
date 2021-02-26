import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, from, Observable, of, throwError } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
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
    private readonly toastrService: ToastrService,
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

  synchronizeUp() {
    if (navigator.onLine) {
      return this.getClosedMarketSales().pipe(
        filter(TypeHelper.isNotNullOrUndefined),
        switchMap((marketSales) => {
          return marketSales.length > 0
            ? forkJoin(
                marketSales.map((marketSale) => {
                  return this.httpClient
                    .post<MarketSales>(this.getFormattedUrl(), MarketSales.toValidDto(marketSale))
                    .pipe(
                      catchError((error) => {
                        this.toastrService.error(`Erreur lors de l'enovi des ventes au serveur`);

                        return throwError(error);
                      }),
                      filter((result) => !!result.id),
                      switchMap(() =>
                        this.idbService.deleteByID(this.resource, marketSale.id as string),
                      ),
                    );
                }),
              )
            : of(undefined);
        }),
      );
    }

    // TODO : error, offline
    return of(undefined);
  }

  private getClosedMarketSales(): Observable<MarketSales[] | undefined> {
    return from(this.idbService.getAll(this.resource) as Promise<MarketSales[] | undefined>).pipe(
      map((results) => results && results.filter((r) => r.isClosed)),
    );
  }
}
