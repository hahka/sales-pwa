import { Observable } from 'rxjs';
import { ApiPagination } from 'src/app/shared/models/api/api-pagination.model';
import { BaseModel } from 'src/app/shared/models/api/base.model';

export interface Sort<T extends BaseModel> {
  /** Field of the model that will be sorted */
  field: keyof T;
  /** Sorting order. May be -1 (descending) or 1 (ascending) */
  order: 1 | -1;
}

export interface PageRequest<T extends BaseModel> {
  /** Number of items we want per page */
  length: number;
  /** Index of the page we want to fetch */
  page: number;
  /** How we want the data to be sorted */
  sort?: Sort<T>;
}

export interface LoadMore<T extends BaseModel> extends PageRequest<T> {
  /** Indicates if more data can be loaded */
  canLoadMore: boolean;
}

export interface ApiResult {
  /** True if the request is successfull, false otherwise */
  success: boolean;
}

export interface Page<T extends BaseModel> extends ApiResult {
  /** Data fetched by the API */
  data: T[];
  /** Information about the pagination returned by the api */
  pagination: ApiPagination;
}

export interface Detail<T extends BaseModel> extends ApiResult {
  /** Data fetched by the API */
  data: T;
}

export type PaginatedEndpoint<T extends BaseModel, Q> = (
  pageable: PageRequest<T>,
  query: Q,
) => Observable<Page<T>>;
