import { Observable } from 'rxjs';
import { ApiPagination } from 'src/app/shared/models/api/api-pagination.model';

export interface Sort<T> {
  /** Field of the model that will be sorted */
  field: keyof T;
  /** Sorting order. May be -1 (descending) or 1 (ascending) */
  order: 1 | -1;
}

export interface PageRequest<T> {
  /** Number of items we want per page */
  length: number;
  /** Index of the page we want to fetch */
  page: number;
  /** How we want the data to be sorted */
  sort?: Sort<T>;
}

export interface LoadMore<T> extends PageRequest<T> {
  /** Indicates if more data can be loaded */
  canLoadMore: boolean;
}

export interface ApiResult {
  /** True if the request is successfull, false otherwise */
  success: boolean;
}

export interface Page<T> extends ApiResult {
  /** Data fetched by the API */
  data: T[];
  /** Information about the pagination returned by the api */
  pagination: ApiPagination;
}

export interface Detail<T> extends ApiResult {
  /** Data fetched by the API */
  data: T;
}

export type PaginatedEndpoint<T, Q> = (pageable: PageRequest<T>, query: Q) => Observable<Page<T>>;
