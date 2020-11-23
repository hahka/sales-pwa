import { Component } from '@angular/core';
import { MarketSalesService } from '../../core/services/features/market-sales.service';
import { AbstractListComponent } from '../../shared/components/abstract-list/abstract-list.component';
import { ColumnType } from '../../shared/components/datatable/column-type.enum';
import { FullColumn } from '../../shared/components/datatable/full-column.model';
import { ApiDataSource } from '../../shared/models/api/api-datasource.model';
import { MarketSales } from '../../shared/models/market-sales.model';

@Component({
  selector: 'app-sales-history',
  templateUrl: './sales-history.component.html',
  styleUrls: ['./sales-history.component.scss'],
})
export class SalesHistoryComponent extends AbstractListComponent<MarketSales> {
  dataSource: ApiDataSource<MarketSales>;
  fullColumns: FullColumn<MarketSales>[] = [
    {
      field: 'start_date',
      label: 'Date',
      type: ColumnType.day_month_year,
      resolve: (marketSales: MarketSales) => marketSales.startDate,
    },
    {
      field: 'market_name',
      label: 'Marché',
      type: ColumnType.string,
      resolve: (marketSales: MarketSales) => marketSales.marketName,
    },
    {
      field: 'income',
      label: 'Résultat',
      type: ColumnType.string,
    },
  ];

  listPersistenceKey: 'marketSales';

  constructor(private readonly marketSalesService: MarketSalesService) {
    super(marketSalesService);
    this.dataSource = new ApiDataSource<MarketSales>(
      (request, query) => {
        return this.marketSalesService.search(request, query);
      },
      {
        initialQuery: { search: '' },
      },
    );
  }
}
