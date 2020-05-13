import { Component, Input } from '@angular/core';
import { ApiDataSource } from '../../../models/api/api-datasource.model';

@Component({
  selector: 'app-sort-indicator',
  templateUrl: './sort-indicator.component.html',
  styleUrls: ['./sort-indicator.component.scss'],
})
export class SortIndicatorComponent<T> {
  /** DataSource with the sort subject used in the template to display arrow correctly */
  @Input() dataSource: ApiDataSource<T>;

  /** Field of the current column, to know if we're sorting on it */
  @Input() field: keyof T;
}
