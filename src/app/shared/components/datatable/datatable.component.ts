import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { ApiDataSource } from '../../models/api/api-datasource.model';
import { BaseModel } from '../../models/api/base.model';
import { ColumnType } from './column-type.enum';
import { DatatableClickEvent } from './datatable-click-event.enum';
import { FullColumn } from './full-column.model';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DatatableComponent<T extends BaseModel> implements OnDestroy {
  ColumnType = ColumnType;
  /** Returns the list of columns to display */
  get fullColumns(): FullColumn<T>[] {
    return this._fullColumns;
  }

  /** Sets the list of columns to display and the displayedColumns array used by datatable to identify columns */
  @Input() set fullColumns(fullColumns: FullColumn<T>[]) {
    this._fullColumns = fullColumns;
    if (this.fullColumns && this.fullColumns.length) {
      this.displayedColumns = this.fullColumns.map((col) => col.field);
    }
  }

  subscription: Subscription = Subscription.EMPTY;

  /** DataSource to fetch data from the api and handle search and sort */
  @Input() clickEvent = DatatableClickEvent.REDIRECT;

  // TODO: refactor input with an options input?
  @Input() showAddButton = true;

  /** DataSource to fetch data from the api and handle search and sort */
  @Input() dataSource: ApiDataSource<T>;

  /** Boolean to show/hide the columns header (mat-header-row) */
  @Input() headerRowOptions = { isDisplayed: true, canSort: true };

  /** Boolean to show/hide the datatable header */
  @Input() showDatatableHeader = true;

  /** Boolean to show/hide the page header */
  @Input() showPageHeader = true;

  /** Boolean to show/hide the archive filter */
  @Input() showArchivedFilter = true;

  /** Title to display for the datatable */
  @Input() datatableTitle: string;

  /** Activated object, to highlight row if datatable is still displayed */
  @Input() activatedObject: T;

  /** Fired when a row has been clicked */
  @Output() rowClicked: EventEmitter<BaseModel> = new EventEmitter();

  /** Array of strings that is used by mat-table to identify columns */
  displayedColumns: string[] = [];

  /** List of columns to display */
  private _fullColumns: FullColumn<T>[];

  constructor(private readonly activatedRoute: ActivatedRoute, private readonly router: Router) {}

  /** Redirects to the detail page of clicked row */
  onRowClick(row: BaseModel): void {
    if (this.clickEvent === DatatableClickEvent.REDIRECT) {
      this.router.navigate(['.', row.id], { relativeTo: this.activatedRoute });
    } else {
      this.rowClicked.emit(row);
    }
  }

  /**
   * Sorts the wanted field with the wanted direction, or undefined if no direction (no default sort)
   */
  onSortChange(active: keyof T, direction: 'asc' | 'desc' | ''): void {
    if (this.headerRowOptions && this.headerRowOptions.canSort) {
      if (!direction) {
        this.dataSource.sortBy(undefined);
      } else {
        this.dataSource.sortBy({
          field: active,
          order: direction === 'asc' ? 1 : -1,
        });
      }
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
