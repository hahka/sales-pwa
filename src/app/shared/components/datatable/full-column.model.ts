import { ColumnType } from './column-type.enum';

export class FullColumn<T> {
  /** A property of the object that will be displyed on the datatable */
  field: string;

  /** Label used to translate the property name */
  label: string;

  /** Type used to customize column display */
  type?: ColumnType;

  /** A resolve function to resolve data value */
  resolve?: (_: T) => any;
}
