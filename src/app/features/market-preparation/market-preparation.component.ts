import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SettingsDialogData } from 'src/app/shared/components/settings-dialog/settings-dialog-data.model';
import { SettingsDialogComponent } from 'src/app/shared/components/settings-dialog/settings-dialog.component';
import { MarketSalesService } from '../../core/services/features/market-sales.service';
import { MarketSalesComponent } from '../../shared/components/market-sales/market-sales.component';
import { MarketSales } from '../../shared/models/market-sales.model';
import { STOCK_CATEGORIES as SC, STOCK_FUNCTIONALITIES } from '../../utils/enums';
import { StockAction, StockComponent } from '../stock/stock.component';
import { CloseMarketDialogComponent } from './close-market-dialog/close-market-dialog.component';

@Component({
  selector: 'app-market-preparation',
  templateUrl: './market-preparation.component.html',
  styleUrls: ['./market-preparation.component.scss'],
})
export class MarketPreparationComponent extends MarketSalesComponent {
  @ViewChild(StockComponent, { static: true }) stockComponent: StockComponent;

  SF = STOCK_FUNCTIONALITIES;

  StockAction = StockAction;
  categories: SC[] = [];

  market = new FormControl();

  marketSales: MarketSales;

  constructor(
    protected readonly matDialog: MatDialog,
    protected readonly marketSalesService: MarketSalesService,
  ) {
    super(matDialog, marketSalesService);
  }

  marketNotReadyHandler(): void {
    this.openSettings();
  }

  onClick(action: StockAction) {
    if (action === StockAction.SAVE) {
      // Market has been prepared, need to update stock and market informations (market and categories)
      if (this.stockComponent) {
        this.stockComponent.updateStock();
        this.marketSalesService.put(this.marketSales);
      }
    }
  }

  openSettings() {
    if (this.marketSales) {
      const dialogRef = this.matDialog.open<SettingsDialogComponent, SettingsDialogData>(
        SettingsDialogComponent,
        {
          data: {
            marketId: this.marketSales.marketId,
            marketName: this.marketSales.marketName,
            categories: this.marketSales.categories || [],
            startDate: this.marketSales.startDate,
            endDate: this.marketSales.endDate,
          },
        },
      );

      dialogRef.afterClosed().subscribe((result: SettingsDialogData) => {
        if (result) {
          this.marketSales.marketId = result.marketId;
          this.marketSales.categories = result.categories;
          this.marketSales.marketName = result.marketName;
          this.marketSales.startDate = result.startDate;
          this.marketSales.endDate = result.endDate;
        }
        this.updateCategories();
      });
    }
  }

  isValid() {
    const ms = this.marketSales;

    return ms && ms.marketId && ms.categories && ms.categories.length;
  }

  closeMarket() {
    if (this.marketSales) {
      const dialogRef = this.matDialog.open(CloseMarketDialogComponent);

      dialogRef.afterClosed().subscribe((result: { confirm: boolean }) => {
        if (result && result.confirm) {
          this.marketSalesService.closeMarket(this.marketSales).subscribe((_) => {
            this.loadMarketSales();
          });
        }
      });
    }
  }
}
