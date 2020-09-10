import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Stock } from '../../../shared/models/stock.model';
import { EnvironmentService } from '../environment/environment.service';
import { IdbService, StoresEnum } from '../idb.service';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  resource = StoresEnum.STOCK;
  constructor(
    protected readonly environmentService: EnvironmentService,
    protected readonly httpClient: HttpClient,
    protected readonly idbService: IdbService<Stock>,
  ) {}

  public getStock(): Observable<Stock | null> {
    if (navigator.onLine) {
      return this.httpClient.get<Stock>(`${this.environmentService.apiUrl}${this.resource}`);
    }

    return from(this.idbService.getById(this.resource, 'STOCK') as Promise<Stock>);
  }

  /**
   * Posts or patches a resource via API
   * @param data The data to patch
   */
  public put(data: Stock): Observable<Stock> {
    if (navigator.onLine) {
      let apiCall$: Observable<Stock>;
      apiCall$ = this.httpClient.put<Stock>(
        `${this.environmentService.apiUrl}${this.resource}`,
        data,
      );

      return apiCall$.pipe(take(1));
    }
    data.lastUpdate = new Date().toISOString();

    return from(this.idbService.put(this.resource, data, 'STOCK') as Promise<any>);
  }
}
