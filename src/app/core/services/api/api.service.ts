import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { pluck, take } from 'rxjs/operators';
import { BaseModel } from 'src/app/shared/models/api/base.model';
import { SearchDto } from 'src/app/shared/models/api/search-dto.model';
import { ApiResult, Detail, Page, PageRequest } from '.';
import { EnvironmentService } from '../environment/environment.service';

@Injectable({
  providedIn: 'root',
})
export abstract class ApiService<T> {
  /** API base endpoint for resource */
  abstract resource: string;

  constructor(
    protected readonly environmentService: EnvironmentService,
    protected readonly httpClient: HttpClient,
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
  deleteById(id: string): Observable<ApiResult> {
    return this.httpClient.delete<ApiResult>(
      `${this.environmentService.apiUrl}${this.resource}/${id}`,
    );
  }

  /**
   * Fetches a resouce corresponding to the given id
   * @param id Id of the wanted resource
   */
  getById(id: string): Observable<T> {
    return this.httpClient
      .get<Detail<T>>(`${this.environmentService.apiUrl}${this.resource}/${id}`)
      .pipe(pluck('data'));
  }

  /**
   * Posts or patches a resource via API
   * @param resource The resource to patch
   */
  public postOrPatch(resource: BaseModel): Observable<T> {
    let apiCall$: Observable<T>;
    const resourceId = resource.id;
    delete resource.id;
    if (!resourceId) {
      apiCall$ = this.httpClient.post<T>(
        `${this.environmentService.apiUrl}${this.resource}`,
        resource,
      );
    } else {
      apiCall$ = this.httpClient.patch<T>(
        `${this.environmentService.apiUrl}${this.resource}/${resourceId}`,
        resource,
      );
    }

    return apiCall$.pipe(take(1));
  }

  /** Fetches all resources from the API for the giver resource */
  public getAll(): Observable<T[]> {
    return this.httpClient.get<T[]>(`${this.environmentService.apiUrl}${this.resource}`);
  }

  /**
   * Fetches resources from the api with some filter applied
   * @param pageRequest The parameters to paginate and sort filtered resources
   * @param dto The DTO to filter resources on indexed fields
   */
  public search(pageRequest: PageRequest<T>, dto: SearchDto): Observable<Page<T>> {
    return this.httpClient.post<Page<T>>(
      `${this.environmentService.apiUrl}${this.resource}/search`,
      {
        ...pageRequest,
        ...dto,
      },
    );
  }
}
