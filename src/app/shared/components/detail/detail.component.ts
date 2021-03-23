import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, HostBinding, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api/api.service';
import { BaseModel } from '../../models/api/base.model';
import { ApiObsHelperComponent } from '../api-obs-helper/api-obs-helper.component';
import { PageHeaderAction } from '../page-header/page-header-action.enum';
import { PageHeaderEvent } from '../page-header/page-header-event.interface';

export abstract class DetailComponent<T extends BaseModel> implements AfterViewInit, OnInit {
  /** ViewChild helping calling the api via observables without subscriptions */
  @ViewChild(ApiObsHelperComponent, { static: true }) apiObsHelper: ApiObsHelperComponent<T>;

  /** Class that is used in consumer's components to apply some style for the administration */
  @HostBinding('class') consumerClass = 'admin__detail';

  /** Observable of the api call returning a resource */
  detail$: Observable<T>;

  /** Id of the object */
  detailId: string;

  /** Observable of the object id */
  detailId$: Observable<string>;

  /** FormGroup patched by observables, used to display object information */
  form: FormGroup;

  /** Wether the object is archived or not. Needs to be updated at GET/PATCH */
  isArchived = false;

  /** Observable of the object post/patch, called via async pipe if {loading === true} */
  loading$: Observable<T>;

  /** BehaviorSubject used to refresh the data without subscription (only observable and asyncpipe) */
  refresh = new BehaviorSubject<string>('');

  /** Track all disabled field */
  disabledControls: string[] = [];

  constructor(
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly apiService: ApiService<T>,
    protected readonly location: Location,
    protected readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.detail$ = this.refresh.asObservable().pipe(
      switchMap((refreshedId) => {
        this.detailId = refreshedId || '';
        if (this.detailId === 'new') {
          // Creation mode, returning a "fake" observable returning an empty data
          return of(this.newData());
        }
        this.form.disable();

        // Edition mode, returning an api call
        return this.apiService.getById(this.detailId).pipe(
          tap((data) => {
            this.patchForm(data);
            this.disable();
          }),
        );
      }),
    );

    this.detailId$ = this.activatedRoute.paramMap.pipe(
      map((paramMap) => {
        const detailId = paramMap.get('id') || '';
        this.refresh.next(detailId);

        return detailId;
      }),
    );
  }

  /** Needs to return a new object when form is in creation mode */
  abstract newData(): T;

  /** Returns the Object in the format used by the api. This function can be overridden in components when needed */
  abstract getFormattedData(): T;

  /** Needs to update this.isArchived and to patch the form and differents FormControls/FormGroups */
  abstract patchForm(data: T): void;

  /**
   * Called when the user click on archive via PageHeaderComponent
   */
  archive(): void {
    this.apiObsHelper.archive(this.detailId, this.isArchived);
  }

  /** Disables the FormGroup. Can be overridden if FormGroup needs specific processing to be disabled */
  disable(): void {
    if (this.form) {
      this.form.disable();
    }
  }

  /** Enables the FormGroup. Can be overridden if FormGroup needs specific processing to be enabled */
  enable(): void {
    if (this.form) {
      this.form.enable();
      this.disabledControls.forEach((key: string) => {
        const control = this.form.get(key);
        if (control) {
          control.disable();
        }
      });
    }
  }

  /**
   * @inheritdoc
   * Here we need to set the apiService for the apiObsHelper
   */
  ngAfterViewInit(): void {
    if (this.apiObsHelper) {
      this.apiObsHelper.apiService = this.apiService;
    }
  }

  /**
   * Handles events send by the page header
   * @param pageHeaderEvent Event sent by the page header
   */
  onPageHeaderEvent(pageHeaderEvent: PageHeaderEvent): void {
    switch (pageHeaderEvent.action) {
      case PageHeaderAction.BACK:
        this.location.back();
        break;
      case PageHeaderAction.CANCEL:
        if (this.detailId !== 'new') {
          this.refresh.next(this.detailId);
          this.disable();
        } else {
          this.location.back();
        }
        break;
      case PageHeaderAction.ARCHIVE:
        this.archive();
        break;
      case PageHeaderAction.UPDATE:
        this.enable();
        break;
      case PageHeaderAction.SAVE:
        this.submit();
        break;
    }
  }

  /**
   * Redirects to parent page
   * @param data The created/updated resource returned by the api
   */
  onPostedOrPatched(_data: T): void {
    // Old behavior, redirecting to newly created data, or disabling the form
    // if (this.detailId === 'new' && data.id) {
    //   this.router.navigate(['..', data.id], {
    //     relativeTo: this.activatedRoute,
    //     replaceUrl: true,
    //   });
    // } else {
    //   this.patchForm(data);
    //   this.disable();
    // }

    this.router.navigate(['..'], {
      relativeTo: this.activatedRoute,
    });
  }

  /** Called on form submit, used to post/patch defect category */
  submit(): void {
    if (this.form && this.form.valid) {
      this.apiObsHelper.postOrPatch(this.getFormattedData());
    }
  }

  /**
   * Handle api errors
   * @param httpError the http error
   */
  onHttpError(httpError: HttpErrorResponse): void {
    if (httpError.error && httpError.error.code && httpError.error.code.indexOf('DUP') > -1) {
      // duplicated name
      if (this.form.controls.name) {
        this.form.controls.name.setErrors({ duplicated: true });
      }
    }
  }
}
