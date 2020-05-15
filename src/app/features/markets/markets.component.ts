import { Component } from '@angular/core';
import { MarketsService } from 'src/app/core/services/features/markets.service';
import { AbstractListComponent } from 'src/app/shared/components/abstract-list/abstract-list.component';
import { ColumnType } from 'src/app/shared/components/datatable/column-type.enum';
import { FullColumn } from 'src/app/shared/components/datatable/full-column.model';
import { ApiDataSource } from 'src/app/shared/models/api/api-datasource.model';
import { Market } from 'src/app/shared/models/market.model';

@Component({
  selector: 'app-markets',
  templateUrl: './markets.component.html',
  styleUrls: ['./markets.component.scss'],
})
export class MarketsComponent extends AbstractListComponent<Market> {
  dataSource: ApiDataSource<Market>;
  fullColumns: FullColumn<Market>[] = [
    {
      field: 'name',
      label: 'common.name',
      type: ColumnType.string,
    },
  ];

  listPersistenceKey: 'markets';

  constructor(private readonly marketsService: MarketsService) {
    super();
    this.dataSource = new ApiDataSource<Market>(
      (request, query) => {
        return this.marketsService.search(request, query);
      },
      {
        initialQuery: { search: '' },
      },
    );
  }
}
