export enum ColumnType {
  /** A simple string value to display as it is */
  string = 'string',
  /** A label to be translated */
  label = 'label',
  /** A state's label with a color chip */
  state = 'state',
  /** Displays month (e.g. "January") and year depending on locale (date pipe) */
  month_year = 'month_year',
}
