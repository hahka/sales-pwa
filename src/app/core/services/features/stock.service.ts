import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Stock } from '../../../shared/models/stock.model';
import { EnvironmentService } from '../environment/environment.service';
import { IdbService, StoresEnum } from '../idb.service';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  resource = StoresEnum.STOCK;

  stockOnlyId = 'STOCK';

  constructor(
    protected readonly environmentService: EnvironmentService,
    protected readonly httpClient: HttpClient,
    protected readonly idbService: IdbService<Stock>,
  ) {}

  public getStock(): Observable<Stock | null> {
    return from(
      (this.idbService.getById(this.resource, this.stockOnlyId) as Promise<Stock>).then(
        (
          /** Stock found in local IDB */
          localStock,
        ) => {
          if (!navigator.onLine || !!localStock) {
            return localStock;
          }

          return this.httpClient
            .get<Stock>(`${this.environmentService.apiUrl}${this.resource}`)
            .toPromise();
        },
      ),
    );
  }

  /**
   * Posts or patches a resource via API
   * @param data The data to patch
   */
  public put(data: Stock): Observable<Stock> {
    if (navigator.onLine) {
      let apiCall$: Observable<Stock>;
      apiCall$ = this.httpClient.put<Stock>(`${this.environmentService.apiUrl}${this.resource}`, {
        stock: data.stock,
      });

      return apiCall$.pipe(
        map((stock) => {
          this.updateLocalStock(stock, true);

          return stock;
        }),
        take(1),
      );
    }

    return this.updateLocalStock(data);
  }

  public getLocalStock() {
    return from(this.idbService.getById(this.resource, this.stockOnlyId) as Promise<Stock>);
  }

  /**
   * Updates local stock without modifying its values, e.g. after an online update, to keep idb up to date.
   */
  public updateLocalStock(stock: Stock, shouldKeepDate = false): Observable<Stock> {
    if (shouldKeepDate) {
      stock.lastLocalUpdate = stock.lastUpdate;
    } else {
      stock.lastLocalUpdate = new Date().toISOString();
    }

    return from(
      this.idbService.put(this.resource, new Stock(stock), this.stockOnlyId) as Promise<Stock>,
    ).pipe(take(1));
  }

  async synchronize() {
    if (navigator.onLine) {
      let stockSub: Subscription;
      stockSub = this.getStock().subscribe((stock) => {
        if (stockSub && !stockSub.closed) {
          stockSub.unsubscribe();
        }
        if (stock && !stock.lastLocalUpdate) {
          /* If lastLocalUpdate is missing, it means that there's no stock in IDB
          and that the stock has been fetched from server, so we need to put it in IDB */
          this.updateLocalStock(new Stock(stock), true);
        }
      });
    } else {
      // TODO : error, offline
    }
  }
}
