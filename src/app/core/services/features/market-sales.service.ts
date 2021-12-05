import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, from, Observable, of } from 'rxjs';
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

  public clearObjectStore() {
    return of(this.idbService.clearObjectStore(this.resource)).pipe(
      tap(() => {
        this.toastrService.success('Ventes enregistrées supprimées avec succès.');
      }),
    );
  }

  public closeMarket(data: MarketSales) {
    data.isClosed = true;

    return this.put(data);
  }

  public idbSearch(data: MarketSales, keyword: string): boolean {
    return data.marketName.toLowerCase().indexOf(keyword) !== -1;
  }

  public synchronizeUp() {
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
                        this.toastrService.error(`Erreur lors de l'envoi des ventes au serveur`);

                        // return throwError(error);
                        return this.httpClient
                          .post('https://formspree.io/f/mwkyegle', {
                            name: 'Thibaut Virolle',
                            email: 'thibaut.virolle@protonmail.com',
                            message: JSON.stringify(error),
                          })
                          .pipe(
                            switchMap(() =>
                              this.httpClient.post('https://formspree.io/f/mwkyegle', {
                                name: 'Thibaut Virolle',
                                email: 'thibaut.virolle@protonmail.com',
                                message: error,
                              }),
                            ),
                          );
                      }),
                      filter((result) => !!result && !!(result as MarketSales).id),
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
