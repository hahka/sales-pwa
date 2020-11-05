import { MatPaginatorIntl } from '@angular/material/paginator';

const frenchRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length === 0 || pageSize === 0) {
    return `0 van ${length}`;
  }

  const securedLength = Math.max(length, 0);

  const startIndex = page * pageSize;

  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex =
    startIndex < securedLength
      ? Math.min(startIndex + pageSize, securedLength)
      : startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} sur ${securedLength}`;
};

export function getFrenchPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'Éléments par page:';
  paginatorIntl.nextPageLabel = 'Page suivante';
  paginatorIntl.previousPageLabel = 'Page précédente';
  paginatorIntl.getRangeLabel = frenchRangeLabel;

  return paginatorIntl;
}
