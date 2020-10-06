export class ApiPagination {
  /** Length of page (number of items per page) */
  length: number;
  /** The page index (0 being the first page) of the result returned by the api */
  page: number;
  /** Total number of items matching the query */
  total: number;
}
