import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DatatableClickEvent } from 'src/app/shared/components/datatable/datatable-click-event.enum';
import { SettingsDialogData } from 'src/app/shared/components/settings-dialog/settings-dialog-data.model';
import { SettingsDialogComponent } from 'src/app/shared/components/settings-dialog/settings-dialog.component';
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
  datatableClickEvent = DatatableClickEvent.OUTPUT;

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
      resolve: (marketSales: MarketSales) => `${marketSales.income} €`,
    },
  ];

  listPersistenceKey: 'marketSales';

  constructor(
    private readonly marketSalesService: MarketSalesService,
    private readonly matDialog: MatDialog,
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
    const dialogRef = this.matDialog.open<SettingsDialogComponent, SettingsDialogData>(
      SettingsDialogComponent,
      {
        data: {
          marketSales: new MarketSales(),
          forHistory: true,
        },
      },
    );

    dialogRef.afterClosed().subscribe((dialogResponse: MarketSales) => {
      if (dialogResponse) {
        dialogResponse.isClosed = true;
        let subscription: Subscription;
        subscription = this.marketSalesService.put(dialogResponse).subscribe((_) => {
          if (subscription && !subscription.closed) {
            subscription.unsubscribe();
          }
          this.marketSalesService.synchronizeUp();
        });
      }
    });
  }
}
