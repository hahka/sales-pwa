import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { switchMap, tap } from 'rxjs/operators';
import { SettingsDialogData } from 'src/app/shared/components/settings-dialog/settings-dialog-data.model';
import { SettingsDialogComponent } from 'src/app/shared/components/settings-dialog/settings-dialog.component';
import { MarketSalesService } from '../../core/services/features/market-sales.service';
import { ConfirmationDialogService } from '../../shared/components/confirmation-dialog/confirmation-dialog.service';
import { MarketSalesComponent } from '../../shared/components/market-sales/market-sales.component';
import { MarketSales } from '../../shared/models/market-sales.model';
import { STOCK_CATEGORIES as SC, STOCK_FUNCTIONALITIES } from '../../utils/enums';
import { StockAction, StockComponent } from '../stock/stock.component';

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
    protected readonly marketSalesService: MarketSalesService,
    private readonly matDialog: MatDialog,
    private readonly confirmationDialogService: ConfirmationDialogService,
  ) {
    super(marketSalesService);
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
            marketSales: this.marketSales,
          },
        },
      );

      dialogRef.afterClosed().subscribe((result: MarketSales) => {
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
      this.confirmationDialogService
        .openConfirmationDialog(
          'Cloturer le marché actuel',
          'Voulez-vous vraiment cloturer le marché actuel?',
          'Attention, vous ne pourrez plus effectuer de ventes pour ce marché et devrez préparer un nouveau marché.',
        )
        .pipe(
          switchMap(() => this.marketSalesService.closeMarket(this.marketSales)),
          tap(() => this.loadMarketSales()),
        )
        .subscribe();
    }
  }
}
