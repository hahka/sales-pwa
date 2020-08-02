import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { from, Observable } from 'rxjs';
import { pluck, take } from 'rxjs/operators';
import { BaseModel } from 'src/app/shared/models/api/base.model';
import { SearchDto } from 'src/app/shared/models/api/search-dto.model';
import { Detail, Page, PageRequest } from '.';
import { EnvironmentService } from '../environment/environment.service';
import { IdbService, StoresEnum } from '../idb.service';

@Injectable({
  providedIn: 'root',
})
export abstract class ApiService<T extends BaseModel> {
  /** API base endpoint for resource */
  abstract resource: StoresEnum;

  constructor(
    protected readonly environmentService: EnvironmentService,
    protected readonly httpClient: HttpClient,
    private readonly idbService: IdbService<T>,
  ) {}

  /**
   * Archives/Unarchives a resource corresponding to the given id
   * @param id Id of the resource to archive
   * @param unarchive Wether we want to unarchive or archive the resource
   */
  public archiveById(id: string, unarchive?: boolean): Observable<T> {
    return this.httpClient
      .patch<Detail<T>>(
        `${this.environmentService.apiUrl}${this.resource}/${
          !!unarchive ? 'unarchive' : 'archive'
        }/${id}`,
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
    return this.httpClient.delete<any>(`${this.environmentService.apiUrl}${this.resource}/${id}`);
  }

  /**
   * Fetches a resouce corresponding to the given id
   * @param id Id of the wanted resource
   */
  getById(id: string): Observable<T> {
    if (navigator.onLine) {
      return this.httpClient
        .get<Detail<T>>(`${this.environmentService.apiUrl}${this.resource}/${id}`)
        .pipe(pluck('data'));
    }

    return from(this.idbService.getById(this.resource, id) as Promise<any>);
  }

  /**
   * Posts or patches a resource via API
   * @param data The data to patch
   */
  public postOrPatch(data: BaseModel): Observable<T> {
    const dataId = data.id;
    delete data.id;
    if (navigator.onLine) {
      let apiCall$: Observable<T>;
      if (!dataId) {
        apiCall$ = this.httpClient.post<T>(
          `${this.environmentService.apiUrl}${this.resource}`,
          data,
        );
      } else {
        apiCall$ = this.httpClient.patch<T>(
          `${this.environmentService.apiUrl}${this.resource}/${dataId}`,
          data,
        );
      }

      return apiCall$.pipe(take(1));
    }

    return from(this.idbService.put(this.resource, data, dataId) as Promise<any>);
  }

  /** Fetches all resources from the API for the giver resource */
  public getAll(): Observable<T[]> {
    if (navigator.onLine) {
      return this.httpClient.get<T[]>(`${this.environmentService.apiUrl}${this.resource}`);
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
      return this.httpClient.post<Page<T>>(
        `${this.environmentService.apiUrl}${this.resource}/search`,
        {
          ...pageRequest,
          ...dto,
        },
      );
    }

    return from(this.idbService.search(this.resource, pageRequest, dto) as Promise<any>);
  }
}
