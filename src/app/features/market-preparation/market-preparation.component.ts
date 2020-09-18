import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MarketSalesService } from '../../core/services/features/market-sales.service';
import { SettingsDialogData } from '../../shared/components/settings-dialog/settings-dialog-data.model';
import { SettingsDialogComponent } from '../../shared/components/settings-dialog/settings-dialog.component';
import { MarketSales } from '../../shared/models/market-sales.model';
import {
  PRODUCT_CATEGORIES as PC,
  STOCK_CATEGORIES as SC,
  STOCK_FUNCTIONALITIES,
} from '../../utils/enums';
import { StockAction, StockComponent } from '../stock/stock.component';

@Component({
  selector: 'app-market-preparation',
  templateUrl: './market-preparation.component.html',
  styleUrls: ['./market-preparation.component.scss'],
})
export class MarketPreparationComponent {
  @ViewChild(StockComponent, { static: true }) stockComponent: StockComponent;

  stockFunctionnality = STOCK_FUNCTIONALITIES.MARKET_PREPARATION;

  StockAction = StockAction;
  categories: SC[] = [];

  market = new FormControl();

  marketSales: MarketSales;

  constructor(
    private readonly matDialog: MatDialog,
    private readonly marketSalesService: MarketSalesService,
  ) {
    this.marketSalesService.getMarketSales().subscribe((marketSales) => {
      this.marketSales = new MarketSales(marketSales);
      if (!this.marketSales.categories || !this.marketSales.categories.length) {
        this.openSettings();
      } else {
        this.updateCategories();
      }
    });
  }

  onClick(action: StockAction) {
    if (action === StockAction.SAVE) {
      if (this.stockComponent) {
        this.stockComponent.updateStock();
        this.marketSalesService.put(this.marketSales);
      }
    }
  }

  openSettings() {
    if (this.marketSales) {
      const dialogRef = this.matDialog.open(SettingsDialogComponent, {
        data: {
          marketId: this.marketSales.marketId,
          categories: this.marketSales.categories,
        },
      });

      dialogRef.afterClosed().subscribe((result: SettingsDialogData) => {
        if (result) {
          this.marketSales.marketId = result.marketId;
          this.marketSales.categories = result.categories;
          this.marketSales.marketName = result.marketName;
        }
        this.updateCategories();
      });
    }
  }

  updateCategories() {
    if (this.marketSales.categories) {
      this.categories = this.marketSales.categories.map((category) => {
        switch (category) {
          case PC.FROZEN:
            return SC.SMALL_FREEZER;
          case PC.PASTEURIZED:
            return SC.PASTEURIZED;
          case PC.FRESH:
          default:
            return SC.FRESH;
        }
      });
    } else {
      this.categories = [];
    }
  }

  isValid() {
    const ms = this.marketSales;

    return ms && ms.marketId && ms.categories && ms.categories.length;
  }
}
