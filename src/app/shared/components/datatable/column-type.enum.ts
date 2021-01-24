export enum ColumnType {
  /** A simple string value to display as it is */
  string = 'string',
  /** A label to be translated */
  label = 'label',
  /** Displays month (e.g. "January") and year depending on locale (date pipe) */
  month_year = 'month_year',
  /** Displays day (e.g. "17"), month (e.g. "January") and year depending on locale (date pipe) */
  day_month_year = 'day_month_year',
}
