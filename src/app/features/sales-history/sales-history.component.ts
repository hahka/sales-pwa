import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { filter, switchMap, tap } from 'rxjs/operators';
import { SettingsDialogData } from 'src/app/shared/components/settings-dialog/settings-dialog-data.model';
import { SettingsDialogComponent } from 'src/app/shared/components/settings-dialog/settings-dialog.component';
import { MarketSalesService } from '../../core/services/features/market-sales.service';
import { AbstractListComponent } from '../../shared/components/abstract-list/abstract-list.component';
import { ColumnType } from '../../shared/components/datatable/column-type.enum';
import { FullColumn } from '../../shared/components/datatable/full-column.model';
import { ApiDataSource } from '../../shared/models/api/api-datasource.model';
import { MarketSales } from '../../shared/models/market-sales.model';
import { TypeHelper } from '../../utils/type-helper';
import { formatMarketSalesDate } from '../../utils/utils';

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
      type: ColumnType.string,
      resolve: (marketSales: MarketSales) => formatMarketSalesDate(marketSales),
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
      resolve: (marketSales: MarketSales) => `${marketSales.income} €`,
    },
  ];

  listPersistenceKey: 'marketSales';

  constructor(
    private readonly marketSalesService: MarketSalesService,
    private readonly matDialog: MatDialog,
    private readonly toastrService: ToastrService,
  ) {
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

  addHistoryEntry() {
    this.matDialog
      .open<SettingsDialogComponent, SettingsDialogData, MarketSales>(SettingsDialogComponent, {
        data: {
          marketSales: new MarketSales(),
          forHistory: true,
        },
      })
      .afterClosed()
      .pipe(
        filter(TypeHelper.isNotNullOrUndefined),
        switchMap((marketSales) => {
          marketSales.isClosed = true;

          return this.marketSalesService.put(marketSales);
        }),
        switchMap(() => this.marketSalesService.synchronizeUp()),
        tap(() => this.toastrService.success(`Données envoyées au serveur avec succès`)),
      )
      .subscribe();
  }
}
