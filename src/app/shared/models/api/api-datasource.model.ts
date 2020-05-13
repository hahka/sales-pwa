import { DataSource } from '@angular/cdk/table';
import { PageEvent } from '@angular/material/paginator';

import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { debounceTime, pluck, share, switchMap } from 'rxjs/operators';

import { Page, PaginatedEndpoint, Sort } from '../../../core/services/api';

import { ApiDataSourceOptions } from './api-datasource-options.model';
import { SearchDto } from './search-dto.model';

export class ApiDataSource<T> extends DataSource<T> {
  /** Observable that will receive data from the API */
  public page$: Observable<Page<T>>;

  public data: T[];

  /** Initial sort that will be used when sorting on no column in datatable */
  private readonly initialSort: Sort<T> | undefined;

  /** Subject containing page index. Updated via MatPaginator */
  private readonly pageIndex: BehaviorSubject<number>;

  /** Subject containing page size. Updated via MatPaginator */
  private readonly pageSize = new BehaviorSubject<number>(20);

  /** BehaviorSubject for search params. Should trigger api call */
  private readonly query: BehaviorSubject<SearchDto>;

  /** Subject containing sorting informations. Updated via MatDataTable. Should trigger api call */
  private readonly sort: BehaviorSubject<Sort<T> | undefined>;

  private _dataSubscription: Subscription = Subscription.EMPTY;

  constructor(endpoint: PaginatedEndpoint<T, SearchDto>, options: ApiDataSourceOptions<T>) {
    super();
    const { initialSort, initialQuery } = options;

    this.query = new BehaviorSubject<SearchDto>(initialQuery);

    this.initialSort = initialSort;

    this.sort = new BehaviorSubject<Sort<T> | undefined>(this.initialSort);
    this.pageIndex = new BehaviorSubject<number>(0);

    const param$ = combineLatest([this.query, this.sort, this.pageIndex, this.pageSize]);
    this.page$ = param$.pipe(
      debounceTime(150),
      switchMap(([query, sort, pageIndex, length]) => {
        /**
         * If sort is undefined but there is an initial sort, user will not be noticed on the interface
         * but the initial sort will be used to fetch data from the api.
         */
        const apiSort = sort || this.initialSort;

        return endpoint({ length, page: pageIndex, sort: apiSort }, query);
      }),
      share(),
    );
  }

  /** @inheritdoc */
  connect(): Observable<T[]> {
    return this.page$.pipe(pluck('data')).pipe((s) => {
      this._dataSubscription.unsubscribe();
      this._dataSubscription = s.subscribe((d) => (this.data = d));

      return s;
    });
  }

  /** @inheritdoc */
  disconnect(): void {
    this._dataSubscription.unsubscribe();
  }

  /** Getter for the sort property so it can be used via async pipes */
  getCurrentPage(): BehaviorSubject<number> {
    return this.pageIndex;
  }

  /** Getter for the query property so it can be used via async pipes */
  getQuery(): BehaviorSubject<SearchDto> {
    return this.query;
  }

  /** Getter for the sort property so it can be used via async pipes */
  getSort(): BehaviorSubject<Sort<T> | undefined> {
    return this.sort;
  }

  /**
   * Function called by the interfaces where a user can search for resources.
   * Need to reset page to 0 then update query subject.
   * @param query Data that will be used to query and filter resources
   */
  queryBy(query: Partial<SearchDto>): void {
    this.pageIndex.next(0);
    this.updateQuerySubject(query);
  }

  /**
   * Updates the sort subject, which will be used to fetch data from API
   * @param sort A sort object ({field, order}), or undefined if there is no sorted column
   */
  sortBy(sort?: Sort<T>): void {
    this.sort.next(sort);
  }

  /**
   * Updates the pageIndex and pageSize subjects, which will be used to fetch data from API
   * @param pageEvent The pageEvent from the MatPaginator. PageIndex is 0-indexed.
   */
  updatePageOptions(pageEvent: PageEvent): void {
    this.pageIndex.next(pageEvent.pageIndex);
    this.pageSize.next(pageEvent.pageSize);
  }

  /**
   * Updates the query subject with new values (either from user inputs or when going back from detail).
   * This should trigger the observable that will fetch data from api.
   */
  private updateQuerySubject(query: Partial<SearchDto>): void {
    const lastQuery = this.query.getValue();
    const nextQuery = { ...lastQuery, ...query };
    this.query.next(nextQuery);
  }
}
