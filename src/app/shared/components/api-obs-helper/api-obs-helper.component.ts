import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api/api.service';
import { Market } from '../../models/market.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-api-obs-helper',
  templateUrl: './api-obs-helper.component.html',
  styleUrls: ['./api-obs-helper.component.scss'],
})
export class ApiObsHelperComponent<T extends Product | Market> {
  /** The apiService corresponding to the current resource */
  _apiService: ApiService<T>;

  /**
   * This is setted via parent component ngAfterOnInit to prevent passing Input in multiple templates.
   * @see {@link ApiObsHelperComponent#_apiService}
   */
  set apiService(apiService: ApiService<T>) {
    this._apiService = apiService;
  }
  get apiService(): ApiService<T> {
    return this._apiService;
  }

  /** Event sending the result of the creation/update of the resource */
  @Output() postedOrPatched: EventEmitter<T> = new EventEmitter();

  /** Event sending the result of the creation/update of the resource */
  @Output() httpError: EventEmitter<HttpErrorResponse> = new EventEmitter();

  /**
   * Wether we need to create/update the resource.
   * This will display the div handling the api observable call
   */
  posting = false;

  /** The observable for the creation/update of the resource */
  posting$: Observable<T>;

  /**
   * Called when we want to archive the resource
   * @param id Id of the resource to archive
   * @param unarchive Wether we want to unarchive or archive the resource
   */
  archive(id: string, unarchive?: boolean): void {
    this.posting$ = this.apiService
      .archiveById(id, unarchive)
      .pipe(
        map((apiResponse) => {
          this.posting = false;
          this.postedOrPatched.emit(apiResponse);

          return apiResponse;
        }),
      )
      .pipe(
        catchError((err) => {
          this.httpError.emit(err);

          return throwError(err);
        }),
      );
    this.posting = true;
  }

  /**
   * Called on form submit, used to post/patch defect category
   * @param value The new value of the resource
   */
  postOrPatch(value: T): void {
    this.posting$ = this.apiService
      .postOrPatch(value)
      .pipe(
        map((apiResponse) => {
          this.posting = false;
          this.postedOrPatched.emit(apiResponse);

          return apiResponse;
        }),
      )
      .pipe(
        catchError((err) => {
          this.httpError.emit(err);

          return throwError(err);
        }),
      );
    this.posting = true;
  }
}
