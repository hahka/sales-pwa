import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { pluck, take } from 'rxjs/operators';
import { SearchDto } from 'src/app/shared/models/api/search-dto.model';
import { Detail, Page, PageRequest } from '.';
import { MarketSales } from '../../../shared/models/market-sales.model';
import { Market } from '../../../shared/models/market.model';
import { Product } from '../../../shared/models/product.model';
import { IdbStoresEnum } from '../../../utils/enums';
import { EnvironmentService } from '../environment/environment.service';
import { IdbService } from '../idb.service';
import { ResourceUrlHelper } from './resource-url-helper';

@Injectable({
  providedIn: 'root',
})
export abstract class ApiService<
  T extends Product | Market | MarketSales
> extends ResourceUrlHelper {
  /** API base endpoint for resource */
  abstract resource: IdbStoresEnum;

  abstract offlineRights: {
    read: boolean;
    manage: boolean;
  };

  constructor(
    protected readonly environmentService: EnvironmentService,
    protected readonly httpClient: HttpClient,
    protected readonly idbService: IdbService<T>,
  ) {
    super(environmentService);
  }

  abstract idbSearch(data: T, keyword: string): boolean;

  /**
   * Archives/Unarchives a resource corresponding to the given id
   * @param id Id of the resource to archive
   * @param unarchive Wether we want to unarchive or archive the resource
   */
  public archiveById(id: string, unarchive?: boolean): Observable<T> {
    return this.httpClient
      .patch<Detail<T>>(
        `${this.getFormattedUrl()}/${!!unarchive ? 'unarchive' : 'archive'}/${id}`,
        {},
      )
      .pipe(take(1), pluck('data'));
  }

  /**
   * Deletes a resouce corresponding to the given id
   * @param id Id of the wanted resource
   * @deprecated use archiveResourceById(id) instead
   */
  deleteById(id: string): Observable<any> {
    // TODO: type
    return this.httpClient.delete<any>(`${this.getFormattedUrl()}/${id}`);
  }

  /**
   * Fetches a resouce corresponding to the given id
   * @param id Id of the wanted resource
   */
  getById(id: string): Observable<T> {
    if (navigator.onLine) {
      return this.httpClient.get<Detail<T>>(`${this.getFormattedUrl()}/${id}`).pipe(pluck('data'));
    }

    return from(this.idbService.getById(this.resource, id) as Promise<any>);
  }

  /**
   * Posts or patches a resource via API
   * @param data The data to patch
   */
  public postOrPatch(data: T): Observable<T> {
    const dataId = data.id;
    delete data.id;
    if (navigator.onLine) {
      let apiCall$: Observable<T>;
      if (!dataId) {
        apiCall$ = this.httpClient.post<T>(`${this.getFormattedUrl()}`, data);
      } else {
        apiCall$ = this.httpClient.patch<T>(`${this.getFormattedUrl()}/${dataId}`, data);
      }

      return apiCall$.pipe(take(1));
    }

    return from(this.idbService.put(this.resource, data, dataId) as Promise<any>);
  }

  /** Fetches all resources from the API for the given resource */
  public getAll(): Observable<T[]> {
    if (navigator.onLine) {
      return this.httpClient.get<T[]>(`${this.getFormattedUrl()}`);
    }

    return from(this.idbService.getAll(this.resource) as Promise<any>);
  }

  /**
   * Fetches resources from the api with some filter applied
   * @param pageRequest The parameters to paginate and sort filtered resources
   * @param dto The DTO to filter resources on indexed fields
   */
  public search(pageRequest: PageRequest<T>, dto: SearchDto): Observable<Page<T>> {
    if (navigator.onLine) {
      return this.httpClient.post<Page<T>>(`${this.getFormattedUrl()}/search`, {
        ...pageRequest,
        ...dto,
      });
    }

    return from(
      this.idbService.search(this.resource, pageRequest, dto, this.idbSearch) as Promise<any>,
    );
  }

  public canManage() {
    return navigator.onLine || (this.offlineRights && this.offlineRights.manage);
  }
}
