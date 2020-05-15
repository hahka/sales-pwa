import { ApiDataSource } from '../../models/api/api-datasource.model';
import { FullColumn } from '../datatable/full-column.model';

export abstract class AbstractListComponent<T> {
  /** DataSource that will be used to display data and centralize communication between app and api */
  abstract dataSource: ApiDataSource<T>;

  /** List of columns that will be displayed for the current list */
  abstract fullColumns: FullColumn<T>[];

  /** Key used */
  abstract listPersistenceKey: string;
}
